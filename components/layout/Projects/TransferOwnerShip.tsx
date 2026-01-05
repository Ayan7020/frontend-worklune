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
import { useWorkspaceMembersQuery } from "@/utils/queries/workspace.queries";
import { useWorkspaceStore } from "@/store/userDataStore";
import { Send } from "lucide-react";

interface TarnsferOwnerShipProps {
    project_id: string;
    workspaceId: string;
}

const TarnsferOwnerShip = ({ workspaceId, project_id }: TarnsferOwnerShipProps) => {
    const [selectedEmail, setSelectedEmail] = useState<string>("");
    const { userStoreData } = useWorkspaceStore();
    const queryClient = useQueryClient();
    const { data } = useWorkspaceMembersQuery(workspaceId);
    if (!data || !userStoreData?.userData) {
        return null;
    }

    const admins = data.membersData.filter(member => (member.role === "ADMIN" || member.role === "OWNER") && member.email !== userStoreData.userData.email);

    const handleTransfer = async () => {
        if (!selectedEmail) return;
        try {
            await projectService.transferOwnership(workspaceId, { project_id: project_id, member_id: selectedEmail });
            toast.success("Ownership transferred successfully");
            queryClient.invalidateQueries({ queryKey: ['getProjects', workspaceId] });
        } catch (error) {
            if (error instanceof ApiException) {
                toast.error(error.message);
            } else {
                toast.error("An error occurred");
            }
        }
    };

    return (
        <Dialog >
            <DialogTrigger asChild>
                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                    <Send />
                    <p>Transfer ownership</p>
                </DropdownMenuItem>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Transfer Ownership</DialogTitle>
                    <DialogDescription>
                        Select a new owner for this project from the list of admins and owner.
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="admin-select">Select project owner</Label>
                        <Select onValueChange={setSelectedEmail} value={selectedEmail}>
                            <SelectTrigger>
                                <SelectValue placeholder="Choose an admin" />
                            </SelectTrigger>
                            <SelectContent position="popper">
                                {admins.map(admin => (
                                    <SelectItem key={admin.email} value={admin.id}>
                                        {admin.name} ({admin.email})
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="outline">Cancel</Button>
                    </DialogClose>
                    <Button onClick={handleTransfer} disabled={!selectedEmail}>
                        Transfer
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default TarnsferOwnerShip;