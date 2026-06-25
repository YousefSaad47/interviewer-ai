import { Bell, Menu, Search } from "lucide-react";

import { Button } from "@/shared/ui";

import { Avatar } from "./admin-primitives";

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
        <div className="hidden w-full max-w-sm items-center gap-2 rounded-lg border border-input bg-card/70 px-3 py-2 shadow-xs md:flex">
          <Search className="size-4 text-muted-foreground" />
          <input
            className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            placeholder="Search users, sessions, admins"
            type="search"
          />
        </div>
        <Button
          aria-label="Notifications"
          className="h-10 w-10 rounded-lg"
          size="icon"
          variant="outline"
        >
          <Bell className="size-4" />
        </Button>
        <Avatar name="Karim Amin" />
      </div>
    </header>
  );
}
