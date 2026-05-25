import {
  Controller,
  type Control,
  type FieldValues,
  type Path,
} from "react-hook-form";
import { Label } from "./ui";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { User } from "@/types";
import { cn } from "@/lib/utils";

type AssigneeFormValues = FieldValues & {
  assigneeId?: number | null;
};

interface Props<T extends AssigneeFormValues> {
  error: string;
  label: string;
  control: Control<T>;
  users: User[];
}

export const AssigneeSelect = <T extends AssigneeFormValues>({
  error,
  control,
  label,
  users,
}: Props<T>) => {
  return (
    <div>
      <Label
        htmlFor={label}
        className={cn(error ? "text-destructive" : "", "mb-2")}
      >
        {label}
      </Label>
      <Controller
        control={control}
        name={"assigneeId" as Path<T>}
        render={({ field }) => (
          <Select
            onValueChange={(value) =>
              field.onChange(value === "ALL" ? null : Number(value))
            }
            value={field.value?.toString() ?? ""}
          >
            <SelectTrigger
              className="w-full"
              id="assignee"
              aria-invalid={!!error}
            >
              <SelectValue placeholder="Select assignee" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {users.map((user) => (
                  <SelectItem key={user.id} value={user.id.toString()}>
                    {user.name}
                  </SelectItem>
                ))}
                <SelectItem value="ALL">ALL</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        )}
      />
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
};
