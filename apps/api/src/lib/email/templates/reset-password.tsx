import { Button, Link, Section, Text } from "@react-email/components";

import { EmailLayout } from "./layout";

interface ResetPasswordProps {
  username: string;
  url: string;
}

export function ResetPassword({ username, url }: ResetPasswordProps) {
  return (
    <EmailLayout
      preview="Reset your Interviewer.AI password"
      heading="Reset your password"
    >
      <Text className="m-0 mb-4 text-[#CCCCCC] text-[15px] leading-[24px]">
        Hi {username},
      </Text>
      <Text className="m-0 mb-6 text-[#CCCCCC] text-[15px] leading-[24px]">
        We received a request to reset your password for your Interviewer.AI
        account. Click the button below to choose a new password. This link
        expires in 1 hour.
      </Text>

      <Section className="mb-6 text-center">
        <Button
          href={url}
          className="rounded-[10px] bg-[#6382DE] px-8 py-3 text-center font-semibold text-[#FFFFFF] text-[15px]"
        >
          Reset Password
        </Button>
      </Section>

      <Text className="m-0 mb-1 text-[#888888] text-[13px] leading-[20px]">
        If you didn't request this, you can safely ignore this email.
      </Text>
      <Link
        href={url}
        className="text-[#6382DE] text-[13px] leading-[20px] underline"
      >
        {url}
      </Link>
    </EmailLayout>
  );
}
