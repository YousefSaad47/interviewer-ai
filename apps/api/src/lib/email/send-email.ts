import type { ComponentProps } from "react";

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
      console.log(`✅ Email queued: ${job.id} → ${to} [${template}]`);
    })
    .catch((err) => {
      console.error(`❌ Failed to queue email → ${to} [${template}]`, err);
    });
}
