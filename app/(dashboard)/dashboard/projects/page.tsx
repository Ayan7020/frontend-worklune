'use client'

import { useWorkspaceStore } from "@/store/userDataStore";
import { useFetchProjectsQuery } from "@/utils/queries/project.queries";
import { MoreVertical, Loader2, ListTodo, Folder, Layers, CheckCircle, ListChecks, LayoutGrid, List, Search } from "lucide-react";
import { ProjectData } from "@/utils/interfaces/responses/project.response";
import AddProjects from "@/components/layout/AddProjects";
import { useEffect, useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { ProjectCard } from "@/components/layout/Projects/ProjectCard";
import { ProjectListItem } from "@/components/layout/Projects/ProjectListItem";
import { workspaceAccessRole } from "@/utils/rbac";

const colors = ['bg-orange-500', 'bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-pink-500', 'bg-yellow-500'];
type filterType = "all" | "active" | "completed"
const Page = () => {
    const [search, setSearch] = useState('');
    const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
    const [filter, setFilter] = useState<filterType>('all');
    const { currentWorkspace } = useWorkspaceStore();
    if (!currentWorkspace) {
        return null;
    }
    
    const { data, isLoading } = useFetchProjectsQuery(currentWorkspace.workspaceId);
    const projects: ProjectData[] = data?.projectsDataRefine || [];

    const projectsStats = useMemo(() => ({
        totalProject: {
            icon: Folder,
            value: projects.length
        },
        active: {
            icon: Layers,
            value: 2
        },
        completed: {
            icon: CheckCircle,
            value: 1
        },
        totalTask: {
            icon: ListChecks,
            value: projects.reduce((agg, project) => agg + project.taskCount, 0)
        }
    }), [data]);


    const filteredProjects = useMemo(() => {
        if (projects.length > 0) {
            let tmpProject = projects;

            if (search) {
                const searchLower = search.toLowerCase();
                tmpProject = tmpProject.filter(p => p.name.toLowerCase().includes(searchLower))
            }

            if (filter === "active") {
                tmpProject = tmpProject.filter(p => p.status === "ACTIVE")
            } else if (filter === "completed") {
                tmpProject = tmpProject.filter(p => p.status === "COMPLETED")
            }

            return tmpProject
        }
        return []
    }, [projects, search, filter])
    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-start justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Projects</h1>
                    <p>Manage your workspace projects</p>
                </div>
                {workspaceAccessRole("ADMIN",currentWorkspace.role) && <AddProjects />}
            </div>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {Object.entries(projectsStats).map(([label, { icon: Icon, value }]) => (
                    <div
                        key={label}
                        className="flex items-center gap-4 rounded-lg bg-white p-4 shadow-sm"
                    >
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-200">
                            <Icon className="h-5 w-5 text-muted-foreground" />
                        </div>

                        <div className="leading-tight">
                            <p className="text-sm capitalize text-muted-foreground">{label}</p>
                            <p className="text-lg font-semibold">{value}</p>
                        </div>
                    </div>
                ))}
            </div>
            {/* Projects Content */}
            <div className="space-y-4">
                {/* Projects header */}
                <div className="flex">
                    <div className="flex gap-x-4">
                        <div className="relative">
                            <Search className="absolute left-3 top-4.5 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                            <Input
                                className="pl-9 w-xs"
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search projects..."
                            />
                        </div>

                        <Select defaultValue="all" onValueChange={(v) => setFilter(v as filterType)}>
                            <SelectTrigger id="role-select" className="w-full">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent position="popper">
                                <SelectItem value="all">All Projects</SelectItem>
                                <SelectItem value="active">Active</SelectItem>
                                <SelectItem value="completed">Completed</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="hidden sm:flex ml-auto gap-1 border border-border rounded-lg p-1">
                        <Button
                            variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => setViewMode("grid")}
                        >
                            <LayoutGrid className="h-4 w-4" />
                        </Button>
                        <Button
                            variant={viewMode === 'list' ? 'secondary' : 'ghost'}
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => setViewMode('list')}
                        >
                            <List className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
                {/* Empty projects states */}
                {!isLoading && filteredProjects.length === 0 && (
                    <div className="flex items-center justify-center py-24">
                        <div className="text-center space-y-4">
                            <ListTodo className="w-16 h-16 text-gray-300 mx-auto" />
                            <h3 className="text-xl font-semibold text-gray-900">No projects yet</h3>
                            <p className="text-gray-600 mb-6">Create your first project to get started</p>
                        </div>
                    </div>
                )}
                {/* Projects grids */}
                {viewMode === "grid" && (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {filteredProjects.map((project, idx) => (
                            <ProjectCard UserRole={currentWorkspace.role} key={idx} project={project} />
                        ))}
                    </div>
                )}
                {viewMode === "list" && (
                    <div className="space-y-2">
                        {filteredProjects.map((project, idx) => (
                            <ProjectListItem
                                key={idx}
                                project={project}
                                UserRole={currentWorkspace.role}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Page;