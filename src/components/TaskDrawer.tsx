import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Badge } from "./ui/badge";
import { Flag, MessageCircle, ListChecks, Trash2 } from "lucide-react";
import { Task, User } from "@/types";
import React from "react";
import { CreateCommentsDialog } from "./CreateCommentsDialog";
import { Button } from "./ui";
import { EditTaskDialog } from "./EditTaskDialog";
import { useAuth } from "@/context/AuthContext";
import { useComments } from "@/hooks/useComments";
import { deleteTask } from "@/lib/api/tasks.api";
import { deleteComment } from "@/lib/api/comments.api";
import { CommentItem } from "./CommentItem";
import { toast } from "sonner";

interface Props {
  task: Task;
  open: boolean;
  projectId: string;
  onClose: (open: boolean) => void;
  onTaskUpdated: () => void;
  ownerId?: number;
  users: User[];
}

export const TaskDrawer: React.FC<Props> = ({
  task,
  open,
  projectId,
  onClose,
  onTaskUpdated,
  ownerId,
  users,
}) => {
  const { user } = useAuth();

  const { comments, setComments, fetchComments } = useComments(open, task);

  const handleRemoveTask = async (id: number) => {
    try {
      await deleteTask(Number(projectId), id);
      onClose(false);
      onTaskUpdated(); // Refresh tasks list on ProjectPage
      toast.success("Task deleted");
    } catch (error) {
      toast.error("Failed to delete task");
      console.error("Error deleting task:", error);
    }
  };

  const removeComment = async (id: number) => {
    const previousComments = comments;
    setComments((prev) => prev.filter((comment) => comment.id !== id));

    try {
      await deleteComment(task.id, id);
      toast.success("Comment deleted");
    } catch (error) {
      setComments(previousComments);
      toast.error("Failed to delete comment");
      console.error("Error deleting comment:", error);
      fetchComments();
    }
  };

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent className="w-full border-l-border/60 bg-background/95 sm:max-w-xl">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2 text-xl font-bold">
            <ListChecks className="w-5 h-5 text-primary" />
            {task.title}
          </SheetTitle>
          <SheetDescription className="mt-2 text-base">
            {task.description || (
              <span className="italic text-muted-foreground">
                No description provided
              </span>
            )}
          </SheetDescription>
        </SheetHeader>

        <div className="flex flex-col gap-6 px-4 py-2">
          {task.assignee && (
            <p className="mt-2 inline-flex w-fit items-center rounded-full bg-muted px-3 py-1 text-sm text-muted-foreground">
              Assigned to: {task.assignee.name}
            </p>
          )}

          <div className="flex flex-wrap items-center gap-3 rounded-xl border border-border/60 bg-card/70 p-3">
            <Badge
              className={
                task.status === "DONE"
                  ? "bg-green-100 text-green-800 border-green-200"
                  : task.status === "IN_PROGRESS"
                    ? "bg-yellow-100 text-yellow-800 border-yellow-200"
                    : "bg-gray-100 text-gray-800 border-gray-200"
              }
            >
              {task.status === "TODO"
                ? "To Do"
                : task.status === "IN_PROGRESS"
                  ? "In Progress"
                  : "Done"}
            </Badge>

            <Badge
              className={
                task.priority === "HIGH"
                  ? "bg-red-100 text-red-800 border-red-200"
                  : task.priority === "MEDIUM"
                    ? "bg-yellow-100 text-yellow-800 border-yellow-200"
                    : "bg-blue-100 text-blue-800 border-blue-200"
              }
            >
              <Flag className="w-4 h-4 mr-1 inline-block align-text-bottom" />
              {task.priority === "HIGH"
                ? "High Priority"
                : task.priority === "MEDIUM"
                  ? "Medium Priority"
                  : "Low Priority"}
            </Badge>
          </div>

          <div className="space-y-2 rounded-xl border border-border/60 bg-card/70 p-3">
            <div className="flex items-center gap-2 mb-1">
              <MessageCircle className="w-4 h-4 text-primary" />
              <span className="text-base font-semibold">Comments</span>
            </div>
            <CreateCommentsDialog
              taskId={task.id}
              onCommentCreated={fetchComments}
              currentUserId={user?.id || 0}
              setComments={setComments}
            />
            <div className="mt-2 mb-6 max-h-48 overflow-y-auto pr-1">
              {comments.length === 0 ? (
                <p className="text-sm text-muted-foreground italic">
                  No comments yet
                </p>
              ) : (
                <ul className="space-y-2">
                  {comments.map((comment) => (
                    <CommentItem
                      key={comment.id}
                      comment={comment}
                      currentUserId={user?.id || 0}
                      onDelete={removeComment}
                    />
                  ))}
                </ul>
              )}
            </div>

            {user?.id === ownerId && (
              <div className="flex flex-wrap gap-3">
                <Button
                  onClick={() => handleRemoveTask(task.id)}
                  variant="destructive"
                >
                  Delete Task
                </Button>

                <EditTaskDialog
                  task={task}
                  projectId={projectId}
                  onTaskUpdated={onTaskUpdated}
                  users={users}
                />
              </div>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};
