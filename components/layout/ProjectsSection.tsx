'use client';
import { cn } from "@/lib/utils";
import { PROJECT_COLORS } from "@/utils/interfaces/responses/project.response";
import { TaskStatus } from "@/utils/interfaces/responses/task.response";
import { useFetchTasksQuery } from "@/utils/queries/task.queries";
import { ChevronDown, ChevronRight, Hash } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { statusBadgeStyles } from "./common";


const statusLabels: Record<TaskStatus, string> = {
    TODO: 'To do',
    IN_PROGRESS: 'In progress',
    DONE: 'Done',
};
 

const ProjectSection = ({ workspaceId }: { workspaceId: string }) => {
    const { data, isLoading } = useFetchTasksQuery(workspaceId);
    const projects = data?.taksData ?? [];
    const [expandedProjects, setExpandedProjects] = useState<Record<string, boolean>>({});

    useEffect(() => {
        setExpandedProjects({});
    }, [workspaceId]);

    const sortedProjects = useMemo(() => {
        return [...projects].sort((a, b) => a.name.localeCompare(b.name));
    }, [projects]);

    const projectSections = useMemo(
        () =>
            sortedProjects.map((project, index) => ({
                ...project, 
                task: project.tasks ?? [],
            })),
        [sortedProjects]
    );

    const handleToggleProject = (projectId: string) => {
        setExpandedProjects(prev => ({
            ...prev,
            [projectId]: !prev[projectId]
        }));
    };

    const renderSkeleton = () => (
        <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="space-y-2">
                    <div className="h-4 w-32 animate-pulse rounded bg-muted" />
                    <div className="h-3 w-56 animate-pulse rounded bg-muted/70" />
                </div>
            ))}
        </div>
    );

    const renderEmptyState = () => (
        <div className="rounded-xl border border-dashed border-border/70 px-4 py-8 text-center text-sm text-muted-foreground">
            Keep things tidy by creating your first project.
        </div>
    );

    return (
        <aside className="flex w-80 flex-col border-l border-border bg-background/70 text-foreground backdrop-blur">
            <div className="flex items-center justify-between border-b border-border px-4 py-3">
                <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-muted-foreground">Projects</p>
                <span className="text-xs text-muted-foreground">{projectSections.length}</span>
            </div>
            <div className="flex-1 overflow-y-auto px-4 py-2">
                {isLoading && renderSkeleton()}
                {!isLoading && projectSections.length === 0 && renderEmptyState()}
                {!isLoading && projectSections.length > 0 && (
                    <ul className="space-y-4">
                        {projectSections.map((project) => {
                            const hasTasks = project.task.length > 0;
                            const isExpanded = expandedProjects[project.projectId] ?? true;

                            return (
                                <li key={project.projectId} className="space-y-2">
                                    <div
                                        role="button"
                                        tabIndex={0}
                                        onClick={() => hasTasks && handleToggleProject(project.projectId)}
                                        onKeyDown={(event) => {
                                            if ((event.key === 'Enter' || event.key === ' ') && hasTasks) {
                                                event.preventDefault();
                                                handleToggleProject(project.projectId);
                                            }
                                        }}
                                        className="flex items-center gap-3 rounded-xl border border-transparent px-2 py-1 text-left transition-all hover:border-border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                                    >
                                        <span
                                            className="h-2.5 w-2.5 rounded-full"
                                            style={{ backgroundColor: PROJECT_COLORS[project.color] }}
                                            aria-hidden="true"
                                        />

                                        <div className="flex min-w-0 flex-1 flex-col">
                                            <Link
                                                href={`/dashboard/projects/${project.projectId}`}
                                                className="truncate text-sm font-semibold text-foreground hover:underline"
                                            >
                                                {project.name}
                                            </Link>
                                            <span className="text-xs text-muted-foreground">{project.task.length} tasks</span>
                                        </div>
                                        {hasTasks && (
                                            isExpanded ? (
                                                <ChevronDown className="h-4 w-4 text-muted-foreground" />
                                            ) : (
                                                <ChevronRight className="h-4 w-4 text-muted-foreground" />
                                            )
                                        )}
                                    </div>

                                    {hasTasks ? (
                                        isExpanded && (
                                            <ul className="space-y-2 border-l border-border/60 pl-4">
                                                {project.task.map((task) => (
                                                    <li key={task.id} className="flex items-center justify-between gap-3 text-xs text-muted-foreground">
                                                        <Link className="flex flex-1 items-center gap-2 truncate" href={`/dashboard/projects/${project.projectId}/${task.id}`}>
                                                            <Hash className="h-3.5 w-3.5 text-muted-foreground/70" />
                                                            <span className="truncate text-foreground">{task.title}</span>
                                                        </Link>
                                                        <span
                                                            className={cn(
                                                                'rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide',
                                                                statusBadgeStyles[task.status]
                                                            )}
                                                        >
                                                            {statusLabels[task.status] ?? task.status}
                                                        </span>
                                                    </li>
                                                ))}
                                            </ul>
                                        )
                                    ) : (
                                        <p className="border-l border-dashed border-border/60 pl-4 text-xs text-muted-foreground">No tasks yet.</p>
                                    )}
                                </li>
                            );
                        })}
                    </ul>
                )}
            </div>
        </aside>
    );
};

export default ProjectSection