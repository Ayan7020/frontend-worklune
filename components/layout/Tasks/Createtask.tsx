"use client";

import { useState } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@radix-ui/react-label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { createTasksSchema, createTasksForm, createTaskInput, createTaskOutput } from "@/utils/schemas/dashboard/task.schema";
import { taskService } from "@/services/task.service";
import { useWorkspaceStore } from "@/store/userDataStore";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { applyApiErrorsToForm } from "@/lib/http/error-mapper";
import { ApiException } from "@/lib/http/errors";
import { useFetchProjectsQuery, useFetchProjectDetailsQuery } from "@/utils/queries/project.queries";

interface CreateTaskProps {
    className?: string;
    workspaceId?: string;
    projectId?: string;
}

const PRIORITY_OPTIONS = [
    { value: "URGENT" as const, label: "Urgent", helper: "Critical blockers" },
    { value: "HIGH" as const, label: "High", helper: "Important deliverables" },
    { value: "LOW" as const, label: "Low", helper: "Backlog or nice-to-haves" },
];

const CreateTask = ({ className, workspaceId, projectId }: CreateTaskProps) => {
    const queryClient = useQueryClient();
    const { currentWorkspace } = useWorkspaceStore();
    const resolvedWorkspaceId = workspaceId ?? currentWorkspace?.workspaceId ?? "";
    const [open, setOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const allowProjectSelection = !projectId;

    const {
        control,
        handleSubmit,
        register,
        reset,
        setValue,
        setError,
        formState: { errors },
    } = useForm<createTaskInput>({
        resolver: zodResolver(createTasksSchema),
        defaultValues: {
            project_id: projectId ?? "",
            task_title: "",
            task_description: "",
            task_priority: "HIGH",
            task_tag: "",
            user_assign_id: "",
            task_due_date: new Date(),
        },
    });

    const watchedProjectId = useWatch({ control, name: "project_id" }) ?? "";

    const { data: projectsData } = useFetchProjectsQuery(resolvedWorkspaceId);
    const projectOptions = projectsData?.projectsDataRefine ?? [];

    const { data: projectDetailsData } = useFetchProjectDetailsQuery(
        resolvedWorkspaceId,
        watchedProjectId
    );

    const selectedProject = projectDetailsData?.projectsDetails;
    const assignableMembers = selectedProject?.projectMembers ?? [];

    const handleDialogChange = (nextOpen: boolean) => {
        setOpen(nextOpen);
        if (nextOpen) {
            reset({
                project_id: projectId ?? (watchedProjectId || ""),
                task_title: "",
                task_description: "",
                task_priority: "HIGH",
                task_tag: "",
                user_assign_id: "",
                task_due_date: "",
            });
            if (projectId) {
                setValue("project_id", projectId, { shouldDirty: false });
            }
        }
    };

    const handleCreateTask = async (formData: createTaskInput) => {
        const parsed = createTasksSchema.parse(formData);
        if (!resolvedWorkspaceId) {
            toast.error("A workspace is required to create tasks.");
            return;
        }

        if (!formData.project_id) {
            setError("project_id", { type: "manual", message: "Select a project." });
            return;
        }

        setIsSubmitting(true);
        try {
            await taskService.createTask(resolvedWorkspaceId, parsed);
            toast.success("Task created successfully.");
            queryClient.invalidateQueries({ queryKey: ["getProjectDetails", formData.project_id] });
            queryClient.invalidateQueries({ queryKey: ["getTasks1", resolvedWorkspaceId] });
            reset({
                project_id: projectId ?? formData.project_id,
                task_title: "",
                task_description: "",
                task_priority: "HIGH",
                task_tag: "",
                user_assign_id: "",
                task_due_date: "",
            });
            setOpen(false);
        } catch (error) {
            if (error instanceof ApiException) {
                const handled = applyApiErrorsToForm(error, setError, Object.keys(createTasksSchema.shape));
                if (!handled) {
                    toast.error(error.message);
                }
            } else {
                toast.error("Unable to create task. Please try again.");
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    const canSubmit = Boolean(watchedProjectId && resolvedWorkspaceId && !isSubmitting);

    return (
        <Dialog open={open} onOpenChange={handleDialogChange}>
            <DialogTrigger asChild>
                <Button size="lg" className={cn("gap-2 rounded-full px-6", className)}>
                    <Plus className="h-4 w-4" />
                    Create Task
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl w-[95vw] sm:w-full max-h-[90vh] overflow-y-auto">
                <form onSubmit={handleSubmit(handleCreateTask)} className="space-y-6">
                    <DialogHeader>
                        <DialogTitle className="text-xl sm:text-2xl">Create New Task</DialogTitle>
                        <DialogDescription>Fill in the details to create a new task for your project.</DialogDescription>
                    </DialogHeader>

                    <div className="space-y-5">
                        {/* Project Selection */}
                        {allowProjectSelection && (
                            <div className="space-y-2">
                                <Label className="text-sm font-medium">Project *</Label>
                                <Controller
                                    control={control}
                                    name="project_id"
                                    render={({ field }) => (
                                        <Select value={field.value} onValueChange={field.onChange}>
                                            <SelectTrigger className={cn(errors.project_id && "border-red-500")}>
                                                <SelectValue placeholder="Select a project" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {projectOptions.map((project) => (
                                                    <SelectItem key={project.id} value={project.id}>
                                                        {project.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    )}
                                />
                                {errors.project_id && (
                                    <p className="text-sm text-red-500">{errors.project_id.message}</p>
                                )}
                            </div>
                        )}

                        {/* Task Title */}
                        <div className="space-y-2">
                            <Label htmlFor="task_title" className="text-sm font-medium">Task Title *</Label>
                            <Input
                                id="task_title"
                                placeholder="Enter task title"
                                {...register("task_title")}
                                className={cn(errors.task_title && "border-red-500")}
                            />
                            {errors.task_title && (
                                <p className="text-sm text-red-500">{errors.task_title.message}</p>
                            )}
                        </div>

                        {/* Task Description */}
                        <div className="space-y-2">
                            <Label htmlFor="task_description" className="text-sm font-medium">Description</Label>
                            <Textarea
                                id="task_description"
                                placeholder="Describe the task..."
                                rows={4}
                                {...register("task_description")}
                                className={cn(errors.task_description && "border-red-500", "resize-none")}
                            />
                            {errors.task_description && (
                                <p className="text-sm text-red-500">{errors.task_description.message}</p>
                            )}
                        </div>

                        {/* Priority and Tag Row */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {/* Priority */}
                            <div className="space-y-2">
                                <Label className="text-sm font-medium">Priority *</Label>
                                <Controller
                                    control={control}
                                    name="task_priority"
                                    render={({ field }) => (
                                        <Select value={field.value} onValueChange={field.onChange}>
                                            <SelectTrigger className={cn(errors.task_priority && "border-red-500")}>
                                                <SelectValue placeholder="Select priority" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {PRIORITY_OPTIONS.map((priority) => (
                                                    <SelectItem key={priority.value} value={priority.value}>
                                                        <div className="flex flex-col">
                                                            <span>{priority.label}</span>
                                                            <span className="text-xs text-muted-foreground">{priority.helper}</span>
                                                        </div>
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    )}
                                />
                                {errors.task_priority && (
                                    <p className="text-sm text-red-500">{errors.task_priority.message}</p>
                                )}
                            </div>

                            {/* Tag */}
                            <div className="space-y-2">
                                <Label htmlFor="task_tag" className="text-sm font-medium">Tag</Label>
                                <Input
                                    id="task_tag"
                                    placeholder="e.g., bug, feature"
                                    {...register("task_tag")}
                                    className={cn(errors.task_tag && "border-red-500")}
                                />
                                {errors.task_tag && (
                                    <p className="text-sm text-red-500">{errors.task_tag.message}</p>
                                )}
                            </div>
                        </div>

                        {/* Assignee and Due Date Row */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {/* Assignee */}
                            <div className="space-y-2">
                                <Label className="text-sm font-medium">Assign To</Label>
                                <Controller
                                    control={control}
                                    name="user_assign_id"
                                    render={({ field }) => (
                                        <Select
                                            value={field.value}
                                            onValueChange={field.onChange}
                                            disabled={!watchedProjectId || assignableMembers.length === 0}
                                        >
                                            <SelectTrigger className={cn(errors.user_assign_id && "border-red-500")}>
                                                <SelectValue placeholder={watchedProjectId ? "Select member" : "Select project first"} />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {assignableMembers.map((member) => (
                                                    <SelectItem key={member.id} value={member.id}>
                                                        {member.name || member.email}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    )}
                                />
                                {errors.user_assign_id && (
                                    <p className="text-sm text-red-500">{errors.user_assign_id.message}</p>
                                )}
                            </div>

                            {/* Due Date */}
                            <div className="space-y-2">
                                <Label htmlFor="task_due_date" className="text-sm font-medium">Due Date</Label>
                                <Input
                                    id="task_due_date"
                                    type="date"
                                    {...register("task_due_date")}
                                    className={cn(errors.task_due_date && "border-red-500")}
                                />
                                {errors.task_due_date && (
                                    <p className="text-sm text-red-500">{errors.task_due_date?.message}</p>
                                )}
                            </div>
                        </div>
                    </div>

                    <DialogFooter className="gap-2">
                        <DialogClose asChild>
                            <Button type="button" variant="outline" disabled={isSubmitting} className="w-full sm:w-auto">
                                Cancel
                            </Button>
                        </DialogClose>
                        <Button type="submit" disabled={!canSubmit} className="gap-2 w-full sm:w-auto">
                            {isSubmitting ? "Creating..." : "Create Task"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default CreateTask;