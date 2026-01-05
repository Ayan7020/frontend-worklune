import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal, Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ProjectData as Project, PROJECT_COLORS } from '@/utils/interfaces/responses/project.response';
import { AvatarImage } from '@radix-ui/react-avatar';
import { userRole } from '@/utils/interfaces/responses/user.response';
import { workspaceAccessRole } from '@/utils/rbac';

type ProjectStatus = 'completed' | 'on_track' | 'at_risk';

interface ProjectListItemProps {
    project: Project;
    UserRole: userRole;
    //   onEdit?: () => void;
    //   onDelete?: () => void;
}

function getProjectStatus(project: Project): ProjectStatus {
    if (project.taskCount > 0 && project.completedTaskCount === project.taskCount) {
        return 'completed';
    }
    const progress = project.taskCount > 0 ? project.completedTaskCount / project.taskCount : 0;
    return progress >= 0.5 ? 'on_track' : 'at_risk';
}

function getStatusBadge(status: ProjectStatus) {
    switch (status) {
        case 'completed':
            return { label: 'Completed', className: 'bg-success/10 text-success border-success/20' };
        case 'on_track':
            return { label: 'On Track', className: 'bg-primary/10 text-primary border-primary/20' };
        case 'at_risk':
            return { label: 'At Risk', className: 'bg-warning/10 text-warning border-warning/20' };
    }
}

function getInitials(name: string) {
    return name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
}

export function ProjectListItem({ project, UserRole }: ProjectListItemProps) {
    const progress = project.taskCount > 0
        ? Math.round((project.completedTaskCount / project.taskCount) * 100)
        : 0;

    const status = getProjectStatus(project);
    const statusBadge = getStatusBadge(status);
    const displayMembers = project.projectMembers.slice(0,2);
    const remainingCount = project.projectMemberCount - 2;

    return (
        <div className="flex items-center gap-4 p-4 bg-card border border-border rounded-lg hover:border-primary/50 transition-all group">
            {/* Project Color & Name */}
            <div
                className="h-10 w-10 rounded-lg flex-shrink-0 flex items-center justify-center text-primary-foreground font-semibold text-sm"
                style={{ backgroundColor: PROJECT_COLORS[project.color] }}
            >
                {project.name.charAt(0).toUpperCase()}
            </div>

            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                    <h3 className="font-medium text-foreground truncate group-hover:text-primary transition-colors">
                        {project.name}
                    </h3>
                    <Badge variant="outline" className={cn('text-xs flex-shrink-0', statusBadge.className)}>
                        {statusBadge.label}
                    </Badge>
                </div>
                <p className="text-sm text-muted-foreground truncate">
                    {project.description}
                </p>
            </div>

            {/* Progress */}
            <div className="hidden md:flex flex-col gap-1 w-32">
                <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Progress</span>
                    <span className="text-foreground font-medium">{progress}%</span>
                </div>
                <Progress value={progress} className="h-1.5" />
            </div>

            {/* Tasks */}
            <div className="hidden lg:block text-sm text-muted-foreground w-24 text-center">
                {project.completedTaskCount}/{project.taskCount} tasks
            </div>

            {/* Members */}
            <div className="hidden sm:flex -space-x-2 w-24 justify-center">
                {displayMembers.map((member,idx) => (
                    <Avatar key={idx} className="h-7 w-7 border-2 border-background">
                        <AvatarImage src={member.avatarUrl} />
                        <AvatarFallback className="text-xs bg-muted text-muted-foreground">
                            {getInitials(member.name)}
                        </AvatarFallback>
                    </Avatar>
                ))}
                {remainingCount > 0 && (
                    <div className="h-7 w-7 rounded-full bg-muted border-2 border-background flex items-center justify-center">
                        <span className="text-xs text-muted-foreground">+{remainingCount}</span>
                    </div>
                )}
            </div>

            {/* Date */}
            <div className="hidden xl:flex items-center gap-1 text-xs text-muted-foreground w-28">
                <Calendar className="h-3.5 w-3.5" />
                <span>{new Date(project.createdAt).toLocaleDateString()}</span>
            </div>

            {/* Actions */}
            {workspaceAccessRole("ADMIN",UserRole) && (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity">
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="bg-popover border-border">
                        <DropdownMenuItem >Edit</DropdownMenuItem>
                        <DropdownMenuItem   className="text-destructive">
                            Delete
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            )}
        </div>
    );
}
