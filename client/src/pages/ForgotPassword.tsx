import { motion } from "framer-motion";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Mail,
  ArrowRight,
  ArrowLeft,
  KeyRound,
  CheckCircle,
  Lock,
  Eye,
  EyeOff,
  Shield,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
import { forgotPasswordSchema, verifyOtpSchema, resetPasswordSchema } from "@shared/schema";
import type { ForgotPasswordRequest, VerifyOtpRequest, ResetPasswordRequest } from "@shared/schema";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Link, useLocation } from "wouter";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";

type Step = "email" | "otp" | "reset" | "success";

interface ApiResponse {
  success: boolean;
  message: string;
}

export default function ForgotPassword() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const emailForm = useForm<ForgotPasswordRequest>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const otpForm = useForm<VerifyOtpRequest>({
    resolver: zodResolver(verifyOtpSchema),
    defaultValues: {
      email: "",
      otp: "",
    },
  });

  const resetForm = useForm<ResetPasswordRequest>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      email: "",
      otp: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const requestOtpMutation = useMutation({
    mutationFn: async (data: ForgotPasswordRequest): Promise<ApiResponse> => {
      const response = await apiRequest("POST", "/api/auth/forgot-password", data);
      return await response.json();
    },
    onSuccess: (data) => {
      if (data.success) {
        toast({
          title: "Verification Code Sent",
          description: "Check your email for the 6-digit code.",
        });
        setStep("otp");
      } else {
        toast({
          title: "Request Failed",
          description: data.message,
          variant: "destructive",
        });
      }
    },
    onError: () => {
      toast({
        title: "Request Failed",
        description: "Unable to send verification code. Please try again.",
        variant: "destructive",
      });
    },
  });

  const verifyOtpMutation = useMutation({
    mutationFn: async (data: VerifyOtpRequest): Promise<ApiResponse> => {
      const response = await apiRequest("POST", "/api/auth/verify-otp", data);
      return await response.json();
    },
    onSuccess: (data) => {
      if (data.success) {
        toast({
          title: "Code Verified",
          description: "You can now set a new password.",
        });
        setStep("reset");
      } else {
        toast({
          title: "Verification Failed",
          description: data.message,
          variant: "destructive",
        });
      }
    },
    onError: () => {
      toast({
        title: "Verification Failed",
        description: "Invalid or expired verification code.",
        variant: "destructive",
      });
    },
  });

  const resetPasswordMutation = useMutation({
    mutationFn: async (data: ResetPasswordRequest): Promise<ApiResponse> => {
      const response = await apiRequest("POST", "/api/auth/reset-password", data);
      return await response.json();
    },
    onSuccess: (data) => {
      if (data.success) {
        setStep("success");
        toast({
          title: "Password Reset Successful",
          description: "You can now login with your new password.",
        });
      } else {
        toast({
          title: "Reset Failed",
          description: data.message,
          variant: "destructive",
        });
      }
    },
    onError: () => {
      toast({
        title: "Reset Failed",
        description: "Unable to reset password. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onEmailSubmit = (data: ForgotPasswordRequest) => {
    setEmail(data.email);
    otpForm.setValue("email", data.email);
    resetForm.setValue("email", data.email);
    requestOtpMutation.mutate(data);
  };

  const onOtpSubmit = (data: VerifyOtpRequest) => {
    setOtp(data.otp);
    resetForm.setValue("otp", data.otp);
    verifyOtpMutation.mutate({ ...data, email });
  };

  const onResetSubmit = (data: ResetPasswordRequest) => {
    resetPasswordMutation.mutate({ ...data, email, otp });
  };

  const renderStep = () => {
    switch (step) {
      case "email":
        return (
          <Card className="shadow-xl border-0 bg-white dark:bg-gray-800">
            <CardHeader>
              <CardTitle className="text-xl text-center text-gray-900 dark:text-white">
                Reset Your Password
              </CardTitle>
              <CardDescription className="text-center">
                Enter your email address and we'll send you a verification code
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...emailForm}>
                <form onSubmit={emailForm.handleSubmit(onEmailSubmit)} className="space-y-4">
                  <FormField
                    control={emailForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700 dark:text-gray-300">
                          Email Address
                        </FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <Input
                              {...field}
                              type="email"
                              placeholder="name@example.com"
                              className="pl-10"
                              data-testid="input-email"
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-[#00AFE6] to-[#00DD89] hover:opacity-90 text-white"
                    disabled={requestOtpMutation.isPending}
                    data-testid="button-send-code"
                  >
                    {requestOtpMutation.isPending ? (
                      <span className="flex items-center">
                        <svg
                          className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Sending...
                      </span>
                    ) : (
                      <span className="flex items-center">
                        Send Verification Code
                        <ArrowRight className="ml-2 w-4 h-4" />
                      </span>
                    )}
                  </Button>

                  <div className="text-center">
                    <Link href="/login">
                      <a
                        className="text-sm text-[#00AFE6] hover:text-[#0099CC] dark:text-[#00DD89] dark:hover:text-[#00BB77] inline-flex items-center transition-colors"
                        data-testid="link-back-to-login"
                      >
                        <ArrowLeft className="w-4 h-4 mr-1" />
                        Back to Login
                      </a>
                    </Link>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        );

      case "otp":
        return (
          <Card className="shadow-xl border-0 bg-white dark:bg-gray-800">
            <CardHeader>
              <CardTitle className="text-xl text-center text-gray-900 dark:text-white">
                Enter Verification Code
              </CardTitle>
              <CardDescription className="text-center">
                We sent a 6-digit code to <strong>{email}</strong>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...otpForm}>
                <form onSubmit={otpForm.handleSubmit(onOtpSubmit)} className="space-y-6">
                  <FormField
                    control={otpForm.control}
                    name="otp"
                    render={({ field }) => (
                      <FormItem className="flex flex-col items-center">
                        <FormLabel className="text-gray-700 dark:text-gray-300 mb-4">
                          Verification Code
                        </FormLabel>
                        <FormControl>
                          <InputOTP
                            maxLength={6}
                            value={field.value}
                            onChange={field.onChange}
                            data-testid="input-otp"
                          >
                            <InputOTPGroup>
                              <InputOTPSlot index={0} />
                              <InputOTPSlot index={1} />
                              <InputOTPSlot index={2} />
                              <InputOTPSlot index={3} />
                              <InputOTPSlot index={4} />
                              <InputOTPSlot index={5} />
                            </InputOTPGroup>
                          </InputOTP>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-[#00AFE6] to-[#00DD89] hover:opacity-90 text-white"
                    disabled={verifyOtpMutation.isPending}
                    data-testid="button-verify-code"
                  >
                    {verifyOtpMutation.isPending ? (
                      <span className="flex items-center">
                        <svg
                          className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Verifying...
                      </span>
                    ) : (
                      <span className="flex items-center">
                        <KeyRound className="w-4 h-4 mr-2" />
                        Verify Code
                      </span>
                    )}
                  </Button>

                  <div className="flex justify-between items-center">
                    <button
                      type="button"
                      onClick={() => setStep("email")}
                      className="text-sm text-[#00AFE6] hover:text-[#0099CC] dark:text-[#00DD89] dark:hover:text-[#00BB77] inline-flex items-center transition-colors"
                      data-testid="button-back-to-email"
                    >
                      <ArrowLeft className="w-4 h-4 mr-1" />
                      Change Email
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        emailForm.setValue("email", email);
                        requestOtpMutation.mutate({ email });
                      }}
                      disabled={requestOtpMutation.isPending}
                      className="text-sm text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                      data-testid="button-resend-code"
                    >
                      Resend Code
                    </button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        );

      case "reset":
        return (
          <Card className="shadow-xl border-0 bg-white dark:bg-gray-800">
            <CardHeader>
              <CardTitle className="text-xl text-center text-gray-900 dark:text-white">
                Create New Password
              </CardTitle>
              <CardDescription className="text-center">
                Choose a strong password for your account
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...resetForm}>
                <form onSubmit={resetForm.handleSubmit(onResetSubmit)} className="space-y-4">
                  <FormField
                    control={resetForm.control}
                    name="newPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700 dark:text-gray-300">
                          New Password
                        </FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <Input
                              {...field}
                              type={showPassword ? "text" : "password"}
                              placeholder="Enter new password"
                              className="pl-10 pr-10"
                              data-testid="input-new-password"
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                              data-testid="button-toggle-new-password"
                            >
                              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={resetForm.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700 dark:text-gray-300">
                          Confirm Password
                        </FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <Input
                              {...field}
                              type={showConfirmPassword ? "text" : "password"}
                              placeholder="Confirm new password"
                              className="pl-10 pr-10"
                              data-testid="input-confirm-password"
                            />
                            <button
                              type="button"
                              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                              data-testid="button-toggle-confirm-password"
                            >
                              {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                    <p className="text-xs text-gray-600 dark:text-gray-400 flex items-start">
                      <Shield className="w-4 h-4 mr-2 text-[#00AFE6] flex-shrink-0 mt-0.5" />
                      Password must be at least 8 characters and include a mix of letters, numbers, and symbols.
                    </p>
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-[#00AFE6] to-[#00DD89] hover:opacity-90 text-white"
                    disabled={resetPasswordMutation.isPending}
                    data-testid="button-reset-password"
                  >
                    {resetPasswordMutation.isPending ? (
                      <span className="flex items-center">
                        <svg
                          className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Resetting Password...
                      </span>
                    ) : (
                      <span className="flex items-center">
                        Reset Password
                        <ArrowRight className="ml-2 w-4 h-4" />
                      </span>
                    )}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        );

      case "success":
        return (
          <Card className="shadow-xl border-0 bg-white dark:bg-gray-800">
            <CardContent className="pt-8 pb-8 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full mb-4">
                <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                Password Reset Complete!
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Your password has been successfully reset. You can now log in with your new password.
              </p>
              <Button
                onClick={() => setLocation("/login")}
                className="bg-gradient-to-r from-[#00AFE6] to-[#00DD89] hover:opacity-90 text-white"
                data-testid="button-go-to-login"
              >
                Go to Login
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </CardContent>
          </Card>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-12 px-4">
      <div className="max-w-md mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-[#00AFE6] to-[#00DD89] rounded-full mb-4">
              <KeyRound className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Password Recovery
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              {step === "email" && "We'll help you get back into your account"}
              {step === "otp" && "Enter the code sent to your email"}
              {step === "reset" && "Almost there! Create your new password"}
              {step === "success" && "Your password has been updated"}
            </p>
          </div>

          {step !== "success" && (
            <div className="flex justify-center mb-6">
              <div className="flex items-center space-x-2">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    step === "email"
                      ? "bg-[#00AFE6] text-white"
                      : "bg-green-500 text-white"
                  }`}
                >
                  {step === "email" ? "1" : <CheckCircle className="w-4 h-4" />}
                </div>
                <div className={`w-12 h-0.5 ${step === "email" ? "bg-gray-300" : "bg-green-500"}`} />
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    step === "otp"
                      ? "bg-[#00AFE6] text-white"
                      : step === "reset"
                      ? "bg-green-500 text-white"
                      : "bg-gray-300 text-gray-500"
                  }`}
                >
                  {step === "reset" ? <CheckCircle className="w-4 h-4" /> : "2"}
                </div>
                <div className={`w-12 h-0.5 ${step === "reset" ? "bg-[#00AFE6]" : "bg-gray-300"}`} />
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    step === "reset" ? "bg-[#00AFE6] text-white" : "bg-gray-300 text-gray-500"
                  }`}
                >
                  3
                </div>
              </div>
            </div>
          )}

          {renderStep()}
        </motion.div>
      </div>
    </div>
  );
}
