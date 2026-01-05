'use client';

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Loader2, MessageSquare, ShieldAlert, Users, FlagTriangleRight } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useWorkspaceStore } from "@/store/userDataStore";
import { useFetchTasksDetailsQuery } from "@/utils/queries/task.queries";
import { GenericUserResponse, taskDescussionsData, taksViewDataV2 } from "@/utils/interfaces/responses/task.response";
import { getSocket } from "@/lib/socket"; 
import { statusBadgeStyles } from "@/components/layout/common";


type TaskStatusKey = taksViewDataV2["status"];
type TaskPriorityKey = taksViewDataV2["priority"];

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

const priorityStyles: Record<TaskPriorityKey, string> = {
    URGENT: "border-orange-300 bg-orange-50 text-orange-700",
    HIGH: "border-orange-200 bg-orange-50 text-orange-600",
    LOW: "border-slate-200 bg-white text-slate-600",
};


const getInitials = (value?: string) => {
    if (!value) {
        return "WR";
    }
    return value
        .split(" ")
        .map((segment) => segment[0])
        .join("")
        .slice(0, 2)
        .toUpperCase();
};

const formatDate = (value?: string) => {
    if (!value) {
        return "Just now";
    }
    try {
        return new Intl.DateTimeFormat("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
            hour: "numeric",
            minute: "numeric",
        }).format(new Date(value));
    } catch (_error) {
        return value;
    }
};

const PersonSummary = ({ label, user }: { label: string; user?: GenericUserResponse }) => (
    <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3">
        <Avatar className="h-10 w-10">
            {user?.avatarUrl && <AvatarImage src={user.avatarUrl} alt={user.name} />}
            <AvatarFallback className="text-xs uppercase">
                {getInitials(user?.name)}
            </AvatarFallback>
        </Avatar>
        <div>
            <p className="text-xs uppercase tracking-wide text-slate-500">{label}</p>
            <p className="text-sm font-semibold text-slate-900">{user?.name ?? "Not assigned"}</p>
            <p className="text-xs text-slate-500">{user?.email ?? "We will pick someone soon."}</p>
        </div>
    </div>
);

const DiscussionItem = ({ entry }: { entry: taskDescussionsData }) => (
    <div className="flex gap-4 rounded-2xl border border-slate-200 bg-white p-4">
        <Avatar className="h-11 w-11">
            {entry.user.avatarUrl && <AvatarImage src={entry.user.avatarUrl} alt={entry.user.name} />}
            <AvatarFallback className="text-xs uppercase">
                {getInitials(entry.user.name)}
            </AvatarFallback>
        </Avatar>
        <div className="flex-1">
            <div className="flex flex-wrap items-center gap-2 text-sm">
                <span className="font-semibold text-slate-900">{entry.user.name}</span>
                <span className="text-slate-500">{formatDate(entry.createdAt)}</span>
            </div>
            <p className="mt-1 text-sm text-slate-600">{entry.content}</p>
        </div>
    </div>
);

const Page = () => {
    const params = useParams<{ projectid: string; taskid: string }>();
    const projectId = params?.projectid ?? "";
    const taskId = params?.taskid ?? "";
    const { currentWorkspace, userStoreData } = useWorkspaceStore();
    if(!userStoreData) {
        return null;
    }
    const workspaceId = currentWorkspace?.workspaceId ?? "";
    const [draftComment, setDraftComment] = useState("");
    const [discussionEntries, setDiscussionEntries] = useState<taskDescussionsData[]>([]);
    // const token = createToken(userStoreData.userData.id)
    const socket = getSocket(userStoreData.userData.id);
    
    useEffect(() => {  
        socket.emit("task:join", { taskId });

        const onNewComment = (comment: taskDescussionsData) => { 
            setDiscussionEntries((prev) => { 
                const alreadyExists = prev.some((entry) => entry.id === comment.id);
                if (alreadyExists) return prev;

                const next = [...prev, comment];
                next.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
                return next;
            });

        };
        socket.on("task:comment:new", onNewComment);

        return () => {
            socket.emit("task:leave", { taskId });
            socket.off("task:comment:new", onNewComment);
        }
    }, [taskId]) 

    if (!currentWorkspace) {
        return null;
    }

    const { data, isLoading } = useFetchTasksDetailsQuery(workspaceId, projectId, taskId);
    const taskDetails = data?.taskDetails;

    useEffect(() => {
        setDiscussionEntries(taskDetails?.taskDescussions ?? []);
    }, [taskDetails]);

    const handleComment = () => {
        socket.emit("task:comment:create", {
            taskId,
            content: draftComment,
        });
        setDraftComment("")
    }
    if (isLoading) {
        return (
            <div className="flex min-h-[50vh] items-center justify-center">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
        );
    }

    if (!taskDetails) {
        return (
            <div className="flex min-h-[50vh] flex-col items-center justify-center gap-3 text-center">
                <ShieldAlert className="h-8 w-8 text-muted-foreground" />
                <div>
                    <p className="text-base font-semibold">Task unavailable</p>
                    <p className="text-sm text-muted-foreground">We could not find any information for this task.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
                <div className="flex flex-wrap items-center gap-3 text-xs font-semibold uppercase tracking-widest text-slate-500">
                    <Badge variant="outline" className="border-orange-200 bg-orange-50 text-orange-600">
                        {currentWorkspace.workspaceName}
                    </Badge>
                    <span className="text-slate-400">/</span>
                    <span className="text-orange-600">Tasks</span>
                </div>
                <div className="mt-6 flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                    <div className="space-y-3">
                        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Task</p>
                        <h1 className="text-4xl font-semibold text-slate-900">{taskDetails.title}</h1>
                        {taskDetails.description && (
                            <p className="text-base text-slate-600">{taskDetails.description}</p>
                        )}
                    </div>
                    <div className="flex flex-wrap gap-3">
                        <Badge className={`${priorityStyles[taskDetails.priority]} text-xs`}>{priorityCopy[taskDetails.priority]}</Badge>
                        <Badge variant="outline" className={`${statusBadgeStyles[taskDetails.status]} text-xs`}>
                            {statusCopy[taskDetails.status]}
                        </Badge>
                        {taskDetails.tag && (
                            <Badge variant="outline" className="border-orange-200 bg-orange-50 text-orange-600 text-xs">
                                #{taskDetails.tag}
                            </Badge>
                        )}
                    </div>
                </div>
            </section>

            <div className="grid gap-6 lg:grid-cols-[1.7fr_1fr]">
                <Card className="border border-slate-200 bg-white">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-lg">
                            <FlagTriangleRight className="h-4 w-4 text-orange-500" /> Task summary
                        </CardTitle>
                        <CardDescription>Quick context for collaborators.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="rounded-2xl border border-slate-200 bg-orange-50/50 p-4">
                            <p className="text-xs uppercase tracking-wide text-muted-foreground">What we are shipping</p>
                            <p className="mt-2 text-sm text-muted-foreground">
                                {taskDetails.description || "No description provided yet."}
                            </p>
                        </div>
                        <div className="grid gap-4 sm:grid-cols-2">
                            <div className="rounded-2xl border border-slate-200 bg-white p-4">
                                <p className="text-xs text-slate-500">Priority</p>
                                <p className="mt-1 text-lg font-semibold text-slate-900">{priorityCopy[taskDetails.priority]}</p>
                            </div>
                            <div className="rounded-2xl border border-slate-200 bg-white p-4">
                                <p className="text-xs text-slate-500">Status</p>
                                <p className="mt-1 text-lg font-semibold text-slate-900">{statusCopy[taskDetails.status]}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border border-slate-200 bg-white">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-lg">
                            <Users className="h-4 w-4 text-orange-500" /> People
                        </CardTitle>
                        <CardDescription>Ownership for this task.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <PersonSummary label="Assigned to" user={taskDetails.assignuser} />
                        <PersonSummary label="Created by" user={taskDetails.user} />
                    </CardContent>
                </Card>
            </div>

            <Card className="border border-slate-200 bg-white">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                        <MessageSquare className="h-4 w-4 text-orange-500" /> Discussion
                    </CardTitle>
                    <CardDescription>Share updates and decisions with your team.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-5">
                    {discussionEntries.length === 0 ? (
                        <div className="flex flex-col items-center gap-3 rounded-3xl border border-dashed border-slate-200 bg-orange-50/40 p-8 text-center">
                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white">
                                <MessageSquare className="h-5 w-5 text-muted-foreground" />
                            </div>
                            <div>
                                <p className="text-base font-semibold">No comments yet</p>
                                <p className="text-sm text-muted-foreground">Start the conversation to keep everyone aligned.</p>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {discussionEntries.map((entry) => (
                                <DiscussionItem key={entry.id} entry={entry} />
                            ))}
                        </div>
                    )}

                    <form
                        className="rounded-3xl border border-dashed border-slate-200 bg-white p-4"
                        onSubmit={(event) => event.preventDefault()}
                    >
                        <div className="flex gap-3">
                            <Avatar className="h-10 w-10">
                                {userStoreData?.userData.avatarUrl && (
                                    <AvatarImage src={userStoreData.userData.avatarUrl} alt={userStoreData.userData.name} />
                                )}
                                <AvatarFallback className="text-xs uppercase">
                                    {getInitials(userStoreData?.userData.name)}
                                </AvatarFallback>
                            </Avatar>
                            <Textarea
                                placeholder="Leave a note for the team..."
                                value={draftComment}
                                onChange={(event) => setDraftComment(event.target.value)}
                                className="min-h-[120px] flex-1"
                            />
                        </div>
                        <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
                            <span>Commenting will be wired up soon.</span>
                            <Button
                                disabled={!draftComment}
                                onClick={handleComment}
                                type="button"
                                className=" text-white "
                            >
                                Share update
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};

export default Page;