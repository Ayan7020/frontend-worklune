import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { PROJECT_COLORS, ProjectData } from "@/utils/interfaces/responses/project.response"
import { Users, Crown, ListChecks, Inbox, MoreHorizontal, ArrowUpRight, ArrowDownRight, Trash2 } from "lucide-react"
import { useWorkspaceStore } from "@/store/userDataStore"
import { projectService } from "@/services/project.service"
import { ApiException } from "@/lib/http/errors"
import { toast } from "sonner"
import { useQueryClient } from "@tanstack/react-query"
import { workspaceAccessRole } from "@/utils/rbac"

interface TaskViewProps {
    project: ProjectData
}

const TaskView = ({ project }: TaskViewProps) => {
    const owner = project.projectMembers.find((member) => member.role === "OWNER")
    const collaborators = project.projectMembers.filter((member) => member.role !== "OWNER")
    const accent = PROJECT_COLORS[project.color]
    const hasTasks = project.taskCount > 0
    const { currentWorkspace, userStoreData } = useWorkspaceStore();
    if (!currentWorkspace) {
        return null;
    }
    const queryClient = useQueryClient()
    const [pendingMember, setPendingMember] = useState<string | null>(null)

    const invalidateProjects = async () => {
        if (!currentWorkspace?.workspaceId) {
            return
        }
        await queryClient.invalidateQueries({ queryKey: ["getProjects", currentWorkspace.workspaceId] })
    }

    const isProjectOwner = owner?.email === userStoreData?.userData.email;

    const handleRoleChange = async (memberId: string, role: "MAINTAINER" | "MEMBER") => {
        if (pendingMember && pendingMember !== memberId) {
            return
        }
        if (!currentWorkspace?.workspaceId) {
            return
        }
        try {
            setPendingMember(memberId)
            await projectService.updateMemberRole(currentWorkspace.workspaceId, {
                member_id: memberId,
                project_id: project.id,
                role,
            })
            toast.success(role === "MAINTAINER" ? "Promoted to maintainer" : "Demoted to member")
            await invalidateProjects()
        } catch (error) {
            if (error instanceof ApiException) {
                toast.error(error.message)
            } else {
                toast.error("Unable to update member role")
            }
        } finally {
            setPendingMember(null)
        }
    }

    const handleRemove = async (memberId: string) => {
        if (pendingMember && pendingMember !== memberId) {
            return
        }
        if (!currentWorkspace?.workspaceId) {
            return
        }
        try {
            setPendingMember(memberId)
            await projectService.removeMember(currentWorkspace.workspaceId, {
                member_id: memberId,
                project_id: project.id,
            })
            toast.success("Removed from project")
            await invalidateProjects()
        } catch (error) {
            if (error instanceof ApiException) {
                toast.error(error.message)
            } else {
                toast.error("Unable to remove member")
            }
        } finally {
            setPendingMember(null)
        }
    }

    return (
        <div className="flex h-full flex-col gap-6">
            <header className="flex items-start gap-4 border-b border-border pb-6">
                <div
                    className="flex h-12 w-12 items-center justify-center rounded-xl text-lg font-semibold text-primary-foreground"
                    style={{ backgroundColor: accent }}
                >
                    {project.name.charAt(0).toUpperCase()}
                </div>
                <div className="space-y-2">
                    <div className="space-y-1">
                        <h2 className="text-xl font-semibold text-foreground">{project.name}</h2>
                        <p className="text-sm text-muted-foreground">
                            {project.description || "This project does not have a description yet."}
                        </p>
                    </div>
                    <Badge variant="outline" className="text-xs">
                        Created {new Date(project.createdAt).toLocaleDateString()}
                    </Badge>
                </div>
            </header>

            <section className="space-y-3">
                <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                    <Users className="h-4 w-4" />
                    Team Members
                </div>
                <div className="space-y-2">
                    {owner ? (
                        <div className="rounded-2xl bg-muted/40 p-4">
                            <div className="flex items-center gap-3">
                                <Avatar className="h-10 w-10">
                                    <AvatarImage src={owner.avatarUrl} />
                                    <AvatarFallback className="bg-muted text-sm text-muted-foreground">
                                        {owner.name
                                            .split(" ")
                                            .map((item) => item[0])
                                            .join("")
                                            .toUpperCase()
                                            .slice(0, 2)}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                                        <Crown className="h-4 w-4 text-primary" />
                                        <span>{owner.name}</span>
                                    </div>
                                    <p className="text-xs text-muted-foreground">{owner.email}</p>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="rounded-2xl border border-dashed border-border/60 bg-muted/20 p-4 text-sm text-muted-foreground">
                            No owner assigned yet.
                        </div>
                    )}
                </div>
            </section>

            <section className="space-y-3">
                <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                    <Users className="h-4 w-4" />
                    Assigned Users ({collaborators.length})
                </div>
                <div className="space-y-2">
                    {collaborators.length > 0 ? (
                        collaborators.map((member) => (
                            <div
                                key={member.id}
                                className="flex items-center justify-between rounded-2xl border border-border/60 bg-background p-4"
                            >
                                <div className="flex items-center gap-3">
                                    <Avatar className="h-9 w-9">
                                        <AvatarImage src={member.avatarUrl} />
                                        <AvatarFallback className="bg-muted text-xs text-muted-foreground">
                                            {member.name
                                                .split(" ")
                                                .map((item) => item[0])
                                                .join("")
                                                .toUpperCase()
                                                .slice(0, 2)}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <p className="text-sm font-medium text-foreground">{member.name}</p>
                                        <p className="text-xs text-muted-foreground">{member.email}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Badge variant="outline" className="text-xs capitalize">
                                        {member.role.toLowerCase()}
                                    </Badge>

                                    {(workspaceAccessRole("OWNER", currentWorkspace.role) || isProjectOwner) && <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8 text-muted-foreground"
                                                disabled={pendingMember === member.id}
                                            >
                                                <MoreHorizontal className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end" className="w-48">
                                            {member.role === "MEMBER" ? (
                                                <DropdownMenuItem
                                                    onSelect={(event) => {
                                                        event.preventDefault()
                                                        if (pendingMember) return
                                                        void handleRoleChange(member.id, "MAINTAINER")
                                                    }}
                                                    disabled={pendingMember === member.id}
                                                >
                                                    <ArrowUpRight className="mr-2 h-4 w-4" /> Promote to maintainer
                                                </DropdownMenuItem>
                                            ) : (
                                                <DropdownMenuItem
                                                    onSelect={(event) => {
                                                        event.preventDefault()
                                                        if (pendingMember) return
                                                        void handleRoleChange(member.id, "MEMBER")
                                                    }}
                                                    disabled={pendingMember === member.id}
                                                >
                                                    <ArrowDownRight className="mr-2 h-4 w-4" /> Demote to member
                                                </DropdownMenuItem>
                                            )}
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem
                                                className="text-destructive"
                                                onSelect={(event) => {
                                                    event.preventDefault()
                                                    if (pendingMember) return
                                                    void handleRemove(member.id)
                                                }}
                                                disabled={pendingMember === member.id}
                                            >
                                                <Trash2 className="mr-2 h-4 w-4" /> Remove from project
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>}
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="rounded-2xl border border-dashed border-border/60 bg-muted/20 p-4 text-sm text-muted-foreground">
                            No additional collaborators yet.
                        </div>
                    )}
                </div>
            </section>

            <section className="space-y-3">
                <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                    <ListChecks className="h-4 w-4" />
                    Tasks ({project.taskCount})
                </div>
                {hasTasks ? (
                    <div className="space-y-2">
                        {/* Task list will go here once tasks are available */}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-border/60 bg-muted/20 p-8 text-center">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-background">
                            <Inbox className="h-6 w-6 text-muted-foreground" />
                        </div>
                        <div className="space-y-1">
                            <p className="text-sm font-medium text-foreground">No tasks yet</p>
                            <p className="text-xs text-muted-foreground">
                                When tasks are added to this project, they will appear here.
                            </p>
                        </div>
                    </div>
                )}
            </section>
        </div>
    )
}

export default TaskView