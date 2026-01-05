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
import { Button } from "../../ui/button";
import { Label } from "../../ui/label";
import { Input } from "../../ui/input";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { useUserSearch } from "@/utils/queries/user.queries";
import GetBadge from "../GetBadge";
import { X, Plus } from "lucide-react";
import { projectService } from "@/services/project.service";
import { ApiException } from "@/lib/http/errors";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { DropdownMenuItem } from "../../ui/dropdown-menu";

interface AddMemberProps {
    project_id: string;
    workspaceId: string;
}

const AddMember = ({ workspaceId,project_id }: AddMemberProps) => {
    const [open,setOpen] = useState<boolean>(false)
    const queryClient = useQueryClient();
    const [name, setName] = useState("")
    const [selectedUser, setSelectedUser] = useState<{ name: string; email: string; avatarUrl: string | null,id: string } | null>(null)
    const [selectedRole, setSelectedRole] = useState<"MEMBER" | "MAINTAINER" >("MEMBER")

    const { data, isFetching } = useUserSearch({ 
        query: name,
    });

    const onClickAddMember = async () => {
        if (!selectedUser?.email || !selectedRole) {
            return;
        }
        try {
            await projectService.addMember(workspaceId, {
                project_id: project_id,
                member_id: selectedUser.id,
                role: selectedRole
            });
            setOpen(false);
            toast.success("Member added successfully");
            queryClient.invalidateQueries({ queryKey: ["getProjects",workspaceId] });
            setSelectedUser(null);
            setName("");
            setSelectedRole("MEMBER");
        } catch (error) {
            if (error instanceof ApiException) {
                toast.error(error.message);
            } else {
                toast.error("Failed to add member");
            }
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen} >
            <DialogTrigger asChild>
                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                    <Plus />
                    Add Member
                </DropdownMenuItem>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Add Member to Project</DialogTitle>
                    <DialogDescription>
                        Search and add people to collaborate on this project.
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                    {/* Selected User Display */}
                    {selectedUser && (
                        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <GetBadge avatarUrl={selectedUser.avatarUrl} name={selectedUser.name} size={40} />
                                <div>
                                    <p className="font-semibold text-sm text-gray-900">{selectedUser.name}</p>
                                    <p className="text-xs text-gray-600">{selectedUser.email}</p>
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={() => {
                                    setSelectedUser(null)
                                    setName("")
                                }}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                <X size={18} />
                            </button>
                        </div>
                    )}

                    {/* Search Input */}
                    <div className="space-y-3">
                        {!selectedUser && (
                            <>
                                <Label htmlFor="name-1" className="text-sm font-medium ">Search Member</Label>
                                <div className="relative top-1">
                                    <Input
                                        id="name-1"
                                        name="name"
                                        placeholder="Enter email or username"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        disabled={!!selectedUser}
                                        className="pr-10"
                                        autoComplete="off"
                                    />
                                    {name && !selectedUser && (
                                        <button
                                            type="button"
                                            onClick={() => setName("")}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                        >
                                            <X size={16} />
                                        </button>
                                    )}
                                </div>
                            </>
                        )}

                        {/* Users Search Results Dropdown */}
                        {name && !selectedUser && (
                            <div className="border rounded-lg overflow-hidden bg-white shadow-md animate-in fade-in zoom-in-95 duration-200">
                                {isFetching ? (
                                    <div className="p-4 text-sm text-gray-500 text-center">
                                        <div className="flex items-center justify-center gap-2">
                                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                                            Searching...
                                        </div>
                                    </div>
                                ) : data?.users && data.users.length > 0 ? (
                                    <div className="max-h-64 overflow-y-auto">
                                        {data.users.map((user, index) => (
                                            <button
                                                key={index}
                                                type="button"
                                                onClick={() => {
                                                    setSelectedUser(user)
                                                    setName("")
                                                }}
                                                className="w-full p-3 hover:bg-gray-50 transition-colors flex items-center gap-3 border-b last:border-b-0 text-left"
                                            >
                                                <GetBadge avatarUrl={user.avatarUrl} name={user.name} size={30} />
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-medium text-gray-900 truncate">{user.name}</p>
                                                    <p className="text-xs text-gray-500 truncate">{user.email}</p>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="p-4 text-sm text-gray-500 text-center">No users found</div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Role Selection */}
                    {selectedUser && (
                        <div className="space-y-2">
                            <Label htmlFor="role-select" className="text-sm font-medium">Role</Label>
                            <Select value={selectedRole} onValueChange={(value) => {
                                setSelectedRole(value as "MEMBER" | "MAINTAINER");
                            }}>

                                <SelectTrigger id="role-select" className="w-full">
                                    <SelectValue placeholder="Select a role" />
                                </SelectTrigger>
                                <SelectContent position="popper">
                                    <SelectGroup>
                                        <SelectLabel>Available Roles</SelectLabel>
                                        <SelectItem value="MEMBER">
                                            <div className="flex items-center gap-2">
                                                Member
                                            </div>
                                        </SelectItem>
                                        <SelectItem value="MAINTAINER">
                                            <div className="flex items-center gap-2">
                                                Maintainer
                                            </div>
                                        </SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>
                    )}
                </div>
                <DialogFooter className="gap-2 ">
                    <DialogClose asChild>
                        <Button variant="outline">Cancel</Button>
                    </DialogClose>
                    <Button
                        type="submit"
                        onClick={onClickAddMember}
                        disabled={!selectedUser || !selectedRole}
                        className="gap-2"
                    >
                        Add Member
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default AddMember;