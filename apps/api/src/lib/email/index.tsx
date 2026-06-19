import type { ComponentProps } from "react";

import { render } from "@react-email/components";
import nodemailer from "nodemailer";

import { env } from "@/core/env";
import { logger } from "@/lib/logger";

import { ResetPassword, VerifyEmail } from "./templates";

const transporter = nodemailer.createTransport({
  host: env.MAIL_HOST,
  port: env.MAIL_PORT,
  secure: false,
});

type TemplateName = "verify-email" | "reset-password";

type TemplateProps = {
  "verify-email": ComponentProps<typeof VerifyEmail>;
  "reset-password": ComponentProps<typeof ResetPassword>;
};

type TemplateFn<T extends TemplateName> = (
  props: TemplateProps[T],
) => React.ReactElement;

const templates: {
  [K in TemplateName]: TemplateFn<K>;
} = {
  "verify-email": (props) => <VerifyEmail {...props} />,
  "reset-password": (props) => <ResetPassword {...props} />,
};

function getSubject(template: TemplateName): string {
  switch (template) {
    case "verify-email":
      return "Verify your email — Interviewer.AI";
    case "reset-password":
      return "Reset your password — Interviewer.AI";
  }
}

export async function sendEmailDirect<T extends TemplateName>(
  to: string,
  template: T,
  props: TemplateProps[T],
): Promise<void> {
  const element = templates[template](props);
  const html = await render(element);
  const plainText = await render(element, { plainText: true });

  const info = await transporter.sendMail({
    from: env.MAIL_FROM,
    to,
    subject: getSubject(template),
    html,
    text: plainText,
  });

  logger.info(
    `Email sent: ${info.messageId} → ${to} [${getSubject(template)}]`,
  );
}
