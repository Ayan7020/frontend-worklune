'use client';

import { useForm } from 'react-hook-form';
import { array, z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { createWorkspaceForm, createWorkspaceSchema } from '@/utils/schemas/dashboard/workspace.schema';
import { workSpaceService } from '@/services/workspace.service';
import { ApiException } from '@/lib/http/errors';
import { applyApiErrorsToForm } from '@/lib/http/error-mapper';
import { useRouter } from 'next/navigation';



const Page = () => {
    const {
        register,
        handleSubmit,
        setError,
        formState: { errors, isSubmitting },
        reset,
    } = useForm<createWorkspaceForm>({
        resolver: zodResolver(createWorkspaceSchema),
        defaultValues: { workspaceName: '' },
    });
    const useNavigate = useRouter();
    const onSubmit = async (data: createWorkspaceForm) => {
        try {
            await workSpaceService.createWorkspace(data);
            useNavigate.push("/dashboard/workspace");
        } catch (error: any) {
            if (error instanceof ApiException) {
                const handled = applyApiErrorsToForm<createWorkspaceForm>(error, setError, Object.keys(createWorkspaceSchema.shape));
                if (handled) return;
                if (error.details && error.details?.validationError && Array.isArray(error.details?.validationError)) {
                    const foundSlug = error.details?.validationError.find(fieldError => fieldError?.field === "slug");
                    if(foundSlug) {
                        setError("workspaceName", {
                            message: "Name already exists!"
                        });
                        return
                    } 
                }
                toast.error(error.message)
            }
        }
    };

    return (
        <div className="min-h-screen bg-background flex items-center justify-center px-4">
            <div className="w-full max-w-2xl py-10">
                <Card className="border-border">
                    <CardHeader>
                        <CardTitle>Create Workspace</CardTitle>
                        <CardDescription>Set a name for your new workspace.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="workspaceName">Workspace Name</Label>
                                <Input
                                    id="workspaceName"
                                    placeholder="e.g. Marketing Team"
                                    {...register('workspaceName')}
                                    disabled={isSubmitting}
                                    className={errors.workspaceName ? 'border-destructive' : ''}
                                />
                                {errors.workspaceName && (
                                    <p className="text-xs text-destructive">{errors.workspaceName.message}</p>
                                )}
                            </div>

                            <div className="flex justify-end">
                                <Button type="submit" disabled={isSubmitting} className="px-6">
                                    {isSubmitting ? 'Creating...' : 'Create Workspace'}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default Page;