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
  ChevronRight,
  Building,
  Stethoscope,
  Mail,
  CheckCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
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
import { Separator } from "@/components/ui/separator";
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

export default function MembersPortal() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
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
    defaultValues: {
      fullName: "",
      discipline: "",
      subspecialty: "",
      institution: "",
      wantsCommunications: false,
      wantsCANNCommunications: false,
    },
  });

  const passwordForm = useForm<ChangePasswordRequest>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
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
    if (authError || (authData && !authData.success)) {
      setLocation("/login");
    }
  }, [authData, authError, setLocation]);

  const logoutMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", "/api/auth/logout", {});
      return await response.json();
    },
    onSuccess: () => {
      queryClient.clear();
      toast({
        title: "Logged Out",
        description: "You have been logged out successfully.",
      });
      setLocation("/login");
    },
    onError: () => {
      toast({
        title: "Logout Failed",
        description: "Unable to logout. Please try again.",
        variant: "destructive",
      });
    },
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
        toast({
          title: "Profile Updated",
          description: "Your profile has been updated successfully.",
        });
      } else {
        toast({
          title: "Update Failed",
          description: data.message || "Unable to update profile.",
          variant: "destructive",
        });
      }
    },
    onError: () => {
      toast({
        title: "Update Failed",
        description: "Unable to update profile. Please try again.",
        variant: "destructive",
      });
    },
  });

  const changePasswordMutation = useMutation({
    mutationFn: async (data: ChangePasswordRequest): Promise<ApiResponse<void>> => {
      const response = await apiRequest("PUT", "/api/members/password", data);
      return await response.json();
    },
    onSuccess: (data) => {
      if (data.success) {
        passwordForm.reset();
        toast({
          title: "Password Changed",
          description: "Your password has been updated successfully.",
        });
      } else {
        toast({
          title: "Password Change Failed",
          description: data.message || "Unable to change password.",
          variant: "destructive",
        });
      }
    },
    onError: () => {
      toast({
        title: "Password Change Failed",
        description: "Unable to change password. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onProfileSubmit = (data: UpdateProfileRequest) => {
    updateProfileMutation.mutate(data);
  };

  const onPasswordSubmit = (data: ChangePasswordRequest) => {
    changePasswordMutation.mutate(data);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-CA", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <svg
            className="animate-spin h-10 w-10 text-[#00AFE6] mx-auto mb-4"
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
          <p className="text-gray-600 dark:text-gray-400">Loading your portal...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Welcome, {member?.fullName || "Member"}
              </h1>
              <div className="flex flex-wrap gap-2">
                {member?.isCASMember && (
                  <Badge className="bg-[#00AFE6] text-white">CAS Member</Badge>
                )}
                {member?.isCANNMember && (
                  <Badge className="bg-[#00DD89] text-white">CANN Member</Badge>
                )}
              </div>
            </div>
            <Button
              variant="outline"
              onClick={() => logoutMutation.mutate()}
              disabled={logoutMutation.isPending}
              className="mt-4 md:mt-0"
              data-testid="button-logout"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </div>

          <Tabs defaultValue="events" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:inline-flex">
              <TabsTrigger value="events" className="flex items-center gap-2" data-testid="tab-events">
                <Calendar className="w-4 h-4" />
                <span className="hidden sm:inline">Events</span>
              </TabsTrigger>
              <TabsTrigger value="recordings" className="flex items-center gap-2" data-testid="tab-recordings">
                <Video className="w-4 h-4" />
                <span className="hidden sm:inline">Recordings</span>
              </TabsTrigger>
              <TabsTrigger value="profile" className="flex items-center gap-2" data-testid="tab-profile">
                <User className="w-4 h-4" />
                <span className="hidden sm:inline">Profile</span>
              </TabsTrigger>
              <TabsTrigger value="settings" className="flex items-center gap-2" data-testid="tab-settings">
                <Settings className="w-4 h-4" />
                <span className="hidden sm:inline">Settings</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="events">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-[#00AFE6]" />
                    Upcoming Events
                  </CardTitle>
                  <CardDescription>
                    Exclusive events for CAS and CANN members
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {eventsLoading ? (
                    <div className="text-center py-8">
                      <svg
                        className="animate-spin h-8 w-8 text-[#00AFE6] mx-auto"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                    </div>
                  ) : events.length === 0 ? (
                    <div className="text-center py-12">
                      <Calendar className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                      <p className="text-gray-500 dark:text-gray-400">No upcoming events at this time.</p>
                      <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">
                        Check back soon for new events and webinars.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {events.map((event) => (
                        <div
                          key={event.id}
                          className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:border-[#00AFE6] transition-colors"
                          data-testid={`event-card-${event.id}`}
                        >
                          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <Badge variant="outline">{event.eventType}</Badge>
                                {event.accessLevel === "cann_member" && (
                                  <Badge className="bg-[#00DD89]/10 text-[#00DD89]">CANN Exclusive</Badge>
                                )}
                              </div>
                              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                                {event.title}
                              </h3>
                              {event.description && (
                                <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">
                                  {event.description}
                                </p>
                              )}
                              <div className="flex flex-wrap gap-4 text-sm text-gray-500 dark:text-gray-400">
                                <span className="flex items-center gap-1">
                                  <Clock className="w-4 h-4" />
                                  {formatDate(event.eventDate)}
                                </span>
                                {event.location && (
                                  <span className="flex items-center gap-1">
                                    <MapPin className="w-4 h-4" />
                                    {event.location}
                                  </span>
                                )}
                                {event.duration && (
                                  <span className="flex items-center gap-1">
                                    <Clock className="w-4 h-4" />
                                    {event.duration} min
                                  </span>
                                )}
                              </div>
                              {event.speakers && event.speakers.length > 0 && (
                                <div className="mt-2 flex items-center gap-2">
                                  <Users className="w-4 h-4 text-gray-400" />
                                  <span className="text-sm text-gray-500 dark:text-gray-400">
                                    {event.speakers.join(", ")}
                                  </span>
                                </div>
                              )}
                            </div>
                            {event.meetingLink && (
                              <Button
                                className="bg-gradient-to-r from-[#00AFE6] to-[#00DD89] text-white"
                                onClick={() => window.open(event.meetingLink, "_blank")}
                                data-testid={`button-join-event-${event.id}`}
                              >
                                Join Event
                                <ExternalLink className="w-4 h-4 ml-2" />
                              </Button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="recordings">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Video className="w-5 h-5 text-[#00AFE6]" />
                    Event Recordings
                  </CardTitle>
                  <CardDescription>
                    Watch past events and educational content
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {recordingsLoading ? (
                    <div className="text-center py-8">
                      <svg
                        className="animate-spin h-8 w-8 text-[#00AFE6] mx-auto"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                    </div>
                  ) : recordings.length === 0 ? (
                    <div className="text-center py-12">
                      <Video className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                      <p className="text-gray-500 dark:text-gray-400">No recordings available yet.</p>
                      <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">
                        Recordings will appear here after events conclude.
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {recordings.map((recording) => (
                        <div
                          key={recording.id}
                          className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden hover:border-[#00AFE6] transition-colors"
                          data-testid={`recording-card-${recording.id}`}
                        >
                          <div className="relative bg-gray-100 dark:bg-gray-800 aspect-video flex items-center justify-center">
                            {recording.thumbnailUrl ? (
                              <img
                                src={recording.thumbnailUrl}
                                alt={recording.title}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <Video className="w-12 h-12 text-gray-400" />
                            )}
                            <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                              <Button
                                size="lg"
                                className="bg-white/90 text-gray-900 hover:bg-white"
                                onClick={() => window.open(recording.recordingUrl, "_blank")}
                                data-testid={`button-play-recording-${recording.id}`}
                              >
                                <Play className="w-6 h-6" />
                              </Button>
                            </div>
                          </div>
                          <div className="p-4">
                            <Badge variant="outline" className="mb-2">{recording.eventType}</Badge>
                            <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                              {recording.title}
                            </h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              {formatDate(recording.eventDate)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="profile">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <User className="w-5 h-5 text-[#00AFE6]" />
                        Your Profile
                      </CardTitle>
                      <CardDescription>
                        View and edit your membership information
                      </CardDescription>
                    </div>
                    {!isEditing ? (
                      <Button variant="outline" onClick={() => setIsEditing(true)} data-testid="button-edit-profile">
                        <Edit className="w-4 h-4 mr-2" />
                        Edit
                      </Button>
                    ) : (
                      <Button variant="outline" onClick={() => setIsEditing(false)} data-testid="button-cancel-edit">
                        <X className="w-4 h-4 mr-2" />
                        Cancel
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  {profileLoading ? (
                    <div className="text-center py-8">
                      <svg
                        className="animate-spin h-8 w-8 text-[#00AFE6] mx-auto"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                    </div>
                  ) : isEditing ? (
                    <Form {...profileForm}>
                      <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-4">
                        <FormField
                          control={profileForm.control}
                          name="fullName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Full Name</FormLabel>
                              <FormControl>
                                <Input {...field} data-testid="input-fullname" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <FormField
                            control={profileForm.control}
                            name="discipline"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Discipline</FormLabel>
                                <FormControl>
                                  <Input {...field} data-testid="input-discipline" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={profileForm.control}
                            name="subspecialty"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Subspecialty</FormLabel>
                                <FormControl>
                                  <Input {...field} data-testid="input-subspecialty" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        <FormField
                          control={profileForm.control}
                          name="institution"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Institution</FormLabel>
                              <FormControl>
                                <Input {...field} data-testid="input-institution" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <Separator className="my-4" />
                        <div className="space-y-4">
                          <h4 className="font-medium text-gray-900 dark:text-white">Communication Preferences</h4>
                          <FormField
                            control={profileForm.control}
                            name="wantsCommunications"
                            render={({ field }) => (
                              <FormItem className="flex items-center justify-between rounded-lg border p-3">
                                <div className="space-y-0.5">
                                  <FormLabel className="text-base">CAS Updates</FormLabel>
                                  <p className="text-sm text-gray-500">Receive updates about CAS news and events</p>
                                </div>
                                <FormControl>
                                  <Switch checked={field.value} onCheckedChange={field.onChange} data-testid="switch-cas-communications" />
                                </FormControl>
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={profileForm.control}
                            name="wantsCANNCommunications"
                            render={({ field }) => (
                              <FormItem className="flex items-center justify-between rounded-lg border p-3">
                                <div className="space-y-0.5">
                                  <FormLabel className="text-base">CANN Updates</FormLabel>
                                  <p className="text-sm text-gray-500">Receive updates about CANN activities</p>
                                </div>
                                <FormControl>
                                  <Switch checked={field.value} onCheckedChange={field.onChange} data-testid="switch-cann-communications" />
                                </FormControl>
                              </FormItem>
                            )}
                          />
                        </div>
                        <div className="flex justify-end">
                          <Button
                            type="submit"
                            className="bg-gradient-to-r from-[#00AFE6] to-[#00DD89] text-white"
                            disabled={updateProfileMutation.isPending}
                            data-testid="button-save-profile"
                          >
                            {updateProfileMutation.isPending ? (
                              <span className="flex items-center">
                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                </svg>
                                Saving...
                              </span>
                            ) : (
                              <span className="flex items-center">
                                <Save className="w-4 h-4 mr-2" />
                                Save Changes
                              </span>
                            )}
                          </Button>
                        </div>
                      </form>
                    </Form>
                  ) : (
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <div className="flex items-start gap-3">
                            <User className="w-5 h-5 text-[#00AFE6] mt-0.5" />
                            <div>
                              <p className="text-sm text-gray-500 dark:text-gray-400">Full Name</p>
                              <p className="font-medium text-gray-900 dark:text-white">{member?.fullName || "-"}</p>
                            </div>
                          </div>
                          <div className="flex items-start gap-3">
                            <Mail className="w-5 h-5 text-[#00AFE6] mt-0.5" />
                            <div>
                              <p className="text-sm text-gray-500 dark:text-gray-400">Email</p>
                              <p className="font-medium text-gray-900 dark:text-white">{member?.email || "-"}</p>
                            </div>
                          </div>
                          <div className="flex items-start gap-3">
                            <Stethoscope className="w-5 h-5 text-[#00AFE6] mt-0.5" />
                            <div>
                              <p className="text-sm text-gray-500 dark:text-gray-400">Discipline</p>
                              <p className="font-medium text-gray-900 dark:text-white">{member?.discipline || "-"}</p>
                            </div>
                          </div>
                        </div>
                        <div className="space-y-4">
                          <div className="flex items-start gap-3">
                            <ChevronRight className="w-5 h-5 text-[#00AFE6] mt-0.5" />
                            <div>
                              <p className="text-sm text-gray-500 dark:text-gray-400">Subspecialty</p>
                              <p className="font-medium text-gray-900 dark:text-white">{member?.subspecialty || "-"}</p>
                            </div>
                          </div>
                          <div className="flex items-start gap-3">
                            <Building className="w-5 h-5 text-[#00AFE6] mt-0.5" />
                            <div>
                              <p className="text-sm text-gray-500 dark:text-gray-400">Institution</p>
                              <p className="font-medium text-gray-900 dark:text-white">{member?.institution || "-"}</p>
                            </div>
                          </div>
                          <div className="flex items-start gap-3">
                            <CheckCircle className="w-5 h-5 text-[#00AFE6] mt-0.5" />
                            <div>
                              <p className="text-sm text-gray-500 dark:text-gray-400">Member Since</p>
                              <p className="font-medium text-gray-900 dark:text-white">
                                {member?.createdAt ? formatDate(member.createdAt) : "-"}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="settings">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lock className="w-5 h-5 text-[#00AFE6]" />
                    Change Password
                  </CardTitle>
                  <CardDescription>
                    Update your account password
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...passwordForm}>
                    <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-4 max-w-md">
                      <FormField
                        control={passwordForm.control}
                        name="currentPassword"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Current Password</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Input
                                  {...field}
                                  type={showCurrentPassword ? "text" : "password"}
                                  className="pr-10"
                                  data-testid="input-current-password"
                                />
                                <button
                                  type="button"
                                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                  {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={passwordForm.control}
                        name="newPassword"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>New Password</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Input
                                  {...field}
                                  type={showNewPassword ? "text" : "password"}
                                  className="pr-10"
                                  data-testid="input-new-password"
                                />
                                <button
                                  type="button"
                                  onClick={() => setShowNewPassword(!showNewPassword)}
                                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                  {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={passwordForm.control}
                        name="confirmPassword"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Confirm New Password</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Input
                                  {...field}
                                  type={showConfirmPassword ? "text" : "password"}
                                  className="pr-10"
                                  data-testid="input-confirm-new-password"
                                />
                                <button
                                  type="button"
                                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
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
                          Password must be at least 8 characters with uppercase, lowercase, and numbers.
                        </p>
                      </div>
                      <Button
                        type="submit"
                        className="bg-gradient-to-r from-[#00AFE6] to-[#00DD89] text-white"
                        disabled={changePasswordMutation.isPending}
                        data-testid="button-change-password"
                      >
                        {changePasswordMutation.isPending ? (
                          <span className="flex items-center">
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                            </svg>
                            Updating...
                          </span>
                        ) : (
                          <span className="flex items-center">
                            <Lock className="w-4 h-4 mr-2" />
                            Update Password
                          </span>
                        )}
                      </Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
}
