/** biome-ignore-all lint/complexity/noStaticOnlyClass: mapper namespace follows the module's OOP style */

import type {
  AdminUserDetailsRecord,
  AdminUserListRecord,
  RecentCodingSubmissionRecord,
  RecentInterviewRecord,
  RecentResumeRecord,
} from "./admin-users.repository";
import type {
  AdminUserActivityItem,
  AdminUserDetails,
  AdminUserListItem,
  AdminUserStatusResponse,
} from "./admin-users.schema";
import { ADMIN_USERS_RECENT_ACTIVITY_LIMIT } from "./admin-users.schema";

export class AdminUsersMapper {
  public static toListItem(user: AdminUserListRecord): AdminUserListItem {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      image: user.image,
      emailVerified: user.emailVerified,
      role: user.role,
      status: user.status,
      createdAt: user.createdAt.toISOString(),
      activity: {
        interviews: user._count.interviews,
        codingSessions: user._count.submissions,
        resumes: user._count.resumes,
      },
    };
  }

  public static toDetails(
    user: AdminUserDetailsRecord,
    recentActivity: AdminUserActivityItem[],
  ): AdminUserDetails {
    const latestSession = user.sessions.at(0);

    return {
      ...AdminUsersMapper.toListItem(user),
      updatedAt: user.updatedAt.toISOString(),
      lastLoginAt: latestSession?.updatedAt.toISOString() ?? null,
      recentActivity,
    };
  }

  public static toStatusResponse(user: {
    id: string;
    status: AdminUserStatusResponse["status"];
  }): AdminUserStatusResponse {
    return {
      id: user.id,
      status: user.status,
    };
  }

  public static toRecentActivity(
    interviews: RecentInterviewRecord[],
    submissions: RecentCodingSubmissionRecord[],
    resumes: RecentResumeRecord[],
  ): AdminUserActivityItem[] {
    return [
      ...interviews.map((interview) => ({
        id: interview.id,
        type: "INTERVIEW" as const,
        title: `${interview.category} interview`,
        status: interview.status,
        createdAt: interview.createdAt.toISOString(),
      })),
      ...submissions.map((submission) => ({
        id: submission.id,
        type: "CODING_SUBMISSION" as const,
        title: submission.problem.title,
        status: submission.status,
        createdAt: submission.createdAt.toISOString(),
      })),
      ...resumes.map((resume) => ({
        id: resume.id,
        type: "RESUME" as const,
        title: resume.title,
        status: resume.status,
        createdAt: resume.createdAt.toISOString(),
      })),
    ]
      .sort(
        (left, right) =>
          new Date(right.createdAt).getTime() -
          new Date(left.createdAt).getTime(),
      )
      .slice(0, ADMIN_USERS_RECENT_ACTIVITY_LIMIT);
  }
}
