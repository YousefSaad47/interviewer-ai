import { cn } from "@/lib/utils";

interface HeadingProps {
  children: React.ReactNode;
  className?: string;
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
}

export const Heading: React.FC<HeadingProps> = ({
  as: Tag = "h1",
  children,
  className,
}) => {
  return (
    <Tag
      className={cn(
        "font-semibold text-4xl text-heading tracking-tight md:text-7xl",
        className,
      )}
    >
      {children}
    </Tag>
  );
};
