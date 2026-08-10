import { motion } from "framer-motion";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Lock, Mail, Eye, EyeOff, ArrowRight, ShieldCheck, LayoutDashboard, Users, MapPinned } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { loginSchema, type LoginCredentials } from "@shared/schema";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Link, useLocation } from "wouter";

interface LoginResponse {
  success: boolean;
  message: string;
  member?: { id: number; email: string; fullName: string; role: string; isCASMember: boolean; isCANNMember: boolean };
}

const FEATURES = [
  { icon: Users, title: "Leads", desc: "Every form submission in one searchable table." },
  { icon: LayoutDashboard, title: "Resources & events", desc: "Manage events, recordings and study materials." },
  { icon: MapPinned, title: "Services map", desc: "Curate the clinics shown on the public map." },
];

export default function AdminLogin() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<LoginCredentials>({ resolver: zodResolver(loginSchema), defaultValues: { email: "", password: "" } });

  const loginMutation = useMutation({
    mutationFn: async (data: LoginCredentials): Promise<LoginResponse> => {
      const response = await apiRequest("POST", "/api/auth/login", data);
      return await response.json();
    },
    onSuccess: async (data) => {
      if (!data.success) {
        toast({ title: "Login Failed", description: data.message, variant: "destructive" });
        return;
      }
      if (data.member?.role !== "admin") {
        // Not an admin — don't grant admin access; drop the session and explain.
        await apiRequest("POST", "/api/auth/logout", {}).catch(() => {});
        queryClient.clear();
        toast({ title: "Not an admin account", description: "This account doesn't have administrator access. Use the member portal login instead.", variant: "destructive" });
        return;
      }
      queryClient.clear();
      toast({ title: "Welcome, admin", description: `Signed in as ${data.member?.fullName || "Administrator"}` });
      setLocation("/admin-portal");
    },
    onError: (error: Error) => {
      toast({ title: "Login Failed", description: error.message || "Unable to sign in. Check your credentials.", variant: "destructive" });
    },
  });

  const onSubmit = (data: LoginCredentials) => loginMutation.mutate(data);

  return (
    <div className="min-h-[calc(100vh-6rem)] grid lg:grid-cols-2 bg-slate-950">
      {/* Brand panel (admin — dark/professional to distinguish from member login) */}
      <div className="relative hidden lg:flex flex-col justify-between overflow-hidden bg-gradient-to-br from-slate-900 to-slate-800 p-12 text-white">
        <div className="absolute -top-24 -right-24 h-80 w-80 rounded-full bg-[#00AFE6]/20 blur-3xl" />
        <div className="absolute -bottom-32 -left-20 h-80 w-80 rounded-full bg-[#00DD89]/15 blur-3xl" />
        <div className="relative">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 backdrop-blur px-4 py-1.5 border border-white/10">
            <ShieldCheck className="w-4 h-4 text-[#4dd0f5]" />
            <span className="text-sm font-semibold">Admin Console</span>
          </div>
          <h2 className="mt-8 text-4xl xl:text-5xl font-bold font-rosarivo leading-tight">
            Canadian Amyloidosis<br />Society — Administration
          </h2>
          <p className="mt-4 text-white/70 max-w-md">Restricted area. Sign in with an administrator account to manage leads, events, resources and the services map.</p>
        </div>
        <div className="relative space-y-5 mt-10">
          {FEATURES.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="flex items-start gap-4">
              <div className="h-11 w-11 shrink-0 rounded-2xl bg-white/10 backdrop-blur flex items-center justify-center border border-white/10"><Icon className="w-5 h-5 text-[#4dd0f5]" /></div>
              <div><p className="font-semibold">{title}</p><p className="text-sm text-white/60">{desc}</p></div>
            </div>
          ))}
        </div>
        <p className="relative text-xs text-white/40">© {new Date().getFullYear()} Canadian Amyloidosis Society · Staff access only</p>
      </div>

      {/* Form panel */}
      <div className="flex items-center justify-center p-6 sm:p-10 bg-slate-50 dark:bg-[#0b1120]">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="w-full max-w-md">
          <div className="lg:hidden mb-8 text-center">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 mb-3"><ShieldCheck className="w-7 h-7 text-[#4dd0f5]" /></div>
          </div>
          <h1 className="text-3xl font-bold font-rosarivo text-slate-900 dark:text-white">Admin sign in</h1>
          <p className="mt-2 text-slate-500 dark:text-slate-400">Administrator access to the CAS console.</p>

          <div className="mt-8 rounded-3xl border border-slate-200/70 dark:border-white/10 bg-white dark:bg-white/[0.03] shadow-xl shadow-slate-200/50 dark:shadow-black/40 p-6 sm:p-8">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                <FormField control={form.control} name="email" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-700 dark:text-slate-300">Admin Email</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <Input {...field} type="email" placeholder="admin@amyloid.ca" className="pl-10 rounded-xl h-11" data-testid="admin-input-email" />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="password" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-700 dark:text-slate-300">Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <Input {...field} type={showPassword ? "text" : "password"} placeholder="Enter your password" className="pl-10 pr-10 rounded-xl h-11" data-testid="admin-input-password" />
                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#00AFE6]">
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <Button type="submit" className="w-full h-11 rounded-xl bg-gradient-to-r from-slate-800 to-slate-900 hover:from-slate-900 hover:to-black text-white border-0 shadow-lg transition-all" disabled={loginMutation.isPending} data-testid="admin-button-login">
                  {loginMutation.isPending ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" /></svg>
                      Signing in…
                    </span>
                  ) : (
                    <span className="flex items-center">Sign in to console<ArrowRight className="ml-2 w-4 h-4" /></span>
                  )}
                </Button>
              </form>
            </Form>
            <p className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">
              Not an admin?{" "}
              <Link href="/login" className="font-semibold text-[#0092c4] dark:text-[#4dd0f5] hover:underline" data-testid="link-member-login">
                Member login
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
