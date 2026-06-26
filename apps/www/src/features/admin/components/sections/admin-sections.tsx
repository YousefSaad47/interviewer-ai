"use client";

import { useMemo, useState } from "react";

import { MoreHorizontal, Plus, Sparkles } from "lucide-react";

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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Separator,
  Skeleton,
} from "@/shared/ui";

import {
  adminAccounts,
  adminActivity,
  adminFeatureUsage,
  adminInterviews,
  adminResumes,
  adminStats,
  adminUsers,
} from "../../data";
import {
  useAdminCodingSubmissions,
  useAdminInterviews,
  useAdminUsers,
  useDebouncedValue,
  useUpdateAdminUserStatus,
} from "../../hooks";
import type { AdminModalMode, DrawerContent } from "../../types";
import type {
  AdminCodingSubmissionStatus,
  AdminInterviewStatus,
  AdminUserRole,
  AdminUserStatus,
} from "../../types/admin-api.types";
import {
  mapAdminCodingSubmissionListItem,
  mapAdminInterviewListItem,
  mapAdminUserListItem,
} from "../../utils";
import {
  CodingDrawer,
  InterviewDrawer,
  ResumeDrawer,
  UserDrawer,
} from "../admin-drawers";
import {
  ActionMenu,
  Avatar,
  ChartCard,
  ControlledTableFilters,
  DataPanel,
  DifficultyBadge,
  MetricCard,
  MiniChart,
  Pagination,
  RadialScore,
  ResponsiveTable,
  ScorePill,
  StatusBadge,
  TableFilters,
} from "../admin-primitives";

const ADMIN_LIST_LIMIT = 5;

const userStatusOptions = [
  { label: "All statuses", value: "all" },
  { label: "Active", value: "ACTIVE" },
  { label: "Disabled", value: "DISABLED" },
];

const userRoleOptions = [
  { label: "All roles", value: "all" },
  { label: "Users", value: "USER" },
  { label: "Admins", value: "ADMIN" },
  { label: "Super admins", value: "SUPER_ADMIN" },
];

const interviewStatusOptions = [
  { label: "All statuses", value: "all" },
  { label: "Reviewed", value: "COMPLETED" },
  { label: "Processing", value: "IN_PROGRESS" },
  { label: "Flagged", value: "ABANDONED" },
];

const codingStatusOptions = [
  { label: "All statuses", value: "all" },
  { label: "Accepted", value: "ACCEPTED" },
  { label: "Wrong Answer", value: "WRONG_ANSWER" },
  { label: "Runtime Error", value: "RUNTIME_ERROR" },
  { label: "Compile Error", value: "COMPILE_ERROR" },
  { label: "Partial", value: "PARTIAL" },
  { label: "Pending", value: "PENDING" },
];

export function OverviewSection({
  onDrawerOpen,
}: {
  onDrawerOpen: (drawer: DrawerContent) => void;
}) {
  return (
    <div className="space-y-6">
      <section className="overflow-hidden rounded-lg border border-border bg-card/76 shadow-[0_24px_80px_rgba(15,23,42,0.08)] dark:shadow-[0_30px_90px_rgba(0,0,0,0.32)]">
        <div className="grid gap-0 xl:grid-cols-[minmax(0,1fr)_420px]">
          <div className="relative p-6 sm:p-8">
            <div className="absolute top-0 right-0 h-56 w-56 translate-x-20 -translate-y-24 rounded-full bg-primary/18 blur-3xl" />
            <div className="relative max-w-3xl">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 font-semibold text-primary text-xs">
                <Sparkles className="size-3.5" />
                Live operations
              </div>
              <h2 className="font-bold text-3xl text-heading tracking-tight sm:text-4xl">
                The learning system is healthy and growing.
              </h2>
              <p className="mt-3 max-w-2xl text-muted-foreground">
                Monitor practice volume, AI scoring quality, resume usage, and
                admin actions from one calm control surface.
              </p>
            </div>
            <div className="relative mt-8 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              {adminStats.map((stat) => (
                <MetricCard key={stat.label} {...stat} />
              ))}
            </div>
          </div>
          <div className="border-border border-t bg-surface-product/70 p-6 xl:border-t-0 xl:border-l dark:bg-surface-secondary/55">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <p className="font-semibold text-heading">Readiness index</p>
                <p className="text-muted-foreground text-sm">
                  Blended across usage and outcomes
                </p>
              </div>
              <Badge className="bg-primary/10 text-primary" variant="outline">
                +14.2%
              </Badge>
            </div>
            <RadialScore value={87} />
            <div className="mt-6 grid grid-cols-3 gap-2">
              {["Latency 212ms", "Score drift 1.8%", "Uptime 99.98%"].map(
                (item) => (
                  <div
                    className="rounded-lg border border-border bg-card/70 p-3 text-center text-xs"
                    key={item}
                  >
                    {item}
                  </div>
                ),
              )}
            </div>
          </div>
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_390px]">
        <div className="space-y-6">
          <ChartCard
            title="Users Growth"
            caption="Net new accounts across the last 12 weeks"
          />
          <div className="grid gap-6 lg:grid-cols-3">
            <MiniChart
              title="Interview Activity"
              values={[28, 38, 31, 46, 52]}
            />
            <MiniChart title="Coding Activity" values={[44, 39, 55, 61, 70]} />
            <MiniChart title="Resume Activity" values={[18, 24, 22, 29, 37]} />
          </div>
          <RecentSessions onDrawerOpen={onDrawerOpen} />
        </div>
        <div className="space-y-6 xl:sticky xl:top-24 xl:self-start">
          <ActivityCard />
          <LatestUsers onDrawerOpen={onDrawerOpen} />
        </div>
      </div>
    </div>
  );
}

export function UsersSection({
  onDrawerOpen,
}: {
  onDrawerOpen: (drawer: DrawerContent) => void;
}) {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<string>("all");
  const [role, setRole] = useState<string>("all");
  const [page, setPage] = useState(1);
  const debouncedSearch = useDebouncedValue(search);
  const statusMutation = useUpdateAdminUserStatus();

  const query = useMemo(
    () => ({
      limit: ADMIN_LIST_LIMIT,
      page,
      ...(debouncedSearch.trim() && { search: debouncedSearch.trim() }),
      ...(status !== "all" && { status: status as AdminUserStatus }),
      ...(role !== "all" && { role: role as AdminUserRole }),
    }),
    [debouncedSearch, page, role, status],
  );

  const usersQuery = useAdminUsers(query);
  const users = useMemo(
    () => usersQuery.data?.data.map(mapAdminUserListItem) ?? [],
    [usersQuery.data],
  );

  const resetPage = () => setPage(1);

  return (
    <DataPanel
      actions={
        <ControlledTableFilters
          extraSelect={
            <Select
              onValueChange={(value) => {
                setRole(value);
                resetPage();
              }}
              value={role}
            >
              <SelectTrigger className="w-full sm:w-36">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {userRoleOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          }
          onSearchChange={(value) => {
            setSearch(value);
            resetPage();
          }}
          onStatusChange={(value) => {
            setStatus(value);
            resetPage();
          }}
          search={search}
          status={status}
          statusOptions={userStatusOptions}
        />
      }
      title="User directory"
      description="Search, filter, review, and act on user accounts."
    >
      <ResponsiveTable
        columns={[
          "User",
          "Registration",
          "Interviews",
          "Coding",
          "Resumes",
          "Status",
          "",
        ]}
      >
        {usersQuery.isLoading &&
          Array.from({ length: ADMIN_LIST_LIMIT }).map((_, index) => (
            <SkeletonRow colSpan={7} key={`users-loading-${index}`} />
          ))}

        {!usersQuery.isLoading && usersQuery.isError && (
          <MessageRow
            actionLabel="Retry"
            colSpan={7}
            message="Unable to load users."
            onAction={() => usersQuery.refetch()}
          />
        )}

        {!usersQuery.isLoading && !usersQuery.isError && users.length === 0 && (
          <MessageRow
            colSpan={7}
            message={
              search || status !== "all" || role !== "all"
                ? "No users match the current filters."
                : "No users found."
            }
          />
        )}

        {!usersQuery.isLoading &&
          !usersQuery.isError &&
          users.map((user) => {
            const nextStatus =
              user.rawStatus === "ACTIVE" ? "DISABLED" : "ACTIVE";
            const isMutatingThisUser =
              statusMutation.isPending &&
              statusMutation.variables?.userId === user.id;

            return (
              <tr className="admin-row" key={user.id}>
                <td className="admin-cell">
                  <div className="flex items-center gap-3">
                    <Avatar name={user.name} />
                    <div>
                      <p className="font-semibold text-heading text-sm">
                        {user.name}
                      </p>
                      <p className="text-muted-foreground text-xs">
                        {user.email}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="admin-cell">{user.date}</td>
                <td className="admin-cell">{user.interviews}</td>
                <td className="admin-cell">{user.coding}</td>
                <td className="admin-cell">{user.resumes}</td>
                <td className="admin-cell">
                  <StatusBadge status={user.status} />
                </td>
                <td className="admin-cell text-right">
                  <ActionMenu
                    destructive="Delete"
                    disabled={isMutatingThisUser}
                    onPrimary={() =>
                      onDrawerOpen({
                        eyebrow: user.plan,
                        title: user.name,
                        body: (
                          <UserDrawer fetchDetails key={user.id} user={user} />
                        ),
                      })
                    }
                    onSecondary={() =>
                      statusMutation.mutate({
                        userId: user.id,
                        status: nextStatus,
                      })
                    }
                    primary="View details"
                    secondary={
                      isMutatingThisUser
                        ? "Updating..."
                        : nextStatus === "DISABLED"
                          ? "Disable"
                          : "Enable"
                    }
                  />
                </td>
              </tr>
            );
          })}
      </ResponsiveTable>
      <Pagination
        disabled={usersQuery.isFetching}
        onNext={() => setPage((currentPage) => currentPage + 1)}
        onPrevious={() =>
          setPage((currentPage) => Math.max(1, currentPage - 1))
        }
        pagination={usersQuery.data?.pagination}
      />
    </DataPanel>
  );
}

export function InterviewsSection({
  onDrawerOpen,
}: {
  onDrawerOpen: (drawer: DrawerContent) => void;
}) {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<string>("all");
  const [page, setPage] = useState(1);
  const debouncedSearch = useDebouncedValue(search);

  const query = useMemo(
    () => ({
      limit: ADMIN_LIST_LIMIT,
      page,
      ...(debouncedSearch.trim() && { search: debouncedSearch.trim() }),
      ...(status !== "all" && { status: status as AdminInterviewStatus }),
    }),
    [debouncedSearch, page, status],
  );

  const interviewsQuery = useAdminInterviews(query);
  const interviews = useMemo(
    () => interviewsQuery.data?.data.map(mapAdminInterviewListItem) ?? [],
    [interviewsQuery.data],
  );

  const resetPage = () => setPage(1);

  return (
    <DataPanel
      actions={
        <ControlledTableFilters
          onSearchChange={(value) => {
            setSearch(value);
            resetPage();
          }}
          onStatusChange={(value) => {
            setStatus(value);
            resetPage();
          }}
          search={search}
          status={status}
          statusOptions={interviewStatusOptions}
        />
      }
      title="Mock interview sessions"
      description="Review session quality, scores, transcripts, and processing state."
    >
      <ResponsiveTable
        columns={[
          "Interview Type",
          "Candidate",
          "Date",
          "Duration",
          "AI Score",
          "Status",
          "",
        ]}
      >
        {interviewsQuery.isLoading &&
          Array.from({ length: ADMIN_LIST_LIMIT }).map((_, index) => (
            <SkeletonRow colSpan={7} key={`interviews-loading-${index}`} />
          ))}

        {!interviewsQuery.isLoading && interviewsQuery.isError && (
          <MessageRow
            actionLabel="Retry"
            colSpan={7}
            message="Unable to load interviews."
            onAction={() => interviewsQuery.refetch()}
          />
        )}

        {!interviewsQuery.isLoading &&
          !interviewsQuery.isError &&
          interviews.length === 0 && (
            <MessageRow
              colSpan={7}
              message={
                search || status !== "all"
                  ? "No interviews match the current filters."
                  : "No interviews found."
              }
            />
          )}

        {!interviewsQuery.isLoading &&
          !interviewsQuery.isError &&
          interviews.map((interview) => (
            <tr className="admin-row" key={interview.id}>
              <td className="admin-cell font-medium text-heading">
                {interview.type}
              </td>
              <td className="admin-cell">{interview.candidate}</td>
              <td className="admin-cell">{interview.date}</td>
              <td className="admin-cell">{interview.duration}</td>
              <td className="admin-cell">
                <ScorePill value={interview.score} />
              </td>
              <td className="admin-cell">
                <StatusBadge status={interview.status} />
              </td>
              <td className="admin-cell text-right">
                <Button
                  className="rounded-lg"
                  onClick={() =>
                    onDrawerOpen({
                      eyebrow: interview.type,
                      title: `${interview.candidate}'s session`,
                      body: (
                        <InterviewDrawer
                          fetchDetails
                          interview={interview}
                          key={interview.id}
                        />
                      ),
                    })
                  }
                  variant="outline"
                >
                  View session
                </Button>
              </td>
            </tr>
          ))}
      </ResponsiveTable>
      <Pagination
        disabled={interviewsQuery.isFetching}
        onNext={() => setPage((currentPage) => currentPage + 1)}
        onPrevious={() =>
          setPage((currentPage) => Math.max(1, currentPage - 1))
        }
        pagination={interviewsQuery.data?.pagination}
      />
    </DataPanel>
  );
}

export function CodingSection({
  onDrawerOpen,
}: {
  onDrawerOpen: (drawer: DrawerContent) => void;
}) {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<string>("all");
  const [page, setPage] = useState(1);
  const debouncedSearch = useDebouncedValue(search);

  const query = useMemo(
    () => ({
      limit: ADMIN_LIST_LIMIT,
      page,
      ...(debouncedSearch.trim() && { search: debouncedSearch.trim() }),
      ...(status !== "all" && {
        status: status as AdminCodingSubmissionStatus,
      }),
    }),
    [debouncedSearch, page, status],
  );

  const submissionsQuery = useAdminCodingSubmissions(query);
  const submissions = useMemo(
    () =>
      submissionsQuery.data?.data.map(mapAdminCodingSubmissionListItem) ?? [],
    [submissionsQuery.data],
  );

  const resetPage = () => setPage(1);

  return (
    <DataPanel
      actions={
        <ControlledTableFilters
          onSearchChange={(value) => {
            setSearch(value);
            resetPage();
          }}
          onStatusChange={(value) => {
            setStatus(value);
            resetPage();
          }}
          search={search}
          status={status}
          statusOptions={codingStatusOptions}
        />
      }
      title="Coding practice"
      description="Monitor submissions, languages, score quality, and execution state."
    >
      <ResponsiveTable
        columns={[
          "Candidate",
          "Problem",
          "Difficulty",
          "Language",
          "Status",
          "Score",
          "Runtime",
          "Submitted",
          "",
        ]}
      >
        {submissionsQuery.isLoading &&
          Array.from({ length: ADMIN_LIST_LIMIT }).map((_, index) => (
            <SkeletonRow colSpan={9} key={`coding-loading-${index}`} />
          ))}

        {!submissionsQuery.isLoading && submissionsQuery.isError && (
          <MessageRow
            actionLabel="Retry"
            colSpan={9}
            message="Unable to load submissions."
            onAction={() => submissionsQuery.refetch()}
          />
        )}

        {!submissionsQuery.isLoading &&
          !submissionsQuery.isError &&
          submissions.length === 0 && (
            <MessageRow
              colSpan={9}
              message={
                search || status !== "all"
                  ? "No submissions match the current filters."
                  : "No submissions found."
              }
            />
          )}

        {!submissionsQuery.isLoading &&
          !submissionsQuery.isError &&
          submissions.map((submission) => (
            <tr className="admin-row" key={submission.id}>
              <td className="admin-cell">
                <div className="flex items-center gap-3">
                  <Avatar name={submission.candidate} />
                  <div>
                    <p className="font-semibold text-heading text-sm">
                      {submission.candidate}
                    </p>
                    <p className="text-muted-foreground text-xs">
                      {submission.candidateEmail}
                    </p>
                  </div>
                </div>
              </td>
              <td className="admin-cell font-medium text-heading">
                {submission.problem}
              </td>
              <td className="admin-cell">
                <DifficultyBadge difficulty={submission.difficulty} />
              </td>
              <td className="admin-cell">{submission.language}</td>
              <td className="admin-cell">
                <StatusBadge status={submission.status} />
              </td>
              <td className="admin-cell">
                <ScorePill value={submission.score} />
              </td>
              <td className="admin-cell">
                {submission.executionTimeMs !== null
                  ? `${submission.executionTimeMs} ms`
                  : "--"}
              </td>
              <td className="admin-cell">{submission.date}</td>
              <td className="admin-cell text-right">
                <Button
                  className="rounded-lg"
                  onClick={() =>
                    onDrawerOpen({
                      eyebrow: submission.difficulty,
                      title: submission.problem,
                      body: (
                        <CodingDrawer
                          key={submission.id}
                          submission={submission}
                        />
                      ),
                    })
                  }
                  variant="outline"
                >
                  View result
                </Button>
              </td>
            </tr>
          ))}
      </ResponsiveTable>
      <Pagination
        disabled={submissionsQuery.isFetching}
        onNext={() => setPage((currentPage) => currentPage + 1)}
        onPrevious={() =>
          setPage((currentPage) => Math.max(1, currentPage - 1))
        }
        pagination={submissionsQuery.data?.pagination}
      />
    </DataPanel>
  );
}

export function ResumesSection({
  onDrawerOpen,
}: {
  onDrawerOpen: (drawer: DrawerContent) => void;
}) {
  return (
    <DataPanel
      actions={<TableFilters />}
      title="Resume analysis"
      description="Inspect ATS scores, resume previews, skill coverage, and suggestions."
    >
      <ResponsiveTable
        columns={[
          "Candidate",
          "ATS Score",
          "Analysis Date",
          "Status",
          "Target Role",
          "",
        ]}
      >
        {adminResumes.map((resume) => (
          <tr className="admin-row" key={`${resume.candidate}-${resume.role}`}>
            <td className="admin-cell">
              <div className="flex items-center gap-3">
                <Avatar name={resume.candidate} />
                <span className="font-medium text-heading">
                  {resume.candidate}
                </span>
              </div>
            </td>
            <td className="admin-cell">
              <ScorePill value={resume.score} />
            </td>
            <td className="admin-cell">{resume.date}</td>
            <td className="admin-cell">
              <StatusBadge status={resume.status} />
            </td>
            <td className="admin-cell">{resume.role}</td>
            <td className="admin-cell text-right">
              <Button
                className="rounded-lg"
                onClick={() =>
                  onDrawerOpen({
                    eyebrow: resume.role,
                    title: `${resume.candidate}'s resume`,
                    body: <ResumeDrawer resume={resume} />,
                  })
                }
                variant="outline"
              >
                View resume
              </Button>
            </td>
          </tr>
        ))}
      </ResponsiveTable>
      <Pagination />
    </DataPanel>
  );
}

export function AnalyticsSection() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 lg:grid-cols-4">
        {adminStats.map((stat) => (
          <MetricCard key={stat.label} {...stat} />
        ))}
      </div>
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_410px]">
        <div className="space-y-6">
          <ChartCard
            caption="Total user growth, conversion, and active cohorts"
            title="Users"
          />
          <div className="grid gap-6 lg:grid-cols-2">
            <MiniChart title="Interviews" values={[32, 44, 51, 47, 68, 74]} />
            <MiniChart
              title="Coding Sessions"
              values={[49, 58, 72, 66, 81, 96]}
            />
            <MiniChart title="Resume Usage" values={[18, 26, 34, 31, 42, 56]} />
            <MiniChart
              title="Recent Trends"
              values={[60, 54, 66, 79, 83, 91]}
            />
          </div>
        </div>
        <Card className="rounded-lg bg-card/78">
          <CardHeader>
            <CardTitle>Most Used Features</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {adminFeatureUsage.map(([label, value]) => (
              <div key={label}>
                <div className="mb-2 flex justify-between text-sm">
                  <span className="font-medium text-heading">{label}</span>
                  <span className="text-muted-foreground">{value}%</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-primary"
                    style={{ width: `${value}%` }}
                  />
                </div>
              </div>
            ))}
            <Separator />
            <div className="grid gap-3">
              {adminActivity.slice(0, 3).map((item) => (
                <div
                  className="rounded-lg border border-border bg-surface-secondary/55 p-3 text-sm"
                  key={item}
                >
                  {item}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export function AdminsSection({
  onModeChange,
}: {
  onModeChange: (mode: AdminModalMode) => void;
}) {
  return (
    <DataPanel
      actions={
        <Button
          className="gap-2 rounded-lg"
          onClick={() => onModeChange("add")}
        >
          <Plus className="size-4" />
          Add Admin
        </Button>
      }
      title="Admin management"
      description="Manage access, roles, and operational accountability."
    >
      <ResponsiveTable
        columns={["Admin", "Role", "Email", "Status", "Last Login", ""]}
      >
        {adminAccounts.map((admin) => (
          <tr className="admin-row" key={admin.email}>
            <td className="admin-cell">
              <div className="flex items-center gap-3">
                <Avatar name={admin.name} />
                <span className="font-semibold text-heading">{admin.name}</span>
              </div>
            </td>
            <td className="admin-cell">
              <Badge className="bg-primary/10 text-primary" variant="outline">
                {admin.role}
              </Badge>
            </td>
            <td className="admin-cell">{admin.email}</td>
            <td className="admin-cell">
              <StatusBadge status={admin.status} />
            </td>
            <td className="admin-cell">{admin.lastLogin}</td>
            <td className="admin-cell text-right">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    aria-label="Admin actions"
                    size="icon"
                    variant="ghost"
                  >
                    <MoreHorizontal className="size-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => onModeChange("edit")}>
                    Edit admin
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => onModeChange("delete")}
                    variant="destructive"
                  >
                    Delete admin
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </td>
          </tr>
        ))}
      </ResponsiveTable>
    </DataPanel>
  );
}

function RecentSessions({
  onDrawerOpen,
}: {
  onDrawerOpen: (drawer: DrawerContent) => void;
}) {
  return (
    <Card className="rounded-lg bg-card/78">
      <CardHeader>
        <CardTitle>Latest Interview Sessions</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {adminInterviews.slice(0, 3).map((interview) => (
          <button
            className="flex w-full items-center justify-between gap-4 rounded-lg border border-border bg-surface-secondary/40 p-4 text-left transition-colors hover:border-primary/25 hover:bg-accent/60"
            key={`${interview.type}-${interview.candidate}`}
            onClick={() =>
              onDrawerOpen({
                eyebrow: interview.type,
                title: `${interview.candidate}'s session`,
                body: <InterviewDrawer interview={interview} />,
              })
            }
            type="button"
          >
            <div>
              <p className="font-semibold text-heading">
                {interview.candidate}
              </p>
              <p className="text-muted-foreground text-sm">
                {interview.type} - {interview.duration}
              </p>
            </div>
            <ScorePill value={interview.score} />
          </button>
        ))}
      </CardContent>
    </Card>
  );
}

function ActivityCard() {
  return (
    <Card className="rounded-lg bg-card/78">
      <CardHeader>
        <CardTitle>Recent Activities</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {adminActivity.map((item, index) => (
          <div className="flex gap-3" key={item}>
            <div className="mt-1 flex size-7 shrink-0 items-center justify-center rounded-full border border-primary/20 bg-primary/10 text-primary text-xs">
              {index + 1}
            </div>
            <p className="text-sm leading-6">{item}</p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

function LatestUsers({
  onDrawerOpen,
}: {
  onDrawerOpen: (drawer: DrawerContent) => void;
}) {
  return (
    <Card className="rounded-lg bg-card/78">
      <CardHeader>
        <CardTitle>Latest Registered Users</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {adminUsers.slice(0, 4).map((user) => (
          <button
            className="flex w-full items-center gap-3 rounded-lg p-2 text-left transition-colors hover:bg-accent"
            key={user.email}
            onClick={() =>
              onDrawerOpen({
                eyebrow: user.plan,
                title: user.name,
                body: <UserDrawer user={user} />,
              })
            }
            type="button"
          >
            <Avatar name={user.name} />
            <div className="min-w-0 flex-1">
              <p className="truncate font-semibold text-sm">{user.name}</p>
              <p className="truncate text-muted-foreground text-xs">
                {user.email}
              </p>
            </div>
            <StatusBadge status={user.status} />
          </button>
        ))}
      </CardContent>
    </Card>
  );
}

function SkeletonRow({ colSpan }: { colSpan: number }) {
  return (
    <tr className="admin-row">
      <td className="admin-cell" colSpan={colSpan}>
        <Skeleton className="h-11 w-full rounded-lg" />
      </td>
    </tr>
  );
}

function MessageRow({
  actionLabel,
  colSpan,
  message,
  onAction,
}: {
  actionLabel?: string;
  colSpan: number;
  message: string;
  onAction?: () => void;
}) {
  return (
    <tr className="admin-row">
      <td className="admin-cell" colSpan={colSpan}>
        <div className="flex flex-col items-center justify-center gap-3 rounded-lg border border-border border-dashed bg-surface-secondary/35 p-8 text-center">
          <p className="font-medium text-heading text-sm">{message}</p>
          {actionLabel && onAction && (
            <Button className="rounded-lg" onClick={onAction} variant="outline">
              {actionLabel}
            </Button>
          )}
        </div>
      </td>
    </tr>
  );
}
