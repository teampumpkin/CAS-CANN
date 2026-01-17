type Environment = 'staging' | 'production';

export function useEnvironment(): Environment {
  const env = import.meta.env.VITE_ENVIRONMENT as string | undefined;
  
  if (env === 'production') {
    return 'production';
  }
  
  return 'staging';
}

export function isStaging(): boolean {
  const env = import.meta.env.VITE_ENVIRONMENT as string | undefined;
  return env !== 'production';
}

export function isProduction(): boolean {
  const env = import.meta.env.VITE_ENVIRONMENT as string | undefined;
  return env === 'production';
}
