import type { ReactNode } from "react";

import {
  Body,
  Container,
  Head,
  Html,
  Preview,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";

interface EmailLayoutProps {
  preview: string;
  heading: string;
  children: ReactNode;
}

export function EmailLayout({ preview, heading, children }: EmailLayoutProps) {
  return (
    <Html>
      <Head />
      <Preview>{preview}</Preview>
      <Tailwind>
        <Body className="mx-auto my-0 bg-[#000000] font-sans">
          <Container className="mx-auto max-w-[480px] px-0 py-8">
            <Section className="rounded-[20px] border border-[#333333] border-solid bg-[#161B29] px-6 py-8">
              <Section className="mb-6 text-center">
                <Text className="m-0 font-bold text-[#6382DE] text-[24px]">
                  🧠 Interviewer.AI
                </Text>
              </Section>
              <Text className="m-0 mb-4 text-center font-bold text-[#FFFFFF] text-[20px]">
                {heading}
              </Text>
              {children}
              <Section className="my-6 border-[#333333] border-t border-solid" />
              <Text className="m-0 text-center text-[#888888] text-[12px] leading-[20px]">
                Interviewer.AI — AI-Powered Interview Preparation
              </Text>
              <Text className="m-0 mt-1 text-center text-[#666666] text-[11px] leading-[18px]">
                If you did not request this email, you can safely ignore it.
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}
