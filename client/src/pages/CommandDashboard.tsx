import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, Play, Pause, Trash2, Plus, RefreshCw, Calendar, CheckCircle2, XCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";

interface JanuaryViewResult {
  success: boolean;
  created: string[];
  failed: { name: string; error: string }[];
  summary: string;
  views?: { name: string; filter: string }[];
}

export default function CommandDashboard() {
  const { toast } = useToast();
  const [selectedWorkflow, setSelectedWorkflow] = useState<number | null>(null);
  const [januaryViewResult, setJanuaryViewResult] = useState<JanuaryViewResult | null>(null);

  const { data: workflows, isLoading: workflowsLoading } = useQuery({
    queryKey: ["/api/workflows"],
  });

  const { data: templates, isLoading: templatesLoading } = useQuery({
    queryKey: ["/api/workflow-templates"],
  });

  const { data: campaignLists, isLoading: listsLoading } = useQuery({
    queryKey: ["/api/campaigns/lists"],
  });

  const executeWorkflowMutation = useMutation({
    mutationFn: async ({ id, context }: { id: number; context?: any }) => {
      return await apiRequest(`/api/workflows/${id}/execute`, {
        method: "POST",
        body: JSON.stringify({ context: context || {} }),
      });
    },
    onSuccess: () => {
      toast({ title: "Workflow executed successfully" });
      queryClient.invalidateQueries({ queryKey: ["/api/workflows"] });
    },
    onError: (error: any) => {
      toast({ 
        title: "Workflow execution failed", 
        description: error.message,
        variant: "destructive" 
      });
    },
  });

  const toggleWorkflowMutation = useMutation({
    mutationFn: async ({ id, status }: { id: number; status: string }) => {
      return await apiRequest(`/api/workflows/${id}`, {
        method: "PUT",
        body: JSON.stringify({ status }),
      });
    },
    onSuccess: () => {
      toast({ title: "Workflow status updated" });
      queryClient.invalidateQueries({ queryKey: ["/api/workflows"] });
    },
  });

  const deleteWorkflowMutation = useMutation({
    mutationFn: async (id: number) => {
      return await apiRequest(`/api/workflows/${id}`, {
        method: "DELETE",
      });
    },
    onSuccess: () => {
      toast({ title: "Workflow deleted" });
      queryClient.invalidateQueries({ queryKey: ["/api/workflows"] });
    },
  });

  const createFromTemplateMutation = useMutation({
    mutationFn: async (templateName: string) => {
      return await apiRequest(`/api/workflow-templates/${templateName}/create`, {
        method: "POST",
        body: JSON.stringify({ config: {} }),
      });
    },
    onSuccess: () => {
      toast({ title: "Workflow created from template" });
      queryClient.invalidateQueries({ queryKey: ["/api/workflows"] });
    },
  });

  const createJanuaryViewsMutation = useMutation({
    mutationFn: async () => {
      return await apiRequest("/api/admin/zoho/create-january-views", {
        method: "POST",
      }) as JanuaryViewResult;
    },
    onSuccess: (data) => {
      setJanuaryViewResult(data);
      if (data.success) {
        toast({ title: "January views created successfully", description: data.summary });
      } else {
        toast({
          title: "Some views failed to create",
          description: data.summary,
          variant: "destructive",
        });
      }
    },
    onError: (error: any) => {
      toast({
        title: "Failed to create January views",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return (
    <div className="min-h-screen bg-background p-8" data-testid="command-dashboard">
      <div className="max-w-7xl mx-auto space-y-8">
        <div>
          <h1 className="text-4xl font-bold mb-2">Marketing Automation Command Center</h1>
          <p className="text-muted-foreground">
            Control your Zoho CRM → Campaigns automation workflows
          </p>
        </div>

        <Tabs defaultValue="workflows" className="w-full">
          <TabsList>
            <TabsTrigger value="workflows" data-testid="tab-workflows">Workflows</TabsTrigger>
            <TabsTrigger value="templates" data-testid="tab-templates">Templates</TabsTrigger>
            <TabsTrigger value="campaigns" data-testid="tab-campaigns">Campaign Lists</TabsTrigger>
            <TabsTrigger value="crm-views" data-testid="tab-crm-views">CRM Views</TabsTrigger>
          </TabsList>

          <TabsContent value="workflows" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Active Workflows</CardTitle>
                <CardDescription>
                  Manage and execute your automation workflows
                </CardDescription>
              </CardHeader>
              <CardContent>
                {workflowsLoading ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin" />
                  </div>
                ) : workflows?.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No workflows yet. Create one from a template to get started.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {workflows?.map((workflow: any) => (
                      <div
                        key={workflow.id}
                        className="border rounded-lg p-4 hover:bg-accent/50 transition-colors"
                        data-testid={`workflow-${workflow.id}`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-semibold">{workflow.name}</h3>
                              <Badge variant={workflow.status === "active" ? "default" : "secondary"}>
                                {workflow.status}
                              </Badge>
                              <Badge variant="outline">{workflow.triggerType}</Badge>
                            </div>
                            <p className="text-sm text-muted-foreground mb-2">
                              {workflow.description}
                            </p>
                            <div className="text-xs text-muted-foreground">
                              Executed {workflow.executionCount} times
                              {workflow.lastExecutedAt && (
                                <> • Last: {new Date(workflow.lastExecutedAt).toLocaleString()}</>
                              )}
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => executeWorkflowMutation.mutate({ id: workflow.id })}
                              disabled={workflow.status !== "active"}
                              data-testid={`button-execute-${workflow.id}`}
                            >
                              <Play className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() =>
                                toggleWorkflowMutation.mutate({
                                  id: workflow.id,
                                  status: workflow.status === "active" ? "paused" : "active",
                                })
                              }
                              data-testid={`button-toggle-${workflow.id}`}
                            >
                              {workflow.status === "active" ? (
                                <Pause className="h-4 w-4" />
                              ) : (
                                <Play className="h-4 w-4" />
                              )}
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => deleteWorkflowMutation.mutate(workflow.id)}
                              data-testid={`button-delete-${workflow.id}`}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="templates" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Workflow Templates</CardTitle>
                <CardDescription>
                  Pre-built automation workflows ready to use
                </CardDescription>
              </CardHeader>
              <CardContent>
                {templatesLoading ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin" />
                  </div>
                ) : (
                  <div className="grid gap-4 md:grid-cols-2">
                    {templates?.map((item: any) => (
                      <Card key={item.name} data-testid={`template-${item.name}`}>
                        <CardHeader>
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <CardTitle className="text-lg">
                                {item.template.name}
                              </CardTitle>
                              <CardDescription className="mt-1">
                                {item.template.description}
                              </CardDescription>
                            </div>
                            <Button
                              size="sm"
                              onClick={() => createFromTemplateMutation.mutate(item.name)}
                              data-testid={`button-create-${item.name}`}
                            >
                              <Plus className="h-4 w-4 mr-1" />
                              Create
                            </Button>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="flex gap-2">
                            <Badge variant="outline">{item.template.triggerType}</Badge>
                            <Badge variant="secondary">
                              {(item.template.actions as any[]).length} action(s)
                            </Badge>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="campaigns" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Campaign Lists</CardTitle>
                    <CardDescription>
                      Your Zoho Campaigns mailing lists
                    </CardDescription>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => queryClient.invalidateQueries({ queryKey: ["/api/campaigns/lists"] })}
                    data-testid="button-refresh-lists"
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Refresh
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {listsLoading ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin" />
                  </div>
                ) : campaignLists?.list_of_details?.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No campaign lists found. Create one in Zoho Campaigns first.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {campaignLists?.list_of_details?.map((list: any) => (
                      <div
                        key={list.listkey}
                        className="border rounded-lg p-4"
                        data-testid={`list-${list.listkey}`}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-semibold">{list.listname}</h3>
                            <p className="text-sm text-muted-foreground">
                              {list.subscriber_count} subscribers • Key: {list.listkey}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="crm-views" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  January Filtered Views
                </CardTitle>
                <CardDescription>
                  Create custom list views in the Zoho CRM Leads module filtered by registration date.
                  This will create two public views — one for January 2025 and one for January 2026 —
                  sorted by creation date (newest first).
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="rounded-md border p-4 space-y-2 text-sm">
                  <p className="font-medium text-foreground">Views to be created:</p>
                  <div className="space-y-1 text-muted-foreground">
                    <p>• <span className="font-mono text-foreground">January 2025 – New Registrations</span> — Created_Time between Jan 1 and Jan 31, 2025</p>
                    <p>• <span className="font-mono text-foreground">January 2026 – New Registrations</span> — Created_Time between Jan 1 and Jan 31, 2026</p>
                  </div>
                  <p className="text-xs text-muted-foreground pt-1">
                    Fields shown: Last Name, First Name, Email, Created Time, CAS Member, CANN Member, Record Type, Lead Source
                  </p>
                </div>

                <Button
                  onClick={() => createJanuaryViewsMutation.mutate()}
                  disabled={createJanuaryViewsMutation.isPending}
                  data-testid="button-create-january-views"
                >
                  {createJanuaryViewsMutation.isPending ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Creating views…
                    </>
                  ) : (
                    <>
                      <Calendar className="h-4 w-4 mr-2" />
                      Create January Views in Zoho CRM
                    </>
                  )}
                </Button>

                {januaryViewResult && (
                  <div className="space-y-3">
                    {januaryViewResult.created.length > 0 && (
                      <Alert className="border-green-500">
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                        <AlertTitle className="text-green-700">Created successfully</AlertTitle>
                        <AlertDescription>
                          <ul className="mt-1 space-y-1">
                            {januaryViewResult.created.map((name) => (
                              <li key={name} className="text-sm">✅ {name}</li>
                            ))}
                          </ul>
                        </AlertDescription>
                      </Alert>
                    )}
                    {januaryViewResult.failed.length > 0 && (
                      <Alert variant="destructive">
                        <XCircle className="h-4 w-4" />
                        <AlertTitle>Failed to create</AlertTitle>
                        <AlertDescription>
                          <ul className="mt-1 space-y-1">
                            {januaryViewResult.failed.map((f) => (
                              <li key={f.name} className="text-sm">❌ {f.name}: {f.error}</li>
                            ))}
                          </ul>
                        </AlertDescription>
                      </Alert>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
