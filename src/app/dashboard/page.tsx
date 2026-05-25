"use client";
import React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Title } from "@/components";
import { CreateProjectDialog } from "@/components/CreateProjectDialog";
import { ProjectCard } from "@/components/ProjectCard";
import { Input } from "@/components/ui/input";

import { useAuth } from "@/context/AuthContext";
import { useProjects } from "@/hooks/useProjects";
import { deleteProject } from "@/lib/api/projects.api";
import { debounce } from "lodash";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

export default function Dashboard() {
  const { user, isLoading } = useAuth();
  const searchParams = useSearchParams();
  const router = useRouter();
  const search = searchParams.get("search") ?? "";
  const rawSort = searchParams.get("sort");
  const sort = rawSort === "asc" || rawSort === "desc" ? rawSort : "";
  const [searchValue, setSearchValue] = React.useState(search);

  const {
    projects,
    setProjects,
    isLoading: projectsLoading,
    refetch: fetchProjects,
  } = useProjects(search, sort || undefined);

  const handleSearch = React.useMemo(
    () =>
      debounce((value: string, currentParams: string) => {
        const params = new URLSearchParams(currentParams);
        if (value) {
          params.set("search", value);
        } else {
          params.delete("search");
        }
        router.push(`/dashboard?${params.toString()}`);
      }, 300),
    [router],
  );

  React.useEffect(() => {
    return () => {
      handleSearch.cancel();
    };
  }, [handleSearch]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
    handleSearch(e.target.value, searchParams.toString());
  };

  if (isLoading) {
    return (
      <div className="space-y-8">
        <div>
          <Title text="My projects" size="xl" />
          <p className="text-muted-foreground mt-2">Loading...</p>
        </div>
      </div>
    );
  }

  const removeProject = async (id: number) => {
    const previousProjects = projects;
    setProjects((prev) => prev.filter((project) => project.id !== id));

    try {
      await deleteProject(id);
      toast.success("Project deleted");
    } catch (error) {
      setProjects(previousProjects);
      toast.error("Failed to delete project");
      console.error("Error deleting project:", error);
      await fetchProjects();
    }
  };

  const handleSortChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value === "ALL") {
      params.delete("sort");
    } else {
      params.set("sort", value);
    }

    const queryString = params.toString();
    router.push(queryString ? `/dashboard?${queryString}` : `/dashboard`);
  };

  return (
    <div className="space-y-8">
      <section className="rounded-2xl border border-border/70 bg-card/80 p-5 shadow-sm backdrop-blur sm:p-6">
        <div className="space-y-2">
          <Title text="My projects" size="xl" className="text-balance" />
          {user && (
            <div className="flex flex-wrap items-center gap-4 text-muted-foreground">
              <p>
                Welcome back,{" "}
                <span className="font-semibold text-foreground">
                  {user.name}
                </span>
                !
              </p>
              <CreateProjectDialog onProjectCreated={fetchProjects} />
            </div>
          )}
        </div>
      </section>

      <section className="flex flex-col gap-4 rounded-2xl border border-border/60 bg-background/70 p-4 sm:p-5 lg:flex-row lg:items-center lg:justify-between">
        <Input
          className="w-full lg:max-w-md"
          type="text"
          placeholder="Search"
          value={searchValue}
          onChange={handleChange}
        />

        <div className="flex items-center justify-end gap-3">
          <Select value={sort || "ALL"} onValueChange={handleSortChange}>
            <SelectTrigger className="w-52 bg-background/80">
              <span className="text-muted-foreground mr-2">Sort by:</span>
              <SelectValue placeholder="Sort By" />
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
      </section>

      {projectsLoading ? (
        <p className="rounded-xl border border-border/60 bg-card/70 px-4 py-6 text-muted-foreground">
          Loading projects...
        </p>
      ) : (
        <div>
          {projects.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card/60 py-16 px-4 shadow-sm">
              <div className="text-center">
                <p className="text-lg font-semibold text-foreground mb-2">
                  No projects yet
                </p>
                <p className="text-muted-foreground mb-6">
                  Create your first project to get started
                </p>
                <CreateProjectDialog onProjectCreated={fetchProjects} />
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
              {projects.map((project) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  removeProject={() => removeProject(project.id)}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
