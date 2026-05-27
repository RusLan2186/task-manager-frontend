import React from "react";
import { Button } from "@/components/ui";
import { Trash2 } from "lucide-react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Project } from "@/types";
import { useAuth } from "@/context/AuthContext";

interface Props {
  project: Project;
  removeProject: () => void;
}

export const ProjectCard: React.FC<Props> = ({ project, removeProject }) => {
  const { user } = useAuth();
  const canAccessTasks = project.canAccessTasks ?? true;
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <Card className="group flex h-full flex-col rounded-2xl border-border/70 bg-card/85 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-border hover:shadow-xl">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <CardTitle className="truncate text-lg leading-tight tracking-tight">
              <span className="mr-2 inline-flex h-6 w-6 items-center justify-center rounded-md bg-muted text-sm">
                📋
              </span>
              {project.title}
            </CardTitle>
            <CardDescription className="mt-2 line-clamp-2 text-sm leading-relaxed">
              {project.description || "No description"}
            </CardDescription>
          </div>

          {user?.id === project.ownerId && (
            <Button variant="ghost" size="icon" onClick={removeProject}>
              <Trash2 className="w-4 h-4 text-muted-foreground" />
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent className="flex-1">
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-muted px-2.5 py-1">
            <span>📅</span>
            <span>Created: {formatDate(project.createdAt)}</span>
          </div>

          <p className="inline-flex items-center gap-1.5 rounded-full bg-muted px-2.5 py-1">
            👤 {project.owner?.name || "Unknown"}
          </p>
        </div>
      </CardContent>

      <CardFooter className="flex gap-2 pt-2">
        {canAccessTasks ? (
          <Button
            asChild
            variant="outline"
            className="w-full border-border/70 bg-background/80 text-sm transition-colors group-hover:bg-background"
            size="sm"
          >
            <Link href={`/dashboard/projects/${project.id}`}>View tasks</Link>
          </Button>
        ) : (
          <Button
            variant="outline"
            className="w-full border-border/70 bg-background/80 text-sm"
            size="sm"
            disabled
            title="Only project owner and members can view tasks"
          >
            View tasks
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};
