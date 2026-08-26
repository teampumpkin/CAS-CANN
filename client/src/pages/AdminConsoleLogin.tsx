import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Shield,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Loader2,
  AlertCircle,
  Clock,
  ArrowRight,
} from "lucide-react";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import casLogo from "@assets/l_cas_vert_rgb_1753253116732.png";

// ---------------------------------------------------------------------------
// Types mirroring server/admin-auth-routes.ts
// ---------------------------------------------------------------------------

interface AdminProfile {
  id: number;
  email: string;
  role: "admin" | "superadmin";
  isActive: boolean;
  lastLoginAt: string | null;
  createdAt: string;
}

/** Login only checks presence/shape. Password policy is enforced server-side. */
const loginSchema = z.object({
  email: z.string().min(1, "Email is required").email("Enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

type LoginForm = z.infer<typeof loginSchema>;

type FormError =
  | { kind: "invalid"; message: string }
  | { kind: "lockout"; message: string }
  | { kind: "server"; message: string };

export default function AdminConsoleLogin() {
  const [, navigate] = useLocation();
  const [checkingSession, setCheckingSession] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<FormError | null>(null);

  const form = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  // Resume an existing session rather than showing a login form to someone
  // who is already signed in.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/admin/auth/me", { credentials: "include" });
        if (!cancelled && res.ok) {
          // Already signed in — go straight to the console.
          navigate("/admin/leads");
          return;
        }
      } catch {
        // Network failure here just means "show the login form".
      } finally {
        if (!cancelled) setCheckingSession(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const onSubmit = async (data: LoginForm) => {
    setError(null);
    setSubmitting(true);

    try {
      const res = await fetch("/api/admin/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // required: the session lives in a cookie
        body: JSON.stringify(data),
      });

      const body = await res.json().catch(() => ({}));

      if (res.ok) {
        form.reset();
        // Honour ?next= so a deep link can bounce through login; otherwise
        // land on the console.
        const next = new URLSearchParams(window.location.search).get("next");
        navigate(
          next && next.startsWith("/") && !next.startsWith("//")
            ? next
            : "/admin/leads",
        );
        return;
      }

      // Status codes come from server/admin-auth-routes.ts. 401 is deliberately
      // identical for wrong password, unknown email, and deactivated account —
      // do not try to distinguish them here.
      if (res.status === 429) {
        setError({
          kind: "lockout",
          message:
            body.message ?? "Too many failed attempts. Please try again later.",
        });
      } else if (res.status === 400 || res.status === 401) {
        setError({
          kind: "invalid",
          message: body.message ?? "Invalid email or password.",
        });
        form.setValue("password", "");
      } else {
        setError({
          kind: "server",
          message: "Something went wrong. Please try again.",
        });
      }
    } catch {
      setError({
        kind: "server",
        message: "Could not reach the server. Check your connection.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  // ---------------------------------------------------------------------------
  // Login form
  // ---------------------------------------------------------------------------
  return (
    <div className="min-h-[calc(100vh-6rem)] bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden">
          {/* Brand header */}
          <div className="bg-gradient-to-r from-[#00AFE6] to-[#00DD89] px-6 pt-6 pb-7 text-white text-center">
            <div className="bg-white/95 rounded-2xl w-fit mx-auto px-4 py-3 mb-4 shadow-lg">
              <img
                src={casLogo}
                alt="Canadian Amyloidosis Society"
                className="h-12 w-auto"
              />
            </div>
            <div className="flex items-center justify-center gap-2 mb-1">
              <Shield className="w-5 h-5" aria-hidden="true" />
              <h1 className="text-2xl font-bold" data-testid="text-admin-login-title">
                Admin Portal
              </h1>
            </div>
            <p className="text-white/80 text-sm">
              Sign in to manage site content
            </p>
          </div>

          {/* Form */}
          <div className="p-6">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
                noValidate
              >
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field, fieldState }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700 dark:text-gray-300">
                        Email address
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Mail
                            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none"
                            aria-hidden="true"
                          />
                          <Input
                            {...field}
                            type="email"
                            inputMode="email"
                            autoComplete="username"
                            autoFocus
                            spellCheck={false}
                            placeholder="you@amyloid.ca"
                            aria-invalid={!!fieldState.error}
                            className="h-11 pl-10 bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700 focus-visible:ring-[#00AFE6]"
                            data-testid="input-admin-email"
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field, fieldState }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700 dark:text-gray-300">
                        Password
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Lock
                            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none"
                            aria-hidden="true"
                          />
                          <Input
                            {...field}
                            type={showPassword ? "text" : "password"}
                            autoComplete="current-password"
                            placeholder="Enter your password"
                            aria-invalid={!!fieldState.error}
                            className="h-11 pl-10 pr-11 bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700 focus-visible:ring-[#00AFE6]"
                            data-testid="input-admin-password"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword((v) => !v)}
                            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
                            aria-label={
                              showPassword ? "Hide password" : "Show password"
                            }
                            aria-pressed={showPassword}
                            tabIndex={-1}
                            data-testid="button-toggle-password"
                          >
                            {showPassword ? (
                              <EyeOff className="w-4 h-4" />
                            ) : (
                              <Eye className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <AnimatePresence mode="wait">
                  {error && (
                    <motion.div
                      key={error.kind + error.message}
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div
                        role="alert"
                        aria-live="assertive"
                        className={`flex items-start gap-2.5 rounded-lg p-3 text-sm border ${
                          error.kind === "lockout"
                            ? "bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300"
                            : "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-700 dark:text-red-400"
                        }`}
                        data-testid="text-admin-login-error"
                      >
                        {error.kind === "lockout" ? (
                          <Clock className="w-4 h-4 mt-0.5 shrink-0" aria-hidden="true" />
                        ) : (
                          <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" aria-hidden="true" />
                        )}
                        <span>{error.message}</span>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <Button
                  type="submit"
                  disabled={submitting}
                  className="w-full h-11 bg-gradient-to-r from-[#00AFE6] to-[#00DD89] hover:from-[#00AFE6]/90 hover:to-[#00DD89]/90 text-white font-semibold shadow-md hover:shadow-lg transition-all disabled:opacity-70"
                  data-testid="button-admin-login"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Signing in…
                    </>
                  ) : (
                    <>
                      Sign in
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </>
                  )}
                </Button>
              </form>
            </Form>
          </div>

          {/* Footer note */}
          <div className="px-6 pb-6">
            <div className="flex items-start gap-2.5 rounded-xl bg-gray-50 dark:bg-gray-900/50 border border-gray-100 dark:border-gray-700 p-3">
              <Lock
                className="w-3.5 h-3.5 mt-0.5 text-gray-400 shrink-0"
                aria-hidden="true"
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                Restricted to authorized Canadian Amyloidosis Society staff.
                Lost access is restored by an administrator — there is no
                self-service password reset.
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
