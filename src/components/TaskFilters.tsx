import React from "react";
import { Select } from "@/components/ui";
import {
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { User } from "@/types";

interface Props {
  users: User[];
  handleFilterChange: (key: string, value: string) => void;
  priorityValue: string;
  assigneeIdValue: string;
  sortValue: string;
}

export const TaskFilters: React.FC<Props> = ({
  users,
  handleFilterChange,
  priorityValue,
  assigneeIdValue,
  sortValue,
}) => {
  return (
    <div className="flex flex-wrap items-center justify-end gap-3">
      <Select
        value={priorityValue}
        onValueChange={(value) => handleFilterChange("priority", value)}
      >
        <SelectTrigger className="w-52 bg-background/80">
          <span className="text-muted-foreground mr-2">Priority:</span>
          <SelectValue placeholder="ALL" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Priority</SelectLabel>
            <SelectItem value="LOW">LOW</SelectItem>
            <SelectItem value="MEDIUM">MEDIUM</SelectItem>
            <SelectItem value="HIGH">HIGH</SelectItem>
            <SelectItem value="ALL">ALL</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>

      <Select
        value={assigneeIdValue}
        onValueChange={(value) => handleFilterChange("assigneeId", value)}
      >
        <SelectTrigger className="w-52 bg-background/80">
          <span className="text-muted-foreground mr-2">Assignee:</span>
          <SelectValue placeholder="ALL" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Assignee</SelectLabel>
            {users.map((user) => (
              <SelectItem key={user.id} value={user.id.toString()}>
                {user.name}
              </SelectItem>
            ))}
            <SelectItem value="ALL">ALL</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>

      <Select
        value={sortValue}
        onValueChange={(value) => handleFilterChange("sort", value)}
      >
        <SelectTrigger className="w-52 bg-background/80">
          <span className="text-muted-foreground mr-2">Sort by:</span>
          <SelectValue placeholder="ALL" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Sort by</SelectLabel>
            <SelectItem value="ALL">ALL</SelectItem>
            <SelectItem value="asc">ASC</SelectItem>
            <SelectItem value="desc">DESC</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
};
