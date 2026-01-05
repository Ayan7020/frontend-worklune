"use client"

import { useParams } from "next/navigation"
import { RefreshCw, Shield, Users, MoreVertical, Folder, Logs } from "lucide-react"

import { useWorkspaceMembersQuery } from "@/utils/queries/workspace.queries"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { GetBadge } from "@/components/layout/GetBadge";
import InviteMembers from "@/components/layout/InviteMembers"
import { useWorkspaceStore } from "@/store/userDataStore"

const Page = () => {
    const { currentWorkspace,userStoreData } = useWorkspaceStore();

    if (!currentWorkspace) {
        return
    }
    const { data, isLoading, isError, error, refetch, isFetching } = useWorkspaceMembersQuery(currentWorkspace.workspaceId)

    const members = data?.membersData ?? []

    const errorMessage = error instanceof Error ? error.message : "Unable to load members right now."


    const getRoleBadgeColor = (role: string) => {
        switch (role) {
            case "OWNER":
                return "bg-accent-foreground text-white dark:bg-orange-900 dark:text-orange-200"
            case "ADMIN":
                return "bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200"
            default:
                return "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300"
        }
    }

    const formatDate = (input?: unknown) => {
        if (!input) return "—"
        const value = typeof input === "string" || typeof input === "number" ? new Date(input) : (input as Date)
        const d = new Date(value)
        if (isNaN(d.getTime())) return "—"
        return new Intl.DateTimeFormat(undefined, {
            month: "short",
            day: "numeric",
            year: "numeric",
        }).format(d)
    }   

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-start justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Members</h1>
                    <p className="text-muted-foreground mt-1">Manage workspace members and their roles</p>
                </div>
                {currentWorkspace.role === "OWNER" && <InviteMembers workspaceId={currentWorkspace.workspaceId} />}
            </div>

            {/* Members Card */}
            <Card className="border">
                <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle className="text-lg">Workspace Members</CardTitle>
                            <p className="text-sm text-muted-foreground mt-1">{members.length} members in this workspace</p>
                        </div>
                        <Button variant="ghost" size="sm" onClick={() => refetch()} disabled={isFetching}>
                            <RefreshCw className={`size-4 ${isFetching ? "animate-spin" : ""}`} />
                        </Button>
                    </div>
                </CardHeader>

                <CardContent>
                    {isError && (
                        <div className="rounded-lg border border-destructive/40 bg-destructive/5 p-4 mb-6">
                            <p className="text-sm text-destructive font-medium">Failed to load members</p>
                            <p className="text-xs text-destructive/80 mt-1">{errorMessage}</p>
                        </div>
                    )}

                    {isLoading ? (
                        <div className="space-y-3">
                            {[...Array(3)].map((_, idx) => (
                                <div key={idx} className="h-16 bg-muted rounded animate-pulse" />
                            ))}
                        </div>
                    ) : members.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-12">
                            <Users className="size-12 text-muted-foreground mb-3" />
                            <p className="font-medium">No members yet</p>
                            <p className="text-sm text-muted-foreground">Invite team members to get started</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b">
                                        <th className="text-left py-3 px-3 font-semibold text-sm">Member</th>
                                        <th className="text-left py-3 px-3 font-semibold text-sm">Role</th>
                                        <th className="text-left py-3 px-3 font-semibold text-sm">Tasks</th>
                                        <th className="text-left py-3 px-3 font-semibold text-sm">Projects</th>
                                        <th className="text-left py-3 px-3 font-semibold text-sm">Joined</th>
                                        <th className="text-right py-3 px-3 font-semibold text-sm">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {members.map((member, idx) => (
                                        <tr key={`${member.name}-${idx}`} className="border-b hover:bg-muted/50 transition-colors">
                                            <td className="py-4 px-3">
                                                <div className="flex items-center gap-3">
                                                    <GetBadge avatarUrl={member.avatarUrl}  name={member.name} size={40} />
                                                    <div className="min-w-0">
                                                        <p className="font-medium truncate">{member.name}{member.name === userStoreData?.userData.name ? " (You)":""}</p>
                                                        {member.email && (
                                                            <p className="text-xs text-muted-foreground truncate">{member.email}</p>
                                                        )}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-4 px-3">
                                                <Badge className={`${getRoleBadgeColor(member.role)} font-semibold`}>
                                                    {member.role.charAt(0) + member.role.slice(1).toLowerCase()}
                                                </Badge>
                                            </td>
                                            <td className="py-4 px-3">
                                                <div className="flex items-center gap-1">
                                                    <Logs size={15} />
                                                    <span className="font-medium">{member.taskCount}</span>
                                                </div>
                                            </td>
                                            <td className="py-4 px-3">
                                                <div className="flex items-center gap-1">
                                                    <Folder size={15} />
                                                    <span className="font-medium">{member.projectCount}</span>
                                                </div>
                                            </td>
                                            <td className="py-4 px-3">
                                                <span className="text-sm text-foreground">
                                                    {formatDate((member as any).joinedAt ?? (member as any).joinedat)}
                                                </span>
                                            </td>
                                            <td className="py-4 px-3 text-right">
                                                <Button variant="ghost" size="sm">
                                                    <MoreVertical className="size-4" />
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}

export default Page