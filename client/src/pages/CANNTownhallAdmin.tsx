import { useState } from "react";
import { motion } from "framer-motion";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "wouter";
import {
  ArrowLeft,
  Download,
  Trash2,
  Users,
  RefreshCw,
  CheckCircle,
  XCircle,
  Calendar,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Badge } from "@/components/ui/badge";
import { apiRequest } from "@/lib/queryClient";
import type { EventRegistration } from "@shared/schema";

interface RegistrationsResponse {
  success: boolean;
  count: number;
  registrations: EventRegistration[];
}

export default function CANNTownhallAdmin() {
  const queryClient = useQueryClient();
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const { data, isLoading, refetch, isRefetching } = useQuery<RegistrationsResponse>({
    queryKey: ["/api/admin/events/cann-townhall/registrations"],
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await apiRequest("DELETE", `/api/admin/events/registrations/${id}`);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/events/cann-townhall/registrations"] });
      setDeletingId(null);
    },
    onError: (error) => {
      console.error("Delete error:", error);
      setDeletingId(null);
    },
  });

  const handleExport = () => {
    window.open("/api/admin/events/cann-townhall/registrations/export", "_blank");
  };

  const formatDate = (dateString: string | Date | null) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Link href="/events">
            <Button
              variant="ghost"
              className="mb-6 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
              data-testid="link-back-events"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Events
            </Button>
          </Link>

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white font-rosarivo">
                CANN Townhall Registrations
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                View and manage registrations for the CANN Townhall – Ideation Workshop
              </p>
            </div>
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => refetch()}
                disabled={isRefetching}
                className="border-gray-300 dark:border-gray-600"
                data-testid="button-refresh"
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${isRefetching ? "animate-spin" : ""}`} />
                Refresh
              </Button>
              <Button
                onClick={handleExport}
                className="bg-gradient-to-r from-[#00AFE6] to-[#00DD89] text-white"
                data-testid="button-export-csv"
              >
                <Download className="w-4 h-4 mr-2" />
                Export CSV
              </Button>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Total Registrations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-[#00AFE6]/10 rounded-lg">
                    <Users className="w-6 h-6 text-[#00AFE6]" />
                  </div>
                  <span className="text-3xl font-bold text-gray-900 dark:text-white" data-testid="text-total-registrations">
                    {isLoading ? "..." : data?.count || 0}
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  CANN Members
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-[#00DD89]/10 rounded-lg">
                    <CheckCircle className="w-6 h-6 text-[#00DD89]" />
                  </div>
                  <span className="text-3xl font-bold text-gray-900 dark:text-white" data-testid="text-cann-members">
                    {isLoading ? "..." : data?.registrations?.filter(r => r.isCANNMember).length || 0}
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Non-CANN Members
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-amber-500/10 rounded-lg">
                    <XCircle className="w-6 h-6 text-amber-500" />
                  </div>
                  <span className="text-3xl font-bold text-gray-900 dark:text-white" data-testid="text-non-cann-members">
                    {isLoading ? "..." : data?.registrations?.filter(r => !r.isCANNMember).length || 0}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
                <Calendar className="w-5 h-5 text-[#00AFE6]" />
                Registration List
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin text-[#00AFE6]" />
                </div>
              ) : !data?.registrations?.length ? (
                <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                  <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No registrations yet</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-gray-200 dark:border-gray-700">
                        <TableHead className="text-gray-600 dark:text-gray-400">Name</TableHead>
                        <TableHead className="text-gray-600 dark:text-gray-400">Email</TableHead>
                        <TableHead className="text-gray-600 dark:text-gray-400">Institution</TableHead>
                        <TableHead className="text-gray-600 dark:text-gray-400">CANN Member</TableHead>
                        <TableHead className="text-gray-600 dark:text-gray-400">Registered</TableHead>
                        <TableHead className="text-gray-600 dark:text-gray-400 text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {data.registrations.map((registration) => (
                        <TableRow
                          key={registration.id}
                          className="border-gray-200 dark:border-gray-700"
                          data-testid={`row-registration-${registration.id}`}
                        >
                          <TableCell className="font-medium text-gray-900 dark:text-white">
                            {registration.firstName} {registration.lastName}
                          </TableCell>
                          <TableCell className="text-gray-600 dark:text-gray-400">
                            {registration.email}
                          </TableCell>
                          <TableCell className="text-gray-600 dark:text-gray-400 max-w-xs truncate">
                            {registration.institution}
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={registration.isCANNMember ? "default" : "secondary"}
                              className={registration.isCANNMember
                                ? "bg-[#00DD89]/20 text-[#00DD89] hover:bg-[#00DD89]/30"
                                : "bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400"
                              }
                              data-testid={`badge-cannMember-${registration.id}`}
                            >
                              {registration.isCANNMember ? "Yes" : "No"}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-gray-600 dark:text-gray-400">
                            {formatDate(registration.registeredAt)}
                          </TableCell>
                          <TableCell className="text-right">
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                                  disabled={deleteMutation.isPending && deletingId === registration.id}
                                  data-testid={`button-delete-${registration.id}`}
                                >
                                  {deleteMutation.isPending && deletingId === registration.id ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                  ) : (
                                    <Trash2 className="w-4 h-4" />
                                  )}
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Delete Registration</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Are you sure you want to delete the registration for{" "}
                                    <strong>{registration.firstName} {registration.lastName}</strong>?
                                    This action cannot be undone.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => {
                                      setDeletingId(registration.id);
                                      deleteMutation.mutate(registration.id);
                                    }}
                                    className="bg-red-500 hover:bg-red-600"
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
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
