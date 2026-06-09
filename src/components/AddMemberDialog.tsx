import React from "react";
import { Button } from "./ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

import { addProjectMember, removeProjectMember } from "@/lib/api/members.api";
import { Dialog } from "./ui";
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { useMembers } from "@/hooks/useMembers";
import { useProjectAssignableUsers } from "@/hooks/useProjectAssignableUsers";
import { Trash2 } from "lucide-react";

export const AddMemberDialog = ({
  projectId,
  onMemberAdded,
  triggerClassName,
}: {
  projectId: number;
  onMemberAdded: () => void;
  triggerClassName?: string;
}) => {
  const { users, isLoading, error, refetchUsers } =
    useProjectAssignableUsers(projectId);
  const { members, fetchMembers } = useMembers(projectId);
  const [open, setOpen] = React.useState(false);

  const [selectedUserId, setSelectedUserId] = React.useState<string>("");
  const handleAdd = async () => {
    if (!selectedUserId) {
      return;
    }

    await addProjectMember(projectId, Number(selectedUserId));
    await fetchMembers();
    await refetchUsers();
    setSelectedUserId("");
    onMemberAdded();
  };

  const handleRemove = async (userId: number) => {
    await removeProjectMember(projectId, userId);
    await fetchMembers();
    await refetchUsers();
    onMemberAdded();
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className={triggerClassName}>
          Manage Members
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Project Members</DialogTitle>
        </DialogHeader>

        {/* Добавить участника */}
        <div className="flex gap-2">
          <Select value={selectedUserId} onValueChange={setSelectedUserId}>
            <SelectTrigger className="w-full" id="members">
              <SelectValue placeholder="Select members" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {isLoading ? (
                  <SelectItem value="loading" disabled>
                    Loading users...
                  </SelectItem>
                ) : users.length > 0 ? (
                  users.map((user) => (
                    <SelectItem key={user.id} value={String(user.id)}>
                      {user.name}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="empty" disabled>
                    No available users
                  </SelectItem>
                )}
              </SelectGroup>
            </SelectContent>
          </Select>
          <Button onClick={handleAdd} disabled={!selectedUserId || isLoading}>
            Add
          </Button>
        </div>

        {error && <p className="text-sm text-red-500">{error}</p>}

        <ul className="flex flex-col gap-2">
          {members.map((member) => (
            <li key={member.id} className="flex justify-between">
              {member.name}
              <Trash2
                className="cursor-pointer"
                size={18}
                onClick={() => handleRemove(member.id)}
              >
                Remove
              </Trash2>
            </li>
          ))}
        </ul>
      </DialogContent>
    </Dialog>
  );
};
