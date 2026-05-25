import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  KanbanSquare,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const highlights = [
  {
    title: "Kanban and timelines",
    description: "Organize tasks by status and keep priorities under control.",
    icon: KanbanSquare,
  },
  {
    title: "Team collaboration",
    description: "Assign owners and discuss details directly inside each task.",
    icon: Users,
  },
  {
    title: "Transparent tracking",
    description: "See project progress and change history in one place.",
    icon: ShieldCheck,
  },
];

const demoTasks = [
  { title: "Prepare release", status: "In progress", priority: "High" },
  { title: "Review bug reports", status: "To do", priority: "Medium" },
  { title: "Client sync meeting", status: "Done", priority: "Low" },
];

export default function Home() {
  return (
    <div className="relative isolate space-y-8 py-8 sm:space-y-10 sm:py-10">
      <div className="pointer-events-none absolute -top-20 right-0 -z-10 h-64 w-64 rounded-full bg-primary/15 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 left-0 -z-10 h-72 w-72 rounded-full bg-chart-1/25 blur-3xl" />

      <section className="overflow-hidden rounded-3xl border border-border/60 bg-card/80 p-6 shadow-xl shadow-black/5 backdrop-blur sm:p-8 lg:p-10">
        <div className="grid items-center gap-8 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="space-y-6">
            <Badge variant="secondary" className="px-3 py-1 text-xs">
              <Sparkles className="mr-1.5 size-3.5" />
              Smart teamwork workspace
            </Badge>

            <div className="space-y-4">
              <h1 className="text-pretty text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl">
                Manage tasks,
                <br className="hidden sm:block" />
                not chat chaos
              </h1>
              <p className="max-w-2xl text-base text-muted-foreground sm:text-lg">
                Task Manager helps your team plan sprints faster, track
                deadlines, and stay focused on priorities without busywork.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Button asChild size="lg" className="px-5">
                <Link href="/register">
                  Start for free
                  <ArrowRight className="ml-1 size-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="px-5">
                <Link href="/login">Sign in</Link>
              </Button>
              <Button asChild variant="ghost" size="lg" className="px-4">
                <Link href="/dashboard">Open dashboard</Link>
              </Button>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-1.5">
                <CheckCircle2 className="size-4 text-primary" />
                Quick onboarding
              </span>
              <span className="inline-flex items-center gap-1.5">
                <CheckCircle2 className="size-4 text-primary" />
                Roles and permissions
              </span>
              <span className="inline-flex items-center gap-1.5">
                <CheckCircle2 className="size-4 text-primary" />
                Task comments
              </span>
            </div>
          </div>

          <Card className="border border-border/70 bg-background/80 py-0 shadow-md">
            <CardContent className="space-y-4 p-5 sm:p-6">
              <div className="flex items-center justify-between rounded-xl border border-border/70 bg-card/80 px-4 py-3">
                <div>
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">
                    Active sprint
                  </p>
                  <p className="text-sm font-medium">Website Redesign</p>
                </div>
                <Badge>12 tasks</Badge>
              </div>

              <div className="space-y-2.5">
                {demoTasks.map((task) => (
                  <div
                    key={task.title}
                    className="rounded-xl border border-border/60 bg-card/70 px-3.5 py-3"
                  >
                    <p className="mb-1 text-sm font-medium">{task.title}</p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span className="rounded-full bg-muted px-2 py-0.5">
                        {task.status}
                      </span>
                      <span className="rounded-full bg-muted px-2 py-0.5">
                        {task.priority}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {highlights.map((item) => {
          const Icon = item.icon;

          return (
            <Card
              key={item.title}
              className="border border-border/60 bg-card/70"
            >
              <CardContent className="space-y-3 p-5">
                <div className="inline-flex size-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Icon className="size-4.5" />
                </div>
                <h2 className="text-base font-semibold">{item.title}</h2>
                <p className="text-sm text-muted-foreground">
                  {item.description}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </section>
    </div>
  );
}
