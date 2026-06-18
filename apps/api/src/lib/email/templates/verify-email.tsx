import { Button, Link, Section, Text } from "@react-email/components";

import { EmailLayout } from "./layout";

interface VerifyEmailProps {
  username: string;
  url: string;
}

export function VerifyEmail({ username, url }: VerifyEmailProps) {
  return (
    <EmailLayout
      preview={`Verify your email for Interviewer.AI`}
      heading="Verify your email"
    >
      <Text className="m-0 mb-4 text-[#CCCCCC] text-[15px] leading-[24px]">
        Hi {username},
      </Text>
      <Text className="m-0 mb-6 text-[#CCCCCC] text-[15px] leading-[24px]">
        Thanks for signing up for Interviewer.AI! Please verify your email
        address by clicking the button below. This link expires in 1 hour.
      </Text>

      <Section className="mb-6 text-center">
        <Button
          href={url}
          className="rounded-[10px] bg-[#6382DE] px-8 py-3 text-center font-semibold text-[#FFFFFF] text-[15px]"
        >
          Verify Email
        </Button>
      </Section>

      <Text className="m-0 text-[#888888] text-[13px] leading-[20px]">
        Or copy and paste this link into your browser:
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
