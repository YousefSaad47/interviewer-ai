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
        "relative top-1/2 left-1/2 flex h-[80%] w-[120%] -translate-x-1/2 -translate-y-1/2 items-center justify-center bg-white dark:bg-black"
      )}
    >
      <div
        className={cn(
          "absolute inset-0",
          "[background-size:60px_60px]",
          "[background-image:linear-gradient(to_right,#e4e4e7_1px,transparent_1px),linear-gradient(to_bottom,#e4e4e7_1px,transparent_1px)]",
          "dark:[background-image:linear-gradient(to_right,#262626_1px,transparent_1px),linear-gradient(to_bottom,#262626_1px,transparent_1px)]"
        )}
      />
      {/* Radial gradient for the container to give a faded look */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)] dark:bg-black"></div>
      <div className="relative">{children}</div>
    </div>
  );
};
