import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { MoreHorizontal, Calendar, CheckCircle2, User2 } from 'lucide-react';
import { ProgressRing } from './ProgressRing';
import { ProjectData as Project, PROJECT_COLORS } from '@/utils/interfaces/responses/project.response';

import { cn } from '@/lib/utils';
import { AvatarImage } from '@radix-ui/react-avatar';
import { userRole } from '@/utils/interfaces/responses/user.response';
import { workspaceAccessRole } from '@/utils/rbac';
import { useWorkspaceStore } from '@/store/userDataStore';
import AddMember from './AddMember';
import TransferOwnerShip from './TransferOwnerShip';
import { useMemo } from 'react';
import TaskView from './TaskView';

type ProjectStatus = 'completed' | 'on_track' | 'at_risk';

interface ProjectCardProps {
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
      return { label: 'Completed', variant: 'default' as const, className: 'bg-success/10 text-success border-success/20' };
    case 'on_track':
      return { label: 'On Track', variant: 'outline' as const, className: 'bg-primary/10 text-primary border-primary/20' };
    case 'at_risk':
      return { label: 'At Risk', variant: 'outline' as const, className: 'bg-warning/10 text-warning border-warning/20' };
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
export function ProjectCard({ project, UserRole }: ProjectCardProps) {
  const members = project.projectMembers;
  const { userStoreData,currentWorkspace } = useWorkspaceStore();
  if(!currentWorkspace) {
    return null
  }
  const progress = project.taskCount > 0
    ? Math.round((project.completedTaskCount / project.taskCount) * 100)
    : 0;

  const status = getProjectStatus(project);
  const statusBadge = getStatusBadge(status);
  const displayMembers = members.slice(0, 2);
  const remainingCount = members.length - 2;

  const projectOwner = useMemo(() => {
    return project.projectMembers.find(p => p.role === "OWNER")
  },[project])

  const projectCreator = useMemo(() => {
    return project.projectMembers.find(p => p.name === project.createdBy)
  },[project])

  return (
    <Sheet>
      <Card className="bg-card border-border hover:border-primary/50 transition-all group">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div
                className="h-10 w-10 rounded-lg flex items-center justify-center text-primary-foreground font-semibold text-sm"
                style={{ backgroundColor: PROJECT_COLORS[project.color] }}
              >
                {project.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                  {project.name}
                </h3>
                <Badge variant="outline" className={cn('text-xs', statusBadge.className)}>
                  {statusBadge.label}
                </Badge>
              </div>
            </div>
            {workspaceAccessRole("ADMIN", UserRole) && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-popover border-border">
                  <AddMember project_id={project.id} workspaceId={currentWorkspace?.workspaceId} />
                  {project.projectMembers.find(member => member.email === userStoreData?.userData.email && member.role === "OWNER") && <TransferOwnerShip project_id={project.id} workspaceId={currentWorkspace?.workspaceId} />}
                  {workspaceAccessRole("OWNER", UserRole) && <DropdownMenuItem className="text-destructive">
                    Delete
                  </DropdownMenuItem>}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground line-clamp-2">
          {project.description}
        </p>
        {projectCreator ? (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Avatar className="h-5 w-5">
              <AvatarImage src={projectCreator.avatarUrl} />
              <AvatarFallback className="text-xs bg-muted text-muted-foreground">
                {getInitials(projectCreator.name)}
              </AvatarFallback>
            </Avatar>
            <span>Created by {projectCreator.name}</span>
          </div>
        ) : project.createdBy ? (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <User2 className="h-3.5 w-3.5" />
            <span>Created by</span>
            <span className="text-foreground">{project.createdBy}</span>
          </div>
        ) : null}
        {projectOwner && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Avatar className="h-5 w-5">
              <AvatarImage src={projectOwner.avatarUrl} />
              <AvatarFallback className="text-xs bg-muted text-muted-foreground">
                {getInitials(projectOwner.name)}
              </AvatarFallback>
            </Avatar>
            <span>Owned by {projectOwner.name}</span>
          </div>
        )}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <ProgressRing progress={progress} size={40} strokeWidth={3} />
            <div className="text-sm">
              <div className="flex items-center gap-1 text-muted-foreground">
                <CheckCircle2 className="h-3.5 w-3.5" />
                <span>{project.completedTaskCount}/{project.taskCount} tasks</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-border">
          <div className="flex -space-x-2">
            {displayMembers.map((member) => (
              <Avatar key={member.name} className="h-7 w-7 border-2 border-background">
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
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Calendar className="h-3.5 w-3.5" />
              <span>{new Date(project.createdAt).toLocaleDateString()}</span>
            </div>
            <SheetTrigger asChild>
              <Button variant="default" size="sm">View</Button>
            </SheetTrigger>
          </div>
        </div>
        </CardContent>
      </Card>
      <SheetContent side="right" className="w-full border-l border-border bg-background p-6 sm:max-w-md">
        <TaskView project={project} />
      </SheetContent>
    </Sheet>
  );
}
