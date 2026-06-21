import type { ComponentProps } from "react";

import { logger } from "@/lib/logger";
import { emailQueue } from "@/services/bullmq/queues";

import type { ResetPassword, VerifyEmail } from "./templates";

type TemplateName = "verify-email" | "reset-password";

type TemplateProps = {
  "verify-email": ComponentProps<typeof VerifyEmail>;
  "reset-password": ComponentProps<typeof ResetPassword>;
};

export function sendEmail<T extends TemplateName>(
  to: string,
  template: T,
  props: TemplateProps[T],
): void {
  emailQueue
    .add(template, {
      to,
      template,
      props,
    })
    .then((job) => {
      logger.info({ jobId: job.id, to, template }, "Email queued");
    })
    .catch((err) => {
      logger.error({ err, to, template }, "Failed to queue email");
    });
}
