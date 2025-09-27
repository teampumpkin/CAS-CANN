import { Request, Response, NextFunction } from "express";

// Configuration for the backend OAuth server
const BACKEND_CONFIG = {
  // Use the local development server as the OAuth backend
  host: process.env.OAUTH_BACKEND_HOST || 'localhost',
  port: process.env.OAUTH_BACKEND_PORT || '5000',
  protocol: process.env.OAUTH_BACKEND_PROTOCOL || 'http'
};

function getBackendUrl(): string {
  return `${BACKEND_CONFIG.protocol}://${BACKEND_CONFIG.host}:${BACKEND_CONFIG.port}`;
}

export async function proxyOAuthRequest(req: Request, res: Response, next: NextFunction) {
  try {
    const backendUrl = getBackendUrl();
    const targetUrl = `${backendUrl}${req.originalUrl}`;
    
    console.log(`[OAuth Proxy] Forwarding ${req.method} ${req.originalUrl} → ${targetUrl}`);
    
    // Prepare headers for forwarding
    const forwardHeaders: Record<string, string> = {
      'Content-Type': req.get('Content-Type') || 'application/json',
      'User-Agent': req.get('User-Agent') || 'OAuth-Proxy/1.0',
      'Accept': req.get('Accept') || '*/*'
    };
    
    // Forward host information
    if (req.get('host')) {
      forwardHeaders['X-Forwarded-Host'] = req.get('host') as string;
      forwardHeaders['X-Original-Host'] = req.get('host') as string;
    }
    
    // Forward any authorization headers
    if (req.get('authorization')) {
      forwardHeaders['Authorization'] = req.get('authorization') as string;
    }
    
    // Prepare fetch options
    const fetchOptions: RequestInit = {
      method: req.method,
      headers: forwardHeaders,
      redirect: 'manual' // Handle redirects manually to preserve them
    };
    
    // Add body for POST/PUT/PATCH requests
    if (['POST', 'PUT', 'PATCH'].includes(req.method) && req.body) {
      fetchOptions.body = typeof req.body === 'string' ? req.body : JSON.stringify(req.body);
    }
    
    // Make the request to backend
    const response = await fetch(targetUrl, fetchOptions);
    
    console.log(`[OAuth Proxy] Backend responded: ${response.status} ${response.statusText}`);
    
    // Handle redirects
    if (response.status >= 300 && response.status < 400) {
      const location = response.headers.get('location');
      if (location) {
        console.log(`[OAuth Proxy] Redirecting to: ${location}`);
        return res.redirect(response.status, location);
      }
    }
    
    // Copy response headers
    response.headers.forEach((value, key) => {
      // Skip headers that Express will set automatically
      if (!['content-encoding', 'transfer-encoding', 'connection'].includes(key.toLowerCase())) {
        res.setHeader(key, value);
      }
    });
    
    // Set response status
    res.status(response.status);
    
    // Check if response is JSON
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      const jsonData = await response.json();
      return res.json(jsonData);
    }
    
    // For HTML or other content types, stream the response
    const text = await response.text();
    return res.send(text);
    
  } catch (error) {
    console.error(`[OAuth Proxy] Error forwarding request:`, error);
    
    // Check if backend is unreachable
    if (error instanceof Error && (error.message.includes('ECONNREFUSED') || error.message.includes('fetch failed'))) {
      return res.status(503).json({
        error: 'OAuth backend unavailable',
        message: 'The OAuth service is temporarily unavailable. Please try again later.',
        backend: getBackendUrl()
      });
    }
    
    return res.status(500).json({
      error: 'Proxy error',
      message: error instanceof Error ? error.message : 'Unknown proxy error'
    });
  }
}

export function createOAuthProxyMiddleware() {
  return (req: Request, res: Response, next: NextFunction) => {
    // Only proxy OAuth-related requests
    if (req.path.startsWith('/oauth/') || req.path.startsWith('/api/oauth/')) {
      return proxyOAuthRequest(req, res, next);
    }
    next();
  };
}