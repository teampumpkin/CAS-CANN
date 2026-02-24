import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Filter,
  Clock,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Mail,
  Building2,
  Stethoscope,
  RefreshCw,
  ChevronDown,
  ExternalLink,
  LayoutGrid,
  List,
  Download,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

interface Submission {
  id: number;
  formName: string;
  fullName: string;
  email: string;
  discipline: string;
  institution: string;
  wantsMembership: string | boolean;
  wantsCANNMembership: string | boolean;
  processingStatus: string;
  syncStatus: string;
  zohoCrmId: string | null;
  retryCount: number;
  errorMessage: string | null;
  createdAt: string;
  lastSyncAt: string | null;
}

interface AuditResponse {
  success: boolean;
  total: number;
  submissions: Submission[];
}

const statusConfig: Record<string, { label: string; color: string; bgColor: string; icon: any }> = {
  synced: { label: "Synced", color: "text-emerald-700 dark:text-emerald-400", bgColor: "bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800", icon: CheckCircle2 },
  pending: { label: "Pending", color: "text-amber-700 dark:text-amber-400", bgColor: "bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800", icon: Clock },
  failed: { label: "Failed", color: "text-red-700 dark:text-red-400", bgColor: "bg-red-50 dark:bg-red-950/40 border-red-200 dark:border-red-800", icon: AlertCircle },
  processing: { label: "Processing", color: "text-blue-700 dark:text-blue-400", bgColor: "bg-blue-50 dark:bg-blue-950/40 border-blue-200 dark:border-blue-800", icon: Loader2 },
};

const kanbanColumns = ["pending", "processing", "synced", "failed"] as const;

function formatDate(dateStr: string | null) {
  if (!dateStr) return "—";
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-CA", { year: "numeric", month: "short", day: "numeric" });
}

function isMember(sub: Submission) {
  return sub.wantsMembership === "Yes" || sub.wantsMembership === true ||
    sub.wantsCANNMembership === "Yes" || sub.wantsCANNMembership === true;
}

function SubmissionCard({ sub }: { sub: Submission }) {
  const [expanded, setExpanded] = useState(false);
  const config = statusConfig[sub.syncStatus] || statusConfig.pending;
  const StatusIcon = config.icon;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2 }}
    >
      <Card className={`mb-2 border ${config.bgColor} cursor-pointer transition-shadow hover:shadow-md`} onClick={() => setExpanded(!expanded)}>
        <CardContent className="p-3">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0 flex-1">
              <p className="font-semibold text-sm truncate text-gray-900 dark:text-gray-100">{sub.fullName || "Unknown"}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate flex items-center gap-1">
                <Mail className="w-3 h-3 flex-shrink-0" />
                {sub.email || "—"}
              </p>
            </div>
            <div className="flex items-center gap-1 flex-shrink-0">
              <StatusIcon className={`w-4 h-4 ${config.color} ${sub.syncStatus === 'processing' ? 'animate-spin' : ''}`} />
              <span className="text-[10px] font-medium text-gray-500">#{sub.id}</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-1 mt-2">
            <Badge variant="outline" className="text-[10px] px-1.5 py-0">
              {sub.formName.replace("Excel Import - ", "📥 ")}
            </Badge>
            {isMember(sub) ? (
              <Badge className="text-[10px] px-1.5 py-0 bg-[#00AFE6]/10 text-[#00AFE6] border-[#00AFE6]/30">
                Member
              </Badge>
            ) : (
              <Badge variant="outline" className="text-[10px] px-1.5 py-0 text-gray-500">
                Inquiry
              </Badge>
            )}
            {(sub.wantsCANNMembership === "Yes" || sub.wantsCANNMembership === true) && (
              <Badge className="text-[10px] px-1.5 py-0 bg-pink-500/10 text-pink-500 border-pink-500/30">
                CANN
              </Badge>
            )}
          </div>

          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              className="mt-2 pt-2 border-t border-gray-200 dark:border-gray-700 space-y-1"
            >
              {sub.discipline && (
                <p className="text-xs flex items-center gap-1 text-gray-600 dark:text-gray-300">
                  <Stethoscope className="w-3 h-3" /> {sub.discipline}
                </p>
              )}
              {sub.institution && (
                <p className="text-xs flex items-center gap-1 text-gray-600 dark:text-gray-300">
                  <Building2 className="w-3 h-3" /> {sub.institution}
                </p>
              )}
              <p className="text-xs text-gray-500">
                Submitted: {formatDate(sub.createdAt)}
              </p>
              {sub.lastSyncAt && (
                <p className="text-xs text-gray-500">
                  Last synced: {formatDate(sub.lastSyncAt)}
                </p>
              )}
              {sub.retryCount > 0 && (
                <p className="text-xs text-amber-600 flex items-center gap-1">
                  <RefreshCw className="w-3 h-3" /> Retries: {sub.retryCount}
                </p>
              )}
              {sub.errorMessage && (
                <p className="text-xs text-red-500 mt-1 line-clamp-2">{sub.errorMessage}</p>
              )}
              {sub.zohoCrmId && (
                <p className="text-xs flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                  <ExternalLink className="w-3 h-3" /> Zoho: {sub.zohoCrmId}
                </p>
              )}
            </motion.div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}

function TableRow({ sub }: { sub: Submission }) {
  const config = statusConfig[sub.syncStatus] || statusConfig.pending;
  const StatusIcon = config.icon;

  return (
    <tr className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
      <td className="px-3 py-2 text-xs text-gray-500">#{sub.id}</td>
      <td className="px-3 py-2">
        <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{sub.fullName || "Unknown"}</p>
        <p className="text-xs text-gray-500">{sub.email || "—"}</p>
      </td>
      <td className="px-3 py-2 text-xs">{sub.formName.replace("Excel Import - ", "📥 ")}</td>
      <td className="px-3 py-2 text-xs">{sub.discipline || "—"}</td>
      <td className="px-3 py-2 text-xs">{sub.institution || "—"}</td>
      <td className="px-3 py-2">
        <div className="flex items-center gap-1">
          <StatusIcon className={`w-3.5 h-3.5 ${config.color} ${sub.syncStatus === 'processing' ? 'animate-spin' : ''}`} />
          <span className={`text-xs font-medium ${config.color}`}>{config.label}</span>
        </div>
      </td>
      <td className="px-3 py-2">
        {isMember(sub) ? (
          <Badge className="text-[10px] px-1.5 py-0 bg-[#00AFE6]/10 text-[#00AFE6] border-[#00AFE6]/30">Member</Badge>
        ) : (
          <Badge variant="outline" className="text-[10px] px-1.5 py-0">Inquiry</Badge>
        )}
        {(sub.wantsCANNMembership === "Yes" || sub.wantsCANNMembership === true) && (
          <Badge className="text-[10px] px-1.5 py-0 ml-1 bg-pink-500/10 text-pink-500 border-pink-500/30">CANN</Badge>
        )}
      </td>
      <td className="px-3 py-2 text-xs text-gray-500">{sub.retryCount > 0 ? sub.retryCount : "—"}</td>
      <td className="px-3 py-2 text-xs text-gray-500">{sub.zohoCrmId || "—"}</td>
      <td className="px-3 py-2 text-xs text-gray-500">{formatDate(sub.createdAt)}</td>
    </tr>
  );
}

export default function AdminSubmissions() {
  const [viewMode, setViewMode] = useState<"kanban" | "table">("kanban");
  const [searchQuery, setSearchQuery] = useState("");
  const [formFilter, setFormFilter] = useState("all");
  const [membershipFilter, setMembershipFilter] = useState("all");
  const [filtersOpen, setFiltersOpen] = useState(false);

  const { data, isLoading, refetch } = useQuery<AuditResponse>({
    queryKey: ["/api/audit/submissions", { limit: 500 }],
  });

  const submissions = data?.submissions || [];

  const filtered = useMemo(() => {
    return submissions.filter((sub) => {
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        if (
          !sub.fullName?.toLowerCase().includes(q) &&
          !sub.email?.toLowerCase().includes(q) &&
          !sub.institution?.toLowerCase().includes(q) &&
          !String(sub.id).includes(q)
        )
          return false;
      }
      if (formFilter !== "all" && sub.formName !== formFilter) return false;
      if (membershipFilter === "member" && !isMember(sub)) return false;
      if (membershipFilter === "inquiry" && isMember(sub)) return false;
      if (membershipFilter === "cann" && !(sub.wantsCANNMembership === "Yes" || sub.wantsCANNMembership === true)) return false;
      return true;
    });
  }, [submissions, searchQuery, formFilter, membershipFilter]);

  const groupedByStatus = useMemo(() => {
    const groups: Record<string, Submission[]> = { pending: [], processing: [], synced: [], failed: [] };
    filtered.forEach((sub) => {
      const key = sub.syncStatus in groups ? sub.syncStatus : "pending";
      groups[key].push(sub);
    });
    return groups;
  }, [filtered]);

  const formTypes = useMemo(() => {
    const types = new Set(submissions.map((s) => s.formName));
    return Array.from(types).sort();
  }, [submissions]);

  const stats = useMemo(() => ({
    total: submissions.length,
    synced: submissions.filter((s) => s.syncStatus === "synced").length,
    pending: submissions.filter((s) => s.syncStatus === "pending").length,
    failed: submissions.filter((s) => s.syncStatus === "failed").length,
    members: submissions.filter((s) => isMember(s)).length,
    cann: submissions.filter((s) => s.wantsCANNMembership === "Yes" || s.wantsCANNMembership === true).length,
  }), [submissions]);

  const handleExportCSV = () => {
    const headers = ["ID", "Name", "Email", "Discipline", "Institution", "Form Type", "Sync Status", "CAS Member", "CANN Member", "Record Type", "Retry Count", "Zoho ID", "Created At"];
    const rows = filtered.map((s) => [
      s.id,
      `"${(s.fullName || '').replace(/"/g, '""')}"`,
      `"${(s.email || '').replace(/"/g, '""')}"`,
      `"${(s.discipline || '').replace(/"/g, '""')}"`,
      `"${(s.institution || '').replace(/"/g, '""')}"`,
      `"${s.formName}"`,
      s.syncStatus,
      s.wantsMembership === "Yes" || s.wantsMembership === true ? "Yes" : "No",
      s.wantsCANNMembership === "Yes" || s.wantsCANNMembership === true ? "Yes" : "No",
      isMember(s) ? "Member" : "Inquiry",
      s.retryCount,
      s.zohoCrmId || "",
      s.createdAt ? new Date(s.createdAt).toISOString() : "",
    ]);
    const csv = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `cas-submissions-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#00AFE6]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="max-w-[1600px] mx-auto px-4 py-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">CRM Submissions</h1>
            <p className="text-sm text-gray-500 mt-1">Track and manage form submissions synced to Zoho CRM</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => refetch()}>
              <RefreshCw className="w-4 h-4 mr-1" /> Refresh
            </Button>
            <Button variant="outline" size="sm" onClick={handleExportCSV}>
              <Download className="w-4 h-4 mr-1" /> Export CSV
            </Button>
            <div className="flex border rounded-md overflow-hidden">
              <Button
                variant={viewMode === "kanban" ? "default" : "ghost"}
                size="sm"
                className="rounded-none"
                onClick={() => setViewMode("kanban")}
              >
                <LayoutGrid className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === "table" ? "default" : "ghost"}
                size="sm"
                className="rounded-none"
                onClick={() => setViewMode("table")}
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
          <Card className="border-0 shadow-sm">
            <CardContent className="p-4">
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{stats.total}</p>
              <p className="text-xs text-gray-500">Total Records</p>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-sm">
            <CardContent className="p-4">
              <p className="text-2xl font-bold text-emerald-600">{stats.synced}</p>
              <p className="text-xs text-gray-500">Synced</p>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-sm">
            <CardContent className="p-4">
              <p className="text-2xl font-bold text-amber-600">{stats.pending}</p>
              <p className="text-xs text-gray-500">Pending</p>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-sm">
            <CardContent className="p-4">
              <p className="text-2xl font-bold text-red-600">{stats.failed}</p>
              <p className="text-xs text-gray-500">Failed</p>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-sm">
            <CardContent className="p-4">
              <p className="text-2xl font-bold text-[#00AFE6]">{stats.members}</p>
              <p className="text-xs text-gray-500">Members</p>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-sm">
            <CardContent className="p-4">
              <p className="text-2xl font-bold text-pink-500">{stats.cann}</p>
              <p className="text-xs text-gray-500">CANN</p>
            </CardContent>
          </Card>
        </div>

        <Collapsible open={filtersOpen} onOpenChange={setFiltersOpen} className="mb-4">
          <div className="flex items-center gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search by name, email, institution, or ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 bg-white dark:bg-gray-900"
              />
            </div>
            <CollapsibleTrigger asChild>
              <Button variant="outline" size="sm">
                <Filter className="w-4 h-4 mr-1" />
                Filters
                <ChevronDown className={`w-4 h-4 ml-1 transition-transform ${filtersOpen ? "rotate-180" : ""}`} />
              </Button>
            </CollapsibleTrigger>
            {(formFilter !== "all" || membershipFilter !== "all") && (
              <Button variant="ghost" size="sm" onClick={() => { setFormFilter("all"); setMembershipFilter("all"); }}>
                Clear filters
              </Button>
            )}
            <span className="text-sm text-gray-500">
              {filtered.length} of {submissions.length} records
            </span>
          </div>
          <CollapsibleContent className="mt-3">
            <div className="flex flex-wrap gap-3 p-3 bg-white dark:bg-gray-900 rounded-lg border">
              <div className="w-60">
                <label className="text-xs font-medium text-gray-500 mb-1 block">Form Type</label>
                <Select value={formFilter} onValueChange={setFormFilter}>
                  <SelectTrigger className="h-8"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Forms</SelectItem>
                    {formTypes.map((f) => (
                      <SelectItem key={f} value={f}>{f}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="w-48">
                <label className="text-xs font-medium text-gray-500 mb-1 block">Membership</label>
                <Select value={membershipFilter} onValueChange={setMembershipFilter}>
                  <SelectTrigger className="h-8"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="member">Members Only</SelectItem>
                    <SelectItem value="inquiry">Inquiries Only</SelectItem>
                    <SelectItem value="cann">CANN Members</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>

        {viewMode === "kanban" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
            {kanbanColumns.map((status) => {
              const config = statusConfig[status];
              const items = groupedByStatus[status] || [];
              const StatusIcon = config.icon;
              return (
                <div key={status} className="flex flex-col">
                  <div className={`flex items-center justify-between px-3 py-2 rounded-t-lg border ${config.bgColor}`}>
                    <div className="flex items-center gap-2">
                      <StatusIcon className={`w-4 h-4 ${config.color}`} />
                      <span className={`text-sm font-semibold ${config.color}`}>{config.label}</span>
                    </div>
                    <Badge variant="secondary" className="text-xs">{items.length}</Badge>
                  </div>
                  <div className="flex-1 bg-gray-100/50 dark:bg-gray-900/50 border border-t-0 rounded-b-lg p-2 min-h-[200px] max-h-[70vh] overflow-y-auto">
                    <AnimatePresence>
                      {items.length === 0 ? (
                        <p className="text-xs text-gray-400 text-center py-8">No submissions</p>
                      ) : (
                        items.map((sub) => <SubmissionCard key={sub.id} sub={sub} />)
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-900 rounded-lg border overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
                  <th className="px-3 py-2 text-xs font-medium text-gray-500">ID</th>
                  <th className="px-3 py-2 text-xs font-medium text-gray-500">Name / Email</th>
                  <th className="px-3 py-2 text-xs font-medium text-gray-500">Form</th>
                  <th className="px-3 py-2 text-xs font-medium text-gray-500">Discipline</th>
                  <th className="px-3 py-2 text-xs font-medium text-gray-500">Institution</th>
                  <th className="px-3 py-2 text-xs font-medium text-gray-500">Status</th>
                  <th className="px-3 py-2 text-xs font-medium text-gray-500">Type</th>
                  <th className="px-3 py-2 text-xs font-medium text-gray-500">Retries</th>
                  <th className="px-3 py-2 text-xs font-medium text-gray-500">Zoho ID</th>
                  <th className="px-3 py-2 text-xs font-medium text-gray-500">Created</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((sub) => <TableRow key={sub.id} sub={sub} />)}
              </tbody>
            </table>
            {filtered.length === 0 && (
              <p className="text-center py-8 text-gray-400">No submissions match your filters</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
