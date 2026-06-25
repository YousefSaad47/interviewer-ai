import { cn } from "@/lib";

interface SubheadingProps {
  className?: string;
  children: React.ReactNode;
  as?: "h2" | "h3" | "h4" | "h5" | "h6" | "p" | "span" | "div";
}

export const SubHeading: React.FC<SubheadingProps> = ({
  className,
  children,
  as: Tag = "h2",
}) => {
  return (
    <Tag
      className={cn(
        "font-medium text-2xl text-subheading tracking-tight md:text-4xl",
        className,
      )}
    >
      {children}
    </Tag>
  );
};
