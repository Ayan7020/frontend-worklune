'use client'
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
import { Button } from "../ui/button";
import { Label } from "@radix-ui/react-label";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createProjectForm, createProjectSchema } from "@/utils/schemas/dashboard/projects.schema";
import { projectService } from "@/services/project.service";
import { useWorkspaceStore } from "@/store/userDataStore";
import { applyApiErrorsToForm } from "@/lib/http/error-mapper";
import { ApiException } from "@/lib/http/errors";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { PROJECT_COLORS, ProjectColor } from "@/utils/interfaces/responses/project.response";





const AddProjects = () => {
    const queryClient = useQueryClient();
    const { currentWorkspace } = useWorkspaceStore();
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    if (!currentWorkspace) {
        return null;
    }
    const { handleSubmit, control, setError, register, formState: { errors }, reset, setValue } = useForm<createProjectForm>({
        resolver: zodResolver(createProjectSchema),
        defaultValues: {
            name: "",
            description: "",
            projectColor: "BLUE"
        }
    });

    const name = useWatch({ control, name: "name" })
    const description = useWatch({ control, name: "description" })
    const color = useWatch({ control, name: "projectColor" });


    const onClickAddProject = async (data: createProjectForm) => {
        if (!data) {
            return;
        }
        setLoading(true);
        try {
            await projectService.createProject(currentWorkspace.workspaceId, data);
            queryClient.invalidateQueries({ queryKey: ["getProjects", currentWorkspace.workspaceId] })
            setOpen(false);

        } catch (error) {
            if (error instanceof ApiException) {
                const handled = applyApiErrorsToForm(error, setError, Object.keys(createProjectSchema.shape))
                if (handled) return;
                toast.error(error.message)
                return
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        reset();
    }, [open])

    return <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
            <Button variant="default" className="gap-2 cursor-pointer">
                <span className="text-lg">+</span>
                Add Projects
            </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-lg h-max"  >
            <form onSubmit={handleSubmit(onClickAddProject)} className="space-y-2">
                <DialogHeader>
                    <DialogTitle>Create Project</DialogTitle>
                    <DialogDescription>
                        Add a new project to organize your tasks.
                    </DialogDescription>
                </DialogHeader>
                {/* main content */}
                <div className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="name" className="text-sm font-medium ">
                            Project Name <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            id="name"
                            placeholder="e.g., Website Redesign"
                            {...register("name")}
                            className={errors.name ? "border-red-500 focus-visible:ring-red-500" : ""}
                        />
                        {errors.name && (
                            <p className="text-sm text-red-500 mt-1">{errors.name.message}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description" className="text-sm font-medium">
                            Description <span className="text-red-500">*</span>
                        </Label>
                        <Textarea
                            id="description"
                            placeholder="Describe what this project is about..."
                            {...register("description")}
                            className={`min-h-20 ${errors.description ? "border-red-500 focus-visible:ring-red-500" : ""}`}
                        />

                        {errors.description && (
                            <p className="text-sm text-red-500 mt-1">{errors.description.message}</p>
                        )}
                    </div>
                    <div className="space-y-2">
                        <Label>Color</Label>
                        <div className="flex flex-wrap gap-2">
                            {Object.keys(PROJECT_COLORS).map((key, idx) => {
                                const colorKey = key as ProjectColor
                                const hex = PROJECT_COLORS[colorKey]

                                return (
                                    <button
                                        key={idx}
                                        type="button"
                                        onClick={() => setValue("projectColor", colorKey, { shouldDirty: true })}
                                        className={cn(
                                            'h-8 w-8 rounded-lg transition-all',
                                            color === colorKey && 'ring-2 ring-primary ring-offset-2 ring-offset-background'
                                        )}
                                        style={{ backgroundColor: hex }}
                                    />

                                )
                            })}
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label>Preview</Label>
                        <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                            <div
                                className="h-10 w-10 rounded-lg flex items-center justify-center text-primary-foreground font-semibold"
                                style={{ backgroundColor: PROJECT_COLORS[color] }}
                            >
                                {name ? name.charAt(0).toUpperCase() : 'P'}
                            </div>
                            <div>
                                <p className="font-medium text-foreground">
                                    {name || 'Project Name'}
                                </p>
                                <p className="text-sm text-muted-foreground line-clamp-1">
                                    {description || 'Project description...'}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
                <DialogFooter className="gap-2 ">
                    <DialogClose asChild>
                        <Button variant="outline">Cancel</Button>
                    </DialogClose>
                    <Button
                        type="submit"
                        disabled={loading}
                        className="gap-2"
                    >
                        Create Project
                    </Button>
                </DialogFooter>
            </form>
        </DialogContent>
    </Dialog >
}

export default AddProjects