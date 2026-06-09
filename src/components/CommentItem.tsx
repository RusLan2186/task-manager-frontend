import { TaskComment } from "@/types";
import { Trash2 } from "lucide-react";
import React from "react";

interface Props {
  comment: TaskComment;
  currentUserId: number;
  onDelete: (id: number) => void;
}

export const CommentItem: React.FC<Props> = ({
  comment,
  currentUserId,
  onDelete,
}) => {
  return (
    <li className="rounded-md bg-muted px-3 py-2 text-sm border border-border flex items-center justify-between gap-3">
      <span className="min-w-0 flex-1 wrap-break-word">{comment.text}</span>
      {currentUserId === comment.authorId && (
        <p onClick={() => onDelete(comment.id)} className="cursor-pointer">
          <Trash2 size={20} />
        </p>
      )}
    </li>
  );
};
