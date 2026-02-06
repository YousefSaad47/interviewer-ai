import { ArrowRight } from "lucide-react";

import { cn } from "@/lib/utils";

interface FlowButtonProps {
  text?: string;
  className?: string;
}

export const FlowButton: React.FC<FlowButtonProps> = ({ text, className }) => {
  return (
    <button
      className={cn(
        "group border-primary/40 bg-primary hover:border-primary hover:text-primary relative flex cursor-pointer items-center justify-center gap-1 overflow-hidden rounded-[15px] border px-[40.75px] py-[10.19px] text-base font-medium text-white shadow-[0px_1.27px_2.55px_0px_rgba(26,26,26,0.05)] transition-all duration-600 ease-[cubic-bezier(0.23,1,0.32,1)] hover:rounded-xl hover:bg-transparent active:scale-[0.95] md:text-[17.83px]",
        className
      )}
      style={{ fontFamily: "Geist", height: "50.94px" }}
    >
      <ArrowRight className="group-hover:stroke-primary absolute left-[-25%] z-9 h-4 w-4 fill-none stroke-white transition-all duration-800 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:left-4" />

      <span className="relative z-1 -translate-x-3 transition-all duration-300 ease-out group-hover:translate-x-3">
        {text}
      </span>

      <span className="absolute top-1/2 left-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-[50%] bg-white/0 opacity-0 transition-all duration-300 ease-[cubic-bezier(0.19,1,0.22,1)] group-hover:h-55 group-hover:w-55 group-hover:bg-transparent group-hover:opacity-100"></span>

      <ArrowRight className="group-hover:stroke-primary absolute right-4 z-9 h-4 w-4 fill-none stroke-white transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:right-[-25%]" />
    </button>
  );
};
