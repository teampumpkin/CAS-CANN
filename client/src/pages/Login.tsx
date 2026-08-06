import { motion } from "framer-motion";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Lock, Mail, Eye, EyeOff, ArrowRight, ShieldCheck, Calendar, Video, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { loginSchema, type LoginCredentials } from "@shared/schema";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Link, useLocation } from "wouter";

interface LoginResponse {
  success: boolean;
  message: string;
  member?: {
    id: number;
    email: string;
    fullName: string;
    role: string;
    isCASMember: boolean;
    isCANNMember: boolean;
  };
}

const FEATURES = [
  { icon: Calendar, title: "Members-only events", desc: "Register for exclusive CAS & CANN webinars and conferences." },
  { icon: Video, title: "Event recordings", desc: "Catch up on past sessions and educational content anytime." },
  { icon: ShieldCheck, title: "Your profile & preferences", desc: "Manage your membership details and communication settings." },
];

export default function Login() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<LoginCredentials>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const loginMutation = useMutation({
    mutationFn: async (data: LoginCredentials): Promise<LoginResponse> => {
      const response = await apiRequest("POST", "/api/auth/login", data);
      return await response.json();
    },
    onSuccess: (data) => {
      if (data.success) {
        toast({ title: "Welcome back!", description: `Logged in as ${data.member?.fullName || "Member"}` });
        setLocation("/members-portal");
      } else {
        toast({ title: "Login Failed", description: data.message, variant: "destructive" });
      }
    },
    onError: (error: Error) => {
      toast({ title: "Login Failed", description: error.message || "Unable to login. Please check your credentials.", variant: "destructive" });
    },
  });

  const onSubmit = (data: LoginCredentials) => loginMutation.mutate(data);

  return (
    <div className="min-h-[calc(100vh-6rem)] grid lg:grid-cols-2 bg-slate-50 dark:bg-[#0b1120]">
      {/* ---------------- Brand panel (desktop) ---------------- */}
      <div className="relative hidden lg:flex flex-col justify-between overflow-hidden bg-gradient-to-br from-[#00AFE6] to-[#00DD89] p-12 text-white">
        <div className="absolute -top-24 -right-24 h-80 w-80 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -bottom-32 -left-20 h-80 w-80 rounded-full bg-white/10 blur-3xl" />
        <div className="relative">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/15 backdrop-blur px-4 py-1.5">
            <Sparkles className="w-4 h-4" />
            <span className="text-sm font-semibold">Members Portal</span>
          </div>
          <h2 className="mt-8 text-4xl xl:text-5xl font-bold font-rosarivo leading-tight">
            Welcome back to the<br />Canadian Amyloidosis<br />community.
          </h2>
          <p className="mt-4 text-white/85 max-w-md">
            Sign in to access exclusive events, recordings, and resources for CAS and CANN members.
          </p>
        </div>
        <div className="relative space-y-5 mt-10">
          {FEATURES.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="flex items-start gap-4">
              <div className="h-11 w-11 shrink-0 rounded-2xl bg-white/15 backdrop-blur flex items-center justify-center">
                <Icon className="w-5 h-5" />
              </div>
              <div>
                <p className="font-semibold">{title}</p>
                <p className="text-sm text-white/80">{desc}</p>
              </div>
            </div>
          ))}
        </div>
        <p className="relative text-xs text-white/70">© {new Date().getFullYear()} Canadian Amyloidosis Society</p>
      </div>

      {/* ---------------- Form panel ---------------- */}
      <div className="flex items-center justify-center p-6 sm:p-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          {/* Mobile brand mark */}
          <div className="lg:hidden mb-8 text-center">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-[#00AFE6] to-[#00DD89] mb-3">
              <ShieldCheck className="w-7 h-7 text-white" />
            </div>
          </div>

          <h1 className="text-3xl font-bold font-rosarivo text-slate-900 dark:text-white">Sign in</h1>
          <p className="mt-2 text-slate-500 dark:text-slate-400">Enter your credentials to access your members portal.</p>

          <div className="mt-8 rounded-3xl border border-slate-200/70 dark:border-white/10 bg-white dark:bg-white/[0.03] shadow-xl shadow-slate-200/50 dark:shadow-black/40 p-6 sm:p-8">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-700 dark:text-slate-300">Email Address</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                          <Input {...field} type="email" placeholder="name@example.com" className="pl-10 rounded-xl h-11" data-testid="input-email" />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-700 dark:text-slate-300">Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                          <Input {...field} type={showPassword ? "text" : "password"} placeholder="Enter your password" className="pl-10 pr-10 rounded-xl h-11" data-testid="input-password" />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#00AFE6]"
                            data-testid="button-toggle-password"
                          >
                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex justify-end">
                  <Link href="/forgot-password" className="text-sm font-medium text-[#0092c4] dark:text-[#4dd0f5] hover:underline" data-testid="link-forgot-password">
                    Forgot your password?
                  </Link>
                </div>

                <Button
                  type="submit"
                  className="w-full h-11 rounded-xl bg-gradient-to-r from-[#00AFE6] to-[#00DD89] text-white border-0 shadow-lg hover:shadow-xl hover:shadow-[#00AFE6]/30 hover:scale-[1.01] transition-all duration-300"
                  disabled={loginMutation.isPending}
                  data-testid="button-login"
                >
                  {loginMutation.isPending ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Signing in…
                    </span>
                  ) : (
                    <span className="flex items-center">Sign In<ArrowRight className="ml-2 w-4 h-4" /></span>
                  )}
                </Button>
              </form>
            </Form>

            <p className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">
              Don't have an account?{" "}
              <Link href="/join-cas" className="font-semibold text-[#0092c4] dark:text-[#4dd0f5] hover:underline" data-testid="link-join">
                Join CAS or CANN
              </Link>
            </p>
          </div>

          <p className="mt-6 text-center text-xs text-slate-400 dark:text-slate-500">
            By signing in, you agree to our{" "}
            <Link href="/privacy-policy" className="underline hover:text-[#00AFE6]">Privacy Policy</Link>{" "}
            and{" "}
            <Link href="/terms" className="underline hover:text-[#00AFE6]">Terms of Service</Link>.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
