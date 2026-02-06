import { cn } from "@/lib/utils";

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
      className={cn("text-paragraph text-lg md:text-xl", className)}
      style={style}
    >
      {children}
    </Tag>
  );
};
