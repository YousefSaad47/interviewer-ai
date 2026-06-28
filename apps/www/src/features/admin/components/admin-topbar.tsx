import { Menu } from "lucide-react";

import { Button } from "@/shared/ui";

export function AdminTopbar({
  title,
  onOpenSidebar,
}: {
  title: string | undefined;
  onOpenSidebar: () => void;
}) {
  return (
    <header className="sticky top-0 z-30 border-border/70 border-b bg-background/78 backdrop-blur-xl">
      <div className="flex h-20 items-center gap-3 px-4 sm:px-6 lg:px-8">
        <Button
          aria-label="Open admin navigation"
          className="h-10 w-10 rounded-lg lg:hidden"
          onClick={onOpenSidebar}
          size="icon"
          variant="outline"
        >
          <Menu className="size-4" />
        </Button>
        <div className="min-w-0 flex-1">
          <p className="font-medium text-muted-foreground text-xs uppercase">
            Admin dashboard
          </p>
          <h1 className="truncate font-bold text-2xl text-heading tracking-tight">
            {title}
          </h1>
        </div>
      </div>
    </header>
  );
}
