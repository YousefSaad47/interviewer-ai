import { cn } from "@/lib/utils";

interface GridBackgroundProps {
  className?: string;
  children?: React.ReactNode;
}

export const GridBackground: React.FC<GridBackgroundProps> = ({
  className,
  children,
}) => {
  return (
    <div
      className={cn(
        className,
        "relative top-1/2 left-1/2 flex h-[80%] w-[120%] -translate-x-1/2 -translate-y-1/2 items-center justify-center bg-transparent",
      )}
    >
      <div
        className={cn(
          "absolute inset-0",
          "[background-size:60px_60px]",
          "[background-image:linear-gradient(to_right,rgba(47,92,214,0.09)_1px,transparent_1px),linear-gradient(to_bottom,rgba(47,92,214,0.09)_1px,transparent_1px)]",
          "dark:[background-image:linear-gradient(to_right,rgba(99,130,222,0.12)_1px,transparent_1px),linear-gradient(to_bottom,rgba(99,130,222,0.12)_1px,transparent_1px)]",
          "[mask-image:radial-gradient(ellipse_at_center,black_50%,transparent_100%)]",
        )}
      />
      <div className="relative">{children}</div>
    </div>
  );
};
