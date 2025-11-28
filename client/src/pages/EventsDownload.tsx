import { useState } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { 
  Download, 
  Loader2, 
  LogOut, 
  Trash2, 
  Users, 
  Shield,
  Calendar,
  Mail,
  Building2,
  CheckCircle,
  XCircle
} from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

type LoginForm = z.infer<typeof loginSchema>;

interface Registration {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  institution: string;
  isCannMember: boolean;
  createdAt: string;
}

export default function EventsDownload() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [loginError, setLoginError] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const form = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const loginMutation = useMutation({
    mutationFn: async (data: LoginForm) => {
      const response = await apiRequest("POST", "/api/admin/events/login", data);
      return response.json();
    },
    onSuccess: (data) => {
      if (data.success) {
        setIsAuthenticated(true);
        setAuthToken(data.token);
        setLoginError(null);
      }
    },
    onError: () => {
      setLoginError("Invalid username or password");
    },
  });

  const { data: registrationsData, isLoading: isLoadingRegistrations } = useQuery<{
    success: boolean;
    registrations: Registration[];
    count: number;
  }>({
    queryKey: ["/api/admin/events/townhall/registrations"],
    enabled: isAuthenticated && !!authToken,
    queryFn: async () => {
      const response = await fetch("/api/admin/events/townhall/registrations", {
        headers: {
          Authorization: `Basic ${authToken}`,
        },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch registrations");
      }
      return response.json();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch(`/api/admin/events/townhall/registrations/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Basic ${authToken}`,
        },
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/events/townhall/registrations"] });
    },
  });

  const handleDownloadCSV = () => {
    if (!authToken) return;
    
    const link = document.createElement("a");
    link.href = `/api/admin/events/townhall/registrations/export?format=csv`;
    
    fetch(link.href, {
      headers: {
        Authorization: `Basic ${authToken}`,
      },
    })
      .then((response) => response.blob())
      .then((blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `cann-townhall-registrations-${new Date().toISOString().split("T")[0]}.csv`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      });
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setAuthToken(null);
    form.reset();
  };

  const onSubmit = (data: LoginForm) => {
    setLoginError(null);
    loginMutation.mutate(data);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-[calc(100vh-6rem)] bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden">
            <div className="bg-gradient-to-r from-[#00AFE6] to-[#00DD89] p-6 text-white text-center">
              <Shield className="w-12 h-12 mx-auto mb-3" />
              <h1 className="text-2xl font-bold" data-testid="text-login-title">Event Admin Portal</h1>
              <p className="text-white/80 text-sm mt-1">
                CANN Townhall Registration Management
              </p>
            </div>

            <div className="p-6">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700 dark:text-gray-300">Username</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="Enter username"
                            className="h-11 bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700"
                            data-testid="input-admin-username"
                          />
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
                        <FormLabel className="text-gray-700 dark:text-gray-300">Password</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="password"
                            placeholder="Enter password"
                            className="h-11 bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700"
                            data-testid="input-admin-password"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {loginError && (
                    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3 text-red-700 dark:text-red-400 text-sm" data-testid="text-login-error">
                      {loginError}
                    </div>
                  )}

                  <Button
                    type="submit"
                    disabled={loginMutation.isPending}
                    className="w-full h-11 bg-gradient-to-r from-[#00AFE6] to-[#00DD89] hover:from-[#00AFE6]/90 hover:to-[#00DD89]/90 text-white font-semibold"
                    data-testid="button-admin-login"
                  >
                    {loginMutation.isPending ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Logging in...
                      </>
                    ) : (
                      "Login"
                    )}
                  </Button>
                </form>
              </Form>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-6rem)] bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900">
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Shield className="w-8 h-8 text-[#00AFE6]" />
            <div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white" data-testid="text-dashboard-title">
                Event Admin Dashboard
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">CANN Townhall Registrations</p>
            </div>
          </div>
          <Button
            variant="outline"
            onClick={handleLogout}
            className="text-red-600 dark:text-red-500 hover:text-red-700 dark:hover:text-red-400 border-red-600 dark:border-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
            data-testid="button-logout"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-100 dark:border-gray-700 p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-r from-[#00AFE6] to-[#00DD89] rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white" data-testid="text-total-registrations">
                    {registrationsData?.count || 0}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Total Registrations</p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-100 dark:border-gray-700 p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white" data-testid="text-cann-members">
                    {registrationsData?.registrations?.filter(r => r.isCannMember).length || 0}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">CANN Members</p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-100 dark:border-gray-700 p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900/30 rounded-lg flex items-center justify-center">
                  <XCircle className="w-6 h-6 text-amber-600 dark:text-amber-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white" data-testid="text-non-cann-members">
                    {registrationsData?.registrations?.filter(r => !r.isCannMember).length || 0}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Non-CANN Members</p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-100 dark:border-gray-700 p-6 flex items-center justify-center">
              <Button
                onClick={handleDownloadCSV}
                className="w-full h-full bg-gradient-to-r from-[#00AFE6] to-[#00DD89] hover:from-[#00AFE6]/90 hover:to-[#00DD89]/90 text-white font-semibold"
                data-testid="button-download-csv"
              >
                <Download className="w-5 h-5 mr-2" />
                Download CSV
              </Button>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-100 dark:border-gray-700 overflow-hidden">
            <div className="p-6 border-b border-gray-100 dark:border-gray-700">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Registration List</h2>
            </div>

            {isLoadingRegistrations ? (
              <div className="p-12 text-center">
                <Loader2 className="w-8 h-8 mx-auto animate-spin text-[#00AFE6]" />
                <p className="text-gray-500 dark:text-gray-400 mt-2">Loading registrations...</p>
              </div>
            ) : registrationsData?.registrations?.length === 0 ? (
              <div className="p-12 text-center">
                <Users className="w-12 h-12 mx-auto text-gray-300 dark:text-gray-600 mb-3" />
                <p className="text-gray-500 dark:text-gray-400" data-testid="text-no-registrations">No registrations yet</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[50px]">ID</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Institution</TableHead>
                      <TableHead className="text-center">CANN Member</TableHead>
                      <TableHead>Registered</TableHead>
                      <TableHead className="w-[80px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {registrationsData?.registrations?.map((registration) => (
                      <TableRow key={registration.id} data-testid={`row-registration-${registration.id}`}>
                        <TableCell className="font-medium text-gray-500 dark:text-gray-400">
                          #{registration.id}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                              <span className="text-xs font-medium text-gray-600 dark:text-gray-300">
                                {registration.firstName[0]}{registration.lastName[0]}
                              </span>
                            </div>
                            <span className="font-medium text-gray-900 dark:text-white">
                              {registration.firstName} {registration.lastName}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                            <Mail className="w-4 h-4" />
                            {registration.email}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                            <Building2 className="w-4 h-4" />
                            {registration.institution}
                          </div>
                        </TableCell>
                        <TableCell className="text-center">
                          {registration.isCannMember ? (
                            <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full text-xs font-medium">
                              <CheckCircle className="w-3 h-3" />
                              Yes
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full text-xs font-medium">
                              <XCircle className="w-3 h-3" />
                              No
                            </span>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 text-sm">
                            <Calendar className="w-4 h-4" />
                            {registration.createdAt
                              ? new Date(registration.createdAt).toLocaleDateString("en-CA", {
                                  year: "numeric",
                                  month: "short",
                                  day: "numeric",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })
                              : "N/A"}
                          </div>
                        </TableCell>
                        <TableCell>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                                data-testid={`button-delete-${registration.id}`}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete Registration?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete the registration for{" "}
                                  <strong>
                                    {registration.firstName} {registration.lastName}
                                  </strong>
                                  ? This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => deleteMutation.mutate(registration.id)}
                                  className="bg-red-600 hover:bg-red-700"
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </div>
        </motion.div>
      </main>
    </div>
  );
}
