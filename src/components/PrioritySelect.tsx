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
import { cn } from "@/lib/utils";

type PriorityFormValues = FieldValues & {
  priority?: "LOW" | "MEDIUM" | "HIGH";
};

interface Props<T extends PriorityFormValues> {
  error: string;
  label: string;
  control: Control<T>;
}

export const PrioritySelect = <T extends PriorityFormValues>({
  error,
  control,
  label,
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
        name={"priority" as Path<T>}
        render={({ field }) => (
          <Select onValueChange={field.onChange} value={field.value}>
            <SelectTrigger
              className="w-full"
              id="priority"
              aria-invalid={!!error}
            >
              <SelectValue placeholder="Select priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="LOW">Low</SelectItem>
                <SelectItem value="MEDIUM">Medium</SelectItem>
                <SelectItem value="HIGH">High</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        )}
      />
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
};
