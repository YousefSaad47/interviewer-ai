import { cn } from "@/lib";

interface ParagraphProps {
  children: React.ReactNode;
  className?: string;
  as?: "p" | "span" | "div";
  style?: React.CSSProperties;
}

export const Paragraph: React.FC<ParagraphProps> = ({
  as: Tag = "p",
  children,
  className,
  style,
}) => {
  return (
    <Tag
      className={cn("text-lg text-paragraph md:text-xl", className)}
      style={style}
    >
      {children}
    </Tag>
  );
};
