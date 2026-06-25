"use client";

import type { ReactNode } from "react";

import {
  Activity,
  BarChart3,
  BriefcaseBusiness,
  ChevronLeft,
  ChevronRight,
  Code2,
  FileText,
  MoreHorizontal,
  Search,
  Users,
} from "lucide-react";
import { motion } from "motion/react";

import { cn } from "@/lib";
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui";

import { adminChartSeries } from "../data";
import type { AdminStat } from "../types";
import { getDifficultyTone, getInitials, getStatusTone } from "../utils";

const statIcons: Record<string, typeof Users> = {
  "Total Users": Users,
  "Mock Interviews": BriefcaseBusiness,
  "Coding Sessions": Code2,
  "Resume Analyses": FileText,
} satisfies Record<string, typeof Users>;

export function DataPanel({
  actions,
  children,
  description,
  title,
}: {
  actions?: ReactNode;
  children: ReactNode;
  description: string;
  title: string;
}) {
  return (
    <Card className="rounded-lg bg-card/78">
      <CardHeader className="gap-4 border-border border-b sm:flex-row sm:items-center sm:justify-between">
        <div>
          <CardTitle>{title}</CardTitle>
          <p className="mt-2 text-muted-foreground text-sm">{description}</p>
        </div>
        {actions}
      </CardHeader>
      <CardContent className="p-0">{children}</CardContent>
    </Card>
  );
}

export function TableFilters() {
  return (
    <div className="flex flex-col gap-2 sm:flex-row">
      <div className="relative">
        <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input className="w-full pl-9 sm:w-64" placeholder="Search" />
      </div>
      <Select defaultValue="all">
        <SelectTrigger className="w-full sm:w-36">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All statuses</SelectItem>
          <SelectItem value="active">Active</SelectItem>
          <SelectItem value="review">Needs review</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}

export function ResponsiveTable({
  children,
  columns,
}: {
  children: ReactNode;
  columns: string[];
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[840px] text-left text-sm">
        <thead className="border-border border-b bg-surface-secondary/40 text-muted-foreground text-xs uppercase">
          <tr>
            {columns.map((column) => (
              <th className="px-5 py-3 font-semibold" key={column || "actions"}>
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
    </div>
  );
}

export function Pagination() {
  return (
    <div className="flex flex-col gap-3 border-border border-t px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-muted-foreground text-sm">
        Showing 1-5 of 248 results
      </p>
      <div className="flex items-center gap-2">
        <Button className="h-9 gap-1 rounded-lg" variant="outline">
          <ChevronLeft className="size-4" />
          Prev
        </Button>
        <Button className="h-9 rounded-lg" variant="secondary">
          1
        </Button>
        <Button className="h-9 rounded-lg" variant="ghost">
          2
        </Button>
        <Button className="h-9 gap-1 rounded-lg" variant="outline">
          Next
          <ChevronRight className="size-4" />
        </Button>
      </div>
    </div>
  );
}

export function ActionMenu({
  destructive,
  onPrimary,
  primary,
  secondary,
}: {
  destructive: string;
  onPrimary: () => void;
  primary: string;
  secondary: string;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button aria-label="Open actions" size="icon" variant="ghost">
          <MoreHorizontal className="size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={onPrimary}>{primary}</DropdownMenuItem>
        <DropdownMenuItem>{secondary}</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive">{destructive}</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function StatusBadge({ status }: { status: string }) {
  const tone = getStatusTone(status);

  return (
    <Badge
      className={cn(
        "border-border",
        tone === "success" && "bg-primary/10 text-primary",
        tone === "warning" && "bg-[var(--chart-5)]/10 text-[var(--chart-5)]",
        tone === "destructive" && "bg-destructive/10 text-destructive",
      )}
      variant="outline"
    >
      {status}
    </Badge>
  );
}

export function DifficultyBadge({ difficulty }: { difficulty: string }) {
  const tone = getDifficultyTone(difficulty);

  return (
    <Badge
      className={cn(
        tone === "success" && "bg-primary/10 text-primary",
        tone === "warning" && "bg-[var(--chart-5)]/10 text-[var(--chart-5)]",
        tone === "destructive" && "bg-destructive/10 text-destructive",
      )}
      variant="outline"
    >
      {difficulty}
    </Badge>
  );
}

export function ScorePill({ value }: { value: number }) {
  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-2.5 py-1">
      <span className="h-1.5 w-10 overflow-hidden rounded-full bg-muted">
        <span
          className="block h-full rounded-full bg-primary"
          style={{ width: `${value}%` }}
        />
      </span>
      <span className="font-semibold text-heading text-xs">{value}%</span>
    </div>
  );
}

export function Avatar({ name }: { name: string }) {
  return (
    <div className="flex size-10 shrink-0 items-center justify-center rounded-full border border-primary/20 bg-primary/10 font-bold text-primary text-sm">
      {getInitials(name)}
    </div>
  );
}

export function RadialScore({ value }: { value: number }) {
  return (
    <div
      className="mx-auto flex size-52 items-center justify-center rounded-full border border-primary/20 bg-card/75"
      style={{
        backgroundImage: `conic-gradient(var(--primary) ${value * 3.6}deg, transparent 0deg)`,
      }}
    >
      <div className="flex size-36 flex-col items-center justify-center rounded-full border border-border bg-background/95 text-center shadow-inner">
        <span className="font-bold text-5xl text-heading">{value}</span>
        <span className="mt-1 text-muted-foreground text-xs uppercase">
          index
        </span>
      </div>
    </div>
  );
}

export function MetricCard({ caption, change, label, value }: AdminStat) {
  const Icon = statIcons[label] ?? BarChart3;

  return (
    <Card className="group rounded-lg bg-card/72 py-0 transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/25 hover:bg-card/95">
      <CardContent className="p-4">
        <div className="mb-4 flex items-start justify-between">
          <div className="flex size-9 items-center justify-center rounded-md border border-border bg-surface-secondary/70 text-primary">
            <Icon className="size-4" />
          </div>
          <Badge
            className="border-primary/20 bg-primary/10 text-primary"
            variant="outline"
          >
            {change}
          </Badge>
        </div>
        <p className="font-bold text-2xl text-heading tracking-tight">
          {value}
        </p>
        <p className="mt-1 font-semibold text-sm">{label}</p>
        <p className="mt-1 text-muted-foreground text-xs">{caption}</p>
      </CardContent>
    </Card>
  );
}

export function ChartCard({
  caption,
  title,
}: {
  caption: string;
  title: string;
}) {
  const max = Math.max(...adminChartSeries);

  return (
    <Card className="rounded-lg bg-card/78">
      <CardHeader className="flex-row items-start justify-between">
        <div>
          <CardTitle>{title}</CardTitle>
          <p className="mt-2 text-muted-foreground text-sm">{caption}</p>
        </div>
        <Badge className="bg-primary/10 text-primary" variant="outline">
          12 weeks
        </Badge>
      </CardHeader>
      <CardContent>
        <div className="flex h-72 items-end gap-2 rounded-lg border border-border bg-surface-secondary/40 p-4">
          {adminChartSeries.map((value, index) => (
            <div
              className="flex min-w-0 flex-1 flex-col items-center gap-2"
              key={`${value}-${index}`}
            >
              <motion.div
                animate={{ height: `${(value / max) * 100}%` }}
                className="w-full rounded-t-md bg-primary/75 shadow-[0_0_24px_rgba(16,185,129,0.18)]"
                initial={{ height: 0 }}
                transition={{ delay: index * 0.025, duration: 0.45 }}
              />
              <span className="hidden text-[10px] text-muted-foreground sm:block">
                W{index + 1}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export function MiniChart({
  title,
  values,
}: {
  title: string;
  values: number[];
}) {
  const max = Math.max(...values);

  return (
    <Card className="rounded-lg bg-card/78 py-0">
      <CardContent className="p-5">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <p className="font-semibold text-heading">{title}</p>
            <p className="text-muted-foreground text-xs">Last 6 points</p>
          </div>
          <Activity className="size-4 text-primary" />
        </div>
        <div className="flex h-24 items-end gap-2">
          {values.map((value, index) => (
            <div
              className="flex-1 rounded-t-md bg-primary/65"
              key={`${title}-${value}-${index}`}
              style={{ height: `${(value / max) * 100}%` }}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export function DrawerStat({
  label,
  value,
}: {
  label: ReactNode;
  value: ReactNode;
}) {
  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <p className="text-muted-foreground text-xs">{label}</p>
      <p className="mt-1 font-bold text-heading text-xl">{value}</p>
    </div>
  );
}

export function DetailBlock({
  items,
  title,
}: {
  items: string[];
  title: string;
}) {
  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <p className="mb-3 font-semibold text-heading">{title}</p>
      <div className="space-y-2">
        {items.map((item) => (
          <div className="flex gap-2 text-sm" key={item}>
            <span className="mt-2 size-1.5 shrink-0 rounded-full bg-primary" />
            <span className="text-muted-foreground leading-6">{item}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
