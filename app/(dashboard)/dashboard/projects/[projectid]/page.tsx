'use client';

import { useMemo } from "react";
import { useParams } from "next/navigation";
import { Loader2, CalendarClock, Users, ListChecks, ShieldCheck, Sparkles, CheckCircle2, Clock4, Inbox, ShieldAlert } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import CreateTask from "@/components/layout/Tasks/Createtask";
import { useWorkspaceStore } from "@/store/userDataStore";
import { useFetchProjectDetailsQuery } from "@/utils/queries/project.queries";
import { workspaceAccessRole } from "@/utils/rbac";
import { PROJECT_COLORS, ProjectMembers } from "@/utils/interfaces/responses/project.response";
import { taksViewData } from "@/utils/interfaces/responses/task.response";

type TaskStatusKey = taksViewData["status"];
type TaskPriorityKey = taksViewData["priority"];

const statusBadges: Record<TaskStatusKey, string> = {
    TODO: "border-slate-200 bg-white text-slate-600",
    IN_PROGRESS: "border-blue-200 bg-blue-50 text-blue-700",
    DONE: "border-emerald-200 bg-emerald-50 text-emerald-700",
};

const priorityBadges: Record<TaskPriorityKey, string> = {
    URGENT: "border-rose-200 bg-rose-50 text-rose-700",
    HIGH: "border-amber-200 bg-amber-50 text-amber-700",
    LOW: "border-slate-200 bg-slate-50 text-slate-600",
};

const statusCopy: Record<TaskStatusKey, string> = {
    TODO: "To do",
    IN_PROGRESS: "In progress",
    DONE: "Completed",
};

const priorityCopy: Record<TaskPriorityKey, string> = {
    URGENT: "Urgent",
    HIGH: "High",
    LOW: "Low",
};

const getInitials = (name?: string) => {
    if (!name) {
        return "WR";
    }
    return name
        .split(" ")
        .map((segment) => segment[0])
        .join("")
        .slice(0, 2)
        .toUpperCase();
};

const formatDate = (value?: string) => {
    if (!value) {
        return "—";
    }
    try {
        return new Intl.DateTimeFormat("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
        }).format(new Date(value));
    } catch (_error) {
        return value;
    }
};

const MemberRow = ({ member, featured }: { member: ProjectMembers; featured?: boolean }) => {
    return (
        <div className={`flex items-center justify-between gap-4 rounded-2xl border px-4 py-3 ${featured ? "border-slate-900/15 bg-slate-900/5" : "border-border/70 bg-muted/30"}`}>
            <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                    <AvatarImage src={member.avatarUrl} />
                    <AvatarFallback className="text-xs uppercase">
                        {getInitials(member.name)}
                    </AvatarFallback>
                </Avatar>
                <div>
                    <p className="text-sm font-medium text-foreground">{member.name}</p>
                    <p className="text-xs text-muted-foreground">{member.email}</p>
                </div>
            </div>
            <Badge variant="outline" className="capitalize">
                {member.role.toLowerCase()}
            </Badge>
        </div>
    );
};

const Page = () => {
    const params = useParams<{ projectid: string }>();
    const projectId = params?.projectid ?? "";
    const { currentWorkspace, userStoreData } = useWorkspaceStore();
    const workspaceId = currentWorkspace?.workspaceId ?? "";

    const { data, isLoading } = useFetchProjectDetailsQuery(workspaceId, projectId);
    const projectDetails = data?.projectsDetails;
    const rawTaskData = projectDetails?.taskData;

    const tasks = useMemo<taksViewData[]>(() => {
        if (!rawTaskData) {
            return [];
        }
        return Array.isArray(rawTaskData) ? rawTaskData : [rawTaskData];
    }, [rawTaskData]);

    const statusBreakdown = useMemo<Record<TaskStatusKey, number>>(() => {
        const snapshot: Record<TaskStatusKey, number> = { TODO: 0, IN_PROGRESS: 0, DONE: 0 };
        tasks.forEach((task) => {
            snapshot[task.status] += 1;
        });
        return snapshot;
    }, [tasks]);

    if (!currentWorkspace || !userStoreData) {
        return null;
    }

    if (isLoading) {
        return (
            <div className="flex min-h-[50vh] items-center justify-center">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
        );
    }

    if (!projectDetails) {
        return (
            <div className="flex min-h-[50vh] flex-col items-center justify-center gap-3 text-center">
                <ShieldAlert className="h-8 w-8 text-muted-foreground" />
                <div>
                    <p className="text-base font-semibold">Project unavailable</p>
                    <p className="text-sm text-muted-foreground">We could not find any information for this project.</p>
                </div>
            </div>
        );
    }
    const accentColor = PROJECT_COLORS[projectDetails.color] ?? "#0ea5e9";
    const owner = projectDetails.projectMembers.find((member) => member.role === "OWNER");
    const maintainers = projectDetails.projectMembers.filter((member) => member.role === "MAINTAINER");
    const collaborators = projectDetails.projectMembers.filter((member) => member.role === "MEMBER");

    const progress = projectDetails.taskCount > 0 ? Math.round((projectDetails.completedTaskCount / projectDetails.taskCount) * 100) : 0;
    const openTasks = Math.max(projectDetails.taskCount - projectDetails.completedTaskCount, 0);

    const isMaintainer = projectDetails.projectMembers.some(
        (member) => member.role === "MAINTAINER" && member.email === userStoreData.userData.email 
    );

    const canCreateTask = isMaintainer || workspaceAccessRole("ADMIN", currentWorkspace.role);

    const insightTiles = [
        { label: "Open tasks", value: openTasks, icon: Clock4 },
        { label: "Completed", value: projectDetails.completedTaskCount, icon: CheckCircle2 },
        { label: "Collaborators", value: projectDetails.projectMemberCount, icon: Users },
    ];

    return (
        <div className="space-y-10">
            <section className="relative overflow-hidden rounded-3xl border border-border/60 bg-slate-950 text-white shadow-2xl">
                <div
                    className="absolute inset-0 opacity-90"
                    style={{
                        backgroundImage: `radial-gradient(circle at 20% 20%, ${accentColor}55, transparent 60%), radial-gradient(circle at 80% 0%, rgba(255,255,255,0.2), transparent 55%)`,
                    }}
                />
                <div className="relative z-10 flex flex-col gap-8 p-8">
                    <div className="flex flex-wrap items-center gap-3 text-xs uppercase tracking-[0.3em] text-white/70">
                        <Badge variant="outline" className="border-white/30 bg-white/10 text-white/90">
                            {currentWorkspace.workspaceName}
                        </Badge>
                        <Badge variant="outline" className="border-white/20 bg-transparent text-white/80">
                            #{projectId}
                        </Badge>
                        <Badge variant="outline" className="border-white/20 bg-transparent text-white/80">
                            {currentWorkspace.role.toLowerCase()} access
                        </Badge>
                    </div>
                    <div className="flex flex-wrap gap-8">
                        <div className="flex-1 space-y-4">
                            <div className="space-y-2">
                                <p className="text-xs font-semibold text-white/70">Project</p>
                                <h1 className="text-4xl font-semibold leading-tight">{projectDetails.name}</h1>
                                <p className="text-base text-white/80">
                                    {projectDetails.description || "This project does not have a description yet."}
                                </p>
                            </div>
                            <div className="flex flex-wrap gap-3">
                                <Badge
                                    className={`border-transparent px-3 py-1 text-xs font-semibold uppercase tracking-wide ${
                                        projectDetails.status === "ACTIVE" ? "bg-emerald-500/20 text-emerald-200" : "bg-slate-300/30 text-slate-50"
                                    }`}
                                >
                                    {projectDetails.status === "ACTIVE" ? "Active" : "Completed"}
                                </Badge>
                                <Badge className="border-white/20 bg-white/10 text-white/80">
                                    Created {formatDate(projectDetails.createdAt)}
                                </Badge>
                            </div>
                        </div>
                        <div className="flex min-w-[220px] flex-col items-end justify-between gap-4">
                            <div className="text-right">
                                <p className="text-sm text-white/70">Completion rate</p>
                                <p className="text-5xl font-semibold">{progress}%</p>
                            </div>
                            {canCreateTask && (
                                <CreateTask
                                    className="bg-white text-slate-900 hover:bg-white/90"
                                    workspaceId={workspaceId}
                                    projectId={projectId}
                                />
                            )}
                        </div>
                    </div>
                    <div className="grid gap-4 sm:grid-cols-3">
                        {insightTiles.map(({ label, value, icon: Icon }) => (
                            <div key={label} className="rounded-2xl border border-white/15 bg-white/5 p-4">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10">
                                        <Icon className="h-5 w-5 text-white" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-white/70">{label}</p>
                                        <p className="text-2xl font-semibold">{value}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
                <Card className="h-full">
                    <CardHeader>
                        <div className="flex items-start justify-between">
                            <div>
                                <CardTitle className="text-xl">Project health</CardTitle>
                                <CardDescription>Snapshot of delivery pace and workload.</CardDescription>
                            </div>
                            <Badge variant="outline" className="gap-1">
                                <CalendarClock className="h-3.5 w-3.5" />
                                Updated {formatDate(projectDetails.createdAt)}
                            </Badge>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div>
                            <div className="mb-2 flex items-center justify-between text-sm font-medium">
                                <span>Overall progress</span>
                                <span>{progress}%</span>
                            </div>
                            <Progress value={progress} className="h-2" />
                        </div>
                        <div className="grid gap-4 sm:grid-cols-3">
                            {insightTiles.map(({ label, value, icon: Icon }) => (
                                <div key={label} className="rounded-2xl border border-border/60 bg-muted/30 p-4">
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-background">
                                            <Icon className="h-4 w-4 text-muted-foreground" />
                                        </div>
                                        <div>
                                            <p className="text-xs uppercase tracking-wide text-muted-foreground">{label}</p>
                                            <p className="text-xl font-semibold text-foreground">{value}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="rounded-2xl border border-border/70 bg-background/60 p-4">
                            <p className="text-xs uppercase tracking-wide text-muted-foreground">Status breakdown</p>
                            <div className="mt-4 grid gap-4 sm:grid-cols-3">
                                {(Object.keys(statusBreakdown) as TaskStatusKey[]).map((statusKey) => (
                                    <div key={statusKey} className="rounded-xl border border-border/60 bg-card/80 p-3">
                                        <p className="text-lg font-semibold">{statusBreakdown[statusKey]}</p>
                                        <p className="text-xs text-muted-foreground">{statusCopy[statusKey]}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="h-full">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-lg">
                            <ShieldCheck className="h-4 w-4 text-emerald-500" /> Team
                        </CardTitle>
                        <CardDescription>Ownership and collaborators for this project.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {owner ? (
                            <MemberRow key={owner.id} member={owner} featured />
                        ) : (
                            <div className="rounded-2xl border border-dashed border-border/60 bg-muted/20 p-4 text-sm text-muted-foreground">
                                No owner assigned yet.
                            </div>
                        )}
                        {maintainers.length > 0 && (
                            <div className="space-y-2">
                                <p className="text-xs uppercase tracking-wide text-muted-foreground">Maintainers</p>
                                {maintainers.map((member) => (
                                    <MemberRow key={member.id} member={member} />
                                ))}
                            </div>
                        )}
                        {collaborators.length > 0 && (
                            <div className="space-y-2">
                                <p className="text-xs uppercase tracking-wide text-muted-foreground">Members</p>
                                {collaborators.map((member) => (
                                    <MemberRow key={member.id} member={member} />
                                ))}
                            </div>
                        )}
                        {maintainers.length === 0 && collaborators.length === 0 && (
                            <div className="rounded-2xl border border-dashed border-border/60 bg-muted/20 p-4 text-sm text-muted-foreground">
                                Invite collaborators to start building momentum.
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <div className="flex items-center gap-2">
                        <Sparkles className="h-4 w-4 text-primary" />
                        <CardTitle className="text-lg">Task timeline</CardTitle>
                    </div>
                    <CardDescription>Stories and tasks currently linked to this project.</CardDescription>
                </CardHeader>
                <CardContent>
                    {tasks.length === 0 ? (
                        <div className="flex flex-col items-center gap-3 rounded-3xl border border-dashed border-border/60 bg-muted/20 p-10 text-center">
                            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-background">
                                <Inbox className="h-6 w-6 text-muted-foreground" />
                            </div>
                            <div className="space-y-2">
                                <p className="text-base font-semibold">No tasks yet</p>
                                <p className="text-sm text-muted-foreground">
                                    When tasks are created for this project, they will appear here.
                                </p>
                            </div>
                            {canCreateTask && <CreateTask workspaceId={workspaceId} projectId={projectId} />}
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {tasks.map((task) => (
                                <div key={task.id} className="rounded-2xl border border-border/70 bg-card/80 p-5 shadow-sm">
                                    <div className="flex flex-wrap items-start gap-4">
                                        <div className="flex-1 space-y-1">
                                            <p className="text-base font-semibold text-foreground">{task.title}</p>
                                            <p className="text-sm text-muted-foreground">
                                                {task.description || "No description provided."}
                                            </p>
                                        </div>
                                        <div className="text-right text-xs text-muted-foreground">
                                            <p>Priority</p>
                                            <p className="text-base font-semibold text-foreground">{priorityCopy[task.priority]}</p>
                                        </div>
                                    </div>
                                    <div className="mt-4 flex flex-wrap gap-3">
                                        <Badge className={priorityBadges[task.priority]}>{priorityCopy[task.priority]}</Badge>
                                        <Badge variant="outline" className={statusBadges[task.status]}>
                                            {statusCopy[task.status]}
                                        </Badge>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default Page;
