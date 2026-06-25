import { ArrowRight } from "lucide-react";

import { cn } from "@/lib/utils";

interface FlowButtonProps {
  text?: string;
  className?: string;
}

export const FlowButton: React.FC<FlowButtonProps> = ({ text, className }) => {
  return (
    <button
      type="button"
      className={cn(
        "group relative flex cursor-pointer items-center justify-center gap-1 overflow-hidden rounded-[15px] border border-white/10 bg-gradient-to-r from-indigo-600 via-primary to-indigo-500 bg-[size:200%_auto] px-[40.75px] py-[10.19px] font-medium text-base text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.2),0_4px_15px_rgba(99,130,222,0.3),0_1px_2px_rgba(0,0,0,0.2)] transition-all duration-500 hover:bg-[right_center] hover:rounded-xl hover:border-white/20 hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.25),0_12px_30px_rgba(99,130,222,0.45)] active:scale-[0.96] md:text-[17.83px]",
        className,
      )}
      style={{ fontFamily: "Geist", height: "50.94px" }}
    >
      <ArrowRight className="absolute left-[-25%] z-9 h-4 w-4 fill-none stroke-white transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:left-4" />

      <span className="relative z-1 -translate-x-3 transition-all duration-300 ease-out group-hover:translate-x-3">
        {text}
      </span>

      <span className="absolute top-1/2 left-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-[50%] bg-white/0 opacity-0 transition-all duration-300 ease-[cubic-bezier(0.19,1,0.22,1)] group-hover:h-55 group-hover:w-55 group-hover:bg-white/5 group-hover:opacity-100"></span>

      <ArrowRight className="absolute right-4 z-9 h-4 w-4 fill-none stroke-white transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:right-[-25%]" />
    </button>
  );
};
