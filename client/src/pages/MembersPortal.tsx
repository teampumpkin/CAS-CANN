import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  User,
  Calendar,
  Video,
  Settings,
  LogOut,
  Lock,
  Edit,
  Save,
  X,
  Play,
  Clock,
  MapPin,
  Users,
  Eye,
  EyeOff,
  Shield,
  ExternalLink,
  Building,
  Stethoscope,
  Mail,
  CheckCircle,
  Sparkles,
} from "lucide-react";
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
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { changePasswordSchema, updateProfileSchema } from "@shared/schema";
import type { ChangePasswordRequest, UpdateProfileRequest } from "@shared/schema";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useLocation } from "wouter";

interface Member {
  id: number;
  email: string;
  fullName: string;
  role: string;
  discipline?: string;
  subspecialty?: string;
  institution?: string;
  amyloidosisType?: string;
  isCASMember: boolean;
  isCANNMember: boolean;
  wantsCommunications?: boolean;
  wantsCANNCommunications?: boolean;
  wantsServicesMapInclusion?: boolean;
  createdAt?: string;
  lastLoginAt?: string;
}

interface MemberEvent {
  id: number;
  title: string;
  description?: string;
  eventDate: string;
  eventType: string;
  location?: string;
  meetingLink?: string;
  recordingUrl?: string;
  thumbnailUrl?: string;
  duration?: number;
  speakers?: string[];
  tags?: string[];
  accessLevel: string;
}

interface ApiResponse<T> {
  success: boolean;
  message?: string;
  profile?: T;
  events?: MemberEvent[];
  recordings?: MemberEvent[];
  member?: Member;
}

type SectionKey = "events" | "recordings" | "profile" | "settings";

// ---- Shared design tokens (CAS site: Rosarivo serif + cyan→green) ----
const GRAD_BTN =
  "bg-gradient-to-r from-[#00AFE6] to-[#00DD89] text-white border-0 shadow-lg hover:shadow-xl hover:shadow-[#00AFE6]/30 hover:scale-[1.02] transition-all duration-300 rounded-xl";
const ICON_TILE =
  "bg-gradient-to-br from-[#00AFE6]/20 to-[#00DD89]/20 rounded-2xl flex items-center justify-center";
const GRAD_TEXT = "bg-gradient-to-r from-[#00AFE6] to-[#00DD89] bg-clip-text text-transparent";
const PANEL =
  "rounded-2xl border border-slate-200/70 dark:border-white/10 bg-white dark:bg-white/[0.03] shadow-sm";

function Spinner({ className = "h-8 w-8" }: { className?: string }) {
  return (
    <svg className={`animate-spin text-[#00AFE6] ${className}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
    </svg>
  );
}

function initialsOf(name?: string) {
  if (!name) return "M";
  return name.trim().split(/\s+/).slice(0, 2).map((n) => n[0]?.toUpperCase()).join("");
}

const NAV: { key: SectionKey; label: string; icon: typeof Calendar; desc: string }[] = [
  { key: "events", label: "Events", icon: Calendar, desc: "Exclusive events for CAS and CANN members" },
  { key: "recordings", label: "Recordings", icon: Video, desc: "Watch past events and educational content" },
  { key: "profile", label: "Profile", icon: User, desc: "View and edit your membership information" },
  { key: "settings", label: "Settings", icon: Settings, desc: "Update your account password" },
];

export default function MembersPortal() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [section, setSection] = useState<SectionKey>("events");
  const [isEditing, setIsEditing] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { data: authData, isLoading: authLoading, error: authError } = useQuery<ApiResponse<Member>>({
    queryKey: ["/api/auth/me"],
  });

  const { data: profileData, isLoading: profileLoading } = useQuery<ApiResponse<Member>>({
    queryKey: ["/api/members/profile"],
    enabled: !!authData?.success,
  });

  const { data: eventsData, isLoading: eventsLoading } = useQuery<ApiResponse<MemberEvent[]>>({
    queryKey: ["/api/members/events"],
    enabled: !!authData?.success,
  });

  const { data: recordingsData, isLoading: recordingsLoading } = useQuery<ApiResponse<MemberEvent[]>>({
    queryKey: ["/api/members/recordings"],
    enabled: !!authData?.success,
  });

  const member = profileData?.profile || authData?.member;
  const events = eventsData?.events || [];
  const recordings = recordingsData?.recordings || [];

  const profileForm = useForm<UpdateProfileRequest>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: { fullName: "", discipline: "", subspecialty: "", institution: "", wantsCommunications: false, wantsCANNCommunications: false },
  });

  const passwordForm = useForm<ChangePasswordRequest>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: { currentPassword: "", newPassword: "", confirmPassword: "" },
  });

  useEffect(() => {
    if (member) {
      profileForm.reset({
        fullName: member.fullName || "",
        discipline: member.discipline || "",
        subspecialty: member.subspecialty || "",
        institution: member.institution || "",
        wantsCommunications: member.wantsCommunications || false,
        wantsCANNCommunications: member.wantsCANNCommunications || false,
      });
    }
  }, [member, profileForm]);

  useEffect(() => {
    if (authError || (authData && !authData.success)) setLocation("/login");
  }, [authData, authError, setLocation]);

  const logoutMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", "/api/auth/logout", {});
      return await response.json();
    },
    onSuccess: () => {
      queryClient.clear();
      toast({ title: "Logged Out", description: "You have been logged out successfully." });
      setLocation("/login");
    },
    onError: () => toast({ title: "Logout Failed", description: "Unable to logout. Please try again.", variant: "destructive" }),
  });

  const updateProfileMutation = useMutation({
    mutationFn: async (data: UpdateProfileRequest): Promise<ApiResponse<Member>> => {
      const response = await apiRequest("PUT", "/api/members/profile", data);
      return await response.json();
    },
    onSuccess: (data) => {
      if (data.success) {
        queryClient.invalidateQueries({ queryKey: ["/api/members/profile"] });
        queryClient.invalidateQueries({ queryKey: ["/api/auth/me"] });
        setIsEditing(false);
        toast({ title: "Profile Updated", description: "Your profile has been updated successfully." });
      } else {
        toast({ title: "Update Failed", description: data.message || "Unable to update profile.", variant: "destructive" });
      }
    },
    onError: () => toast({ title: "Update Failed", description: "Unable to update profile. Please try again.", variant: "destructive" }),
  });

  const changePasswordMutation = useMutation({
    mutationFn: async (data: ChangePasswordRequest): Promise<ApiResponse<void>> => {
      const response = await apiRequest("PUT", "/api/members/password", data);
      return await response.json();
    },
    onSuccess: (data) => {
      if (data.success) {
        passwordForm.reset();
        toast({ title: "Password Changed", description: "Your password has been updated successfully." });
      } else {
        toast({ title: "Password Change Failed", description: data.message || "Unable to change password.", variant: "destructive" });
      }
    },
    onError: () => toast({ title: "Password Change Failed", description: "Unable to change password. Please try again.", variant: "destructive" }),
  });

  const onProfileSubmit = (data: UpdateProfileRequest) => updateProfileMutation.mutate(data);
  const onPasswordSubmit = (data: ChangePasswordRequest) => changePasswordMutation.mutate(data);

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("en-CA", { year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit" });

  if (authLoading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-[#0b1120] flex items-center justify-center">
        <div className="text-center">
          <Spinner className="h-10 w-10 mx-auto mb-4" />
          <p className="text-slate-500 dark:text-slate-400">Loading your portal…</p>
        </div>
      </div>
    );
  }

  const active = NAV.find((n) => n.key === section)!;

  const NavButton = ({ item, mobile = false }: { item: (typeof NAV)[number]; mobile?: boolean }) => {
    const Icon = item.icon;
    const isActive = section === item.key;
    return (
      <button
        onClick={() => { setSection(item.key); if (item.key !== "profile") setIsEditing(false); }}
        data-testid={`tab-${item.key}`}
        className={`flex items-center gap-3 rounded-xl font-medium transition-all ${mobile ? "px-4 py-2 shrink-0" : "w-full px-4 py-3"} ${
          isActive
            ? "bg-gradient-to-r from-[#00AFE6] to-[#00DD89] text-white shadow-md shadow-[#00AFE6]/25"
            : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5"
        }`}
      >
        <Icon className="w-[18px] h-[18px] shrink-0" />
        <span>{item.label}</span>
      </button>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0b1120] lg:flex">
      {/* ===================== Sidebar (desktop) ===================== */}
      <aside className="hidden lg:flex lg:flex-col lg:w-72 lg:shrink-0 border-r border-slate-200/70 dark:border-white/10 bg-white/80 dark:bg-white/[0.03] backdrop-blur-xl">
        <div className="sticky top-0 flex flex-col h-screen p-5">
          <div className="inline-flex items-center gap-2 mb-6">
            <div className={`${ICON_TILE} h-9 w-9`}><Shield className="w-4.5 h-4.5 text-[#00AFE6]" /></div>
            <div>
              <p className="text-sm font-bold font-rosarivo text-slate-900 dark:text-white leading-none">Members Portal</p>
              <p className="text-[11px] text-slate-400">Canadian Amyloidosis Society</p>
            </div>
          </div>

          {/* Member card */}
          <div className="rounded-2xl border border-slate-200/70 dark:border-white/10 bg-gradient-to-br from-[#00AFE6]/10 via-[#00DD89]/5 to-transparent p-4 mb-6">
            <div className="flex items-center gap-3">
              <div className={`${ICON_TILE} h-12 w-12 shrink-0 !rounded-2xl`}>
                <span className="text-base font-bold font-rosarivo text-[#0092c4] dark:text-white">{initialsOf(member?.fullName)}</span>
              </div>
              <div className="min-w-0">
                <p className="font-semibold text-slate-900 dark:text-white truncate">{member?.fullName || "Member"}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{member?.email}</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-1.5 mt-3">
              {member?.isCASMember && <span className="rounded-full bg-[#00AFE6]/15 text-[#0092c4] dark:text-[#4dd0f5] border border-[#00AFE6]/30 px-2 py-0.5 text-[11px] font-semibold">CAS</span>}
              {member?.isCANNMember && <span className="rounded-full bg-[#00DD89]/15 text-[#00a866] dark:text-[#4ff0b0] border border-[#00DD89]/30 px-2 py-0.5 text-[11px] font-semibold">CANN</span>}
            </div>
          </div>

          <nav className="flex flex-col gap-1.5">
            {NAV.map((item) => <NavButton key={item.key} item={item} />)}
          </nav>

          <div className="mt-auto pt-5">
            <Button
              variant="outline"
              onClick={() => logoutMutation.mutate()}
              disabled={logoutMutation.isPending}
              className="w-full justify-start rounded-xl border-slate-300 dark:border-white/15"
              data-testid="button-logout"
            >
              <LogOut className="w-4 h-4 mr-2" /> Sign Out
            </Button>
          </div>
        </div>
      </aside>

      {/* ===================== Main ===================== */}
      <div className="flex-1 min-w-0">
        {/* Mobile top nav */}
        <div className="lg:hidden border-b border-slate-200/70 dark:border-white/10 bg-white/80 dark:bg-white/[0.03] backdrop-blur-xl px-4 py-3">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className={`${ICON_TILE} h-10 w-10 shrink-0 !rounded-2xl`}>
                <span className="text-sm font-bold font-rosarivo text-[#0092c4] dark:text-white">{initialsOf(member?.fullName)}</span>
              </div>
              <div className="min-w-0">
                <p className="font-semibold text-slate-900 dark:text-white truncate text-sm">{member?.fullName || "Member"}</p>
                <div className="flex gap-1">
                  {member?.isCASMember && <span className="text-[10px] text-[#0092c4] dark:text-[#4dd0f5] font-semibold">CAS</span>}
                  {member?.isCANNMember && <span className="text-[10px] text-[#00a866] dark:text-[#4ff0b0] font-semibold">CANN</span>}
                </div>
              </div>
            </div>
            <Button variant="outline" size="sm" onClick={() => logoutMutation.mutate()} disabled={logoutMutation.isPending} className="rounded-xl" data-testid="button-logout-mobile">
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
          <div className="flex gap-1.5 overflow-x-auto -mx-1 px-1 pb-0.5">
            {NAV.map((item) => <NavButton key={item.key} item={item} mobile />)}
          </div>
        </div>

        <main className="max-w-5xl mx-auto px-4 sm:px-8 py-8">
          {/* Section header */}
          <div className="flex items-start justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold font-rosarivo text-slate-900 dark:text-white">
                <span className={GRAD_TEXT}>{active.label}</span>
              </h1>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{active.desc}</p>
            </div>
            {section === "profile" && (
              !isEditing ? (
                <Button variant="outline" className="rounded-xl shrink-0" onClick={() => setIsEditing(true)} data-testid="button-edit-profile">
                  <Edit className="w-4 h-4 mr-2" /> Edit
                </Button>
              ) : (
                <Button variant="outline" className="rounded-xl shrink-0" onClick={() => setIsEditing(false)} data-testid="button-cancel-edit">
                  <X className="w-4 h-4 mr-2" /> Cancel
                </Button>
              )
            )}
          </div>

          {/* ---------------- Events ---------------- */}
          {section === "events" && (
            eventsLoading ? (
              <div className="text-center py-16"><Spinner className="h-8 w-8 mx-auto" /></div>
            ) : events.length === 0 ? (
              <div className={`${PANEL} text-center py-16`}>
                <div className={`${ICON_TILE} h-16 w-16 mx-auto mb-4`}><Calendar className="w-7 h-7 text-[#00AFE6]" /></div>
                <p className="text-slate-600 dark:text-slate-300 font-medium">No upcoming events at this time.</p>
                <p className="text-sm text-slate-400 dark:text-slate-500 mt-1">Check back soon for new events and webinars.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {events.map((event, i) => (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, delay: i * 0.06 }}
                    className={`${PANEL} group p-5 hover:border-[#00AFE6]/50 hover:shadow-xl hover:shadow-[#00AFE6]/10 transition-all duration-300`}
                    data-testid={`event-card-${event.id}`}
                  >
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                      <div className="flex gap-4">
                        <div className={`${ICON_TILE} h-12 w-12 shrink-0 hidden sm:flex`}><Calendar className="w-5 h-5 text-[#00AFE6]" /></div>
                        <div className="flex-1">
                          <div className="flex flex-wrap items-center gap-2 mb-2">
                            <span className="inline-flex items-center rounded-full bg-gradient-to-r from-[#00AFE6] to-[#00DD89] text-white px-2.5 py-0.5 text-xs font-semibold capitalize">{event.eventType}</span>
                            {event.accessLevel === "cann_member" && (
                              <span className="inline-flex items-center rounded-full bg-[#00DD89]/15 text-[#00a866] dark:text-[#4ff0b0] border border-[#00DD89]/30 px-2.5 py-0.5 text-xs font-semibold">CANN Exclusive</span>
                            )}
                          </div>
                          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{event.title}</h3>
                          {event.description && <p className="text-slate-600 dark:text-slate-400 text-sm mt-1 mb-3">{event.description}</p>}
                          <div className="flex flex-wrap gap-x-5 gap-y-1.5 text-sm text-slate-500 dark:text-slate-400">
                            <span className="flex items-center gap-1.5"><Clock className="w-4 h-4 text-[#00AFE6]" />{formatDate(event.eventDate)}</span>
                            {event.location && <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4 text-[#00AFE6]" />{event.location}</span>}
                            {event.duration && <span className="flex items-center gap-1.5"><Clock className="w-4 h-4 text-[#00AFE6]" />{event.duration} min</span>}
                          </div>
                          {event.speakers && event.speakers.length > 0 && (
                            <div className="mt-2 flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400"><Users className="w-4 h-4 text-[#00AFE6]" />{event.speakers.join(", ")}</div>
                          )}
                        </div>
                      </div>
                      {event.meetingLink && (
                        <Button className={`${GRAD_BTN} shrink-0`} onClick={() => window.open(event.meetingLink, "_blank")} data-testid={`button-join-event-${event.id}`}>
                          Join Event<ExternalLink className="w-4 h-4 ml-2" />
                        </Button>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            )
          )}

          {/* ---------------- Recordings ---------------- */}
          {section === "recordings" && (
            recordingsLoading ? (
              <div className="text-center py-16"><Spinner className="h-8 w-8 mx-auto" /></div>
            ) : recordings.length === 0 ? (
              <div className={`${PANEL} text-center py-16`}>
                <div className={`${ICON_TILE} h-16 w-16 mx-auto mb-4`}><Video className="w-7 h-7 text-[#00AFE6]" /></div>
                <p className="text-slate-600 dark:text-slate-300 font-medium">No recordings available yet.</p>
                <p className="text-sm text-slate-400 dark:text-slate-500 mt-1">Recordings will appear here after events conclude.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {recordings.map((recording, i) => (
                  <motion.div
                    key={recording.id}
                    initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, delay: i * 0.06 }}
                    className={`${PANEL} group overflow-hidden hover:border-[#00AFE6]/50 hover:shadow-xl hover:shadow-[#00AFE6]/10 transition-all duration-300`}
                    data-testid={`recording-card-${recording.id}`}
                  >
                    <div className="relative aspect-video flex items-center justify-center bg-gradient-to-br from-[#00AFE6]/15 via-[#00DD89]/10 to-slate-100 dark:to-white/[0.03]">
                      {recording.thumbnailUrl ? (
                        <img src={recording.thumbnailUrl} alt={recording.title} className="w-full h-full object-cover" />
                      ) : (
                        <Video className="w-12 h-12 text-[#00AFE6]/60" />
                      )}
                      <button
                        onClick={() => window.open(recording.recordingUrl, "_blank")}
                        className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/30 transition-colors"
                        data-testid={`button-play-recording-${recording.id}`}
                      >
                        <span className="h-14 w-14 rounded-full bg-white/90 text-[#0092c4] flex items-center justify-center shadow-lg scale-90 group-hover:scale-100 transition-transform">
                          <Play className="w-6 h-6 ml-0.5 fill-current" />
                        </span>
                      </button>
                    </div>
                    <div className="p-5">
                      <span className="inline-flex items-center rounded-full bg-gradient-to-r from-[#00AFE6] to-[#00DD89] text-white px-2.5 py-0.5 text-xs font-semibold capitalize mb-2">{recording.eventType}</span>
                      <h3 className="font-semibold text-slate-900 dark:text-white">{recording.title}</h3>
                      <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{formatDate(recording.eventDate)}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            )
          )}

          {/* ---------------- Profile ---------------- */}
          {section === "profile" && (
            profileLoading ? (
              <div className="text-center py-16"><Spinner className="h-8 w-8 mx-auto" /></div>
            ) : isEditing ? (
              <div className={`${PANEL} p-6`}>
                <Form {...profileForm}>
                  <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-5">
                    <FormField control={profileForm.control} name="fullName" render={({ field }) => (
                      <FormItem><FormLabel>Full Name</FormLabel><FormControl><Input className="rounded-xl" {...field} data-testid="input-fullname" /></FormControl><FormMessage /></FormItem>
                    )} />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <FormField control={profileForm.control} name="discipline" render={({ field }) => (
                        <FormItem><FormLabel>Discipline</FormLabel><FormControl><Input className="rounded-xl" {...field} data-testid="input-discipline" /></FormControl><FormMessage /></FormItem>
                      )} />
                      <FormField control={profileForm.control} name="subspecialty" render={({ field }) => (
                        <FormItem><FormLabel>Subspecialty</FormLabel><FormControl><Input className="rounded-xl" {...field} data-testid="input-subspecialty" /></FormControl><FormMessage /></FormItem>
                      )} />
                    </div>
                    <FormField control={profileForm.control} name="institution" render={({ field }) => (
                      <FormItem><FormLabel>Institution</FormLabel><FormControl><Input className="rounded-xl" {...field} data-testid="input-institution" /></FormControl><FormMessage /></FormItem>
                    )} />
                    <div className="pt-1">
                      <h4 className="font-semibold text-slate-900 dark:text-white mb-3">Communication Preferences</h4>
                      <div className="space-y-3">
                        <FormField control={profileForm.control} name="wantsCommunications" render={({ field }) => (
                          <FormItem className="flex items-center justify-between rounded-2xl border border-slate-200/70 dark:border-white/10 p-4">
                            <div className="space-y-0.5"><FormLabel className="text-base">CAS Updates</FormLabel><p className="text-sm text-slate-500 dark:text-slate-400">Receive updates about CAS news and events</p></div>
                            <FormControl><Switch checked={field.value} onCheckedChange={field.onChange} data-testid="switch-cas-communications" /></FormControl>
                          </FormItem>
                        )} />
                        <FormField control={profileForm.control} name="wantsCANNCommunications" render={({ field }) => (
                          <FormItem className="flex items-center justify-between rounded-2xl border border-slate-200/70 dark:border-white/10 p-4">
                            <div className="space-y-0.5"><FormLabel className="text-base">CANN Updates</FormLabel><p className="text-sm text-slate-500 dark:text-slate-400">Receive updates about CANN activities</p></div>
                            <FormControl><Switch checked={field.value} onCheckedChange={field.onChange} data-testid="switch-cann-communications" /></FormControl>
                          </FormItem>
                        )} />
                      </div>
                    </div>
                    <div className="flex justify-end">
                      <Button type="submit" className={GRAD_BTN} disabled={updateProfileMutation.isPending} data-testid="button-save-profile">
                        {updateProfileMutation.isPending ? (
                          <span className="flex items-center"><Spinner className="-ml-1 mr-2 h-4 w-4 text-white" />Saving…</span>
                        ) : (
                          <span className="flex items-center"><Save className="w-4 h-4 mr-2" />Save Changes</span>
                        )}
                      </Button>
                    </div>
                  </form>
                </Form>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { icon: User, label: "Full Name", value: member?.fullName },
                  { icon: Mail, label: "Email", value: member?.email },
                  { icon: Stethoscope, label: "Discipline", value: member?.discipline },
                  { icon: Sparkles, label: "Subspecialty", value: member?.subspecialty },
                  { icon: Building, label: "Institution", value: member?.institution },
                  { icon: CheckCircle, label: "Member Since", value: member?.createdAt ? formatDate(member.createdAt) : undefined },
                ].map(({ icon: Icon, label, value }) => (
                  <div key={label} className={`${PANEL} flex items-start gap-3 p-4`}>
                    <div className={`${ICON_TILE} h-10 w-10 shrink-0`}><Icon className="w-4.5 h-4.5 text-[#00AFE6]" /></div>
                    <div className="min-w-0">
                      <p className="text-xs uppercase tracking-wide text-slate-400 dark:text-slate-500">{label}</p>
                      <p className="font-medium text-slate-900 dark:text-white truncate">{value || "—"}</p>
                    </div>
                  </div>
                ))}
              </div>
            )
          )}

          {/* ---------------- Settings ---------------- */}
          {section === "settings" && (
            <div className={`${PANEL} p-6 max-w-lg`}>
              <Form {...passwordForm}>
                <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-5">
                  {[
                    { name: "currentPassword" as const, label: "Current Password", show: showCurrentPassword, setShow: setShowCurrentPassword, testid: "input-current-password" },
                    { name: "newPassword" as const, label: "New Password", show: showNewPassword, setShow: setShowNewPassword, testid: "input-new-password" },
                    { name: "confirmPassword" as const, label: "Confirm New Password", show: showConfirmPassword, setShow: setShowConfirmPassword, testid: "input-confirm-new-password" },
                  ].map(({ name, label, show, setShow, testid }) => (
                    <FormField key={name} control={passwordForm.control} name={name} render={({ field }) => (
                      <FormItem>
                        <FormLabel>{label}</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input {...field} type={show ? "text" : "password"} className="rounded-xl pr-10" data-testid={testid} />
                            <button type="button" onClick={() => setShow(!show)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#00AFE6]">
                              {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                  ))}
                  <div className="flex items-start gap-2 rounded-2xl bg-gradient-to-r from-[#00AFE6]/10 to-[#00DD89]/10 border border-[#00AFE6]/20 p-4">
                    <Shield className="w-4 h-4 text-[#00AFE6] flex-shrink-0 mt-0.5" />
                    <p className="text-xs text-slate-600 dark:text-slate-300">Password must be at least 8 characters with uppercase, lowercase, and numbers.</p>
                  </div>
                  <Button type="submit" className={GRAD_BTN} disabled={changePasswordMutation.isPending} data-testid="button-change-password">
                    {changePasswordMutation.isPending ? (
                      <span className="flex items-center"><Spinner className="-ml-1 mr-2 h-4 w-4 text-white" />Updating…</span>
                    ) : (
                      <span className="flex items-center"><Lock className="w-4 h-4 mr-2" />Update Password</span>
                    )}
                  </Button>
                </form>
              </Form>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
