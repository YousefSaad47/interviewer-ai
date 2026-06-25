"use client";

import { X } from "lucide-react";
import { Dialog as DialogPrimitive } from "radix-ui";

import {
  Button,
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui";

import type { AdminModalMode } from "../types";

export function AdminModal({
  mode,
  onClose,
}: {
  mode: AdminModalMode | null;
  onClose: () => void;
}) {
  return (
    <DialogPrimitive.Root
      onOpenChange={(open) => !open && onClose()}
      open={!!mode}
    >
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-background/72 backdrop-blur-sm data-[state=closed]:animate-out data-[state=open]:animate-in" />
        <DialogPrimitive.Content className="data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 fixed top-1/2 left-1/2 z-50 w-[calc(100%-2rem)] max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-lg border border-border bg-popover p-6 text-popover-foreground shadow-2xl outline-none data-[state=closed]:animate-out data-[state=open]:animate-in">
          <div className="mb-5 flex items-start justify-between gap-4">
            <div>
              <DialogPrimitive.Title className="font-bold text-heading text-xl">
                {mode === "delete"
                  ? "Delete admin"
                  : mode === "edit"
                    ? "Edit admin"
                    : "Add admin"}
              </DialogPrimitive.Title>
              <DialogPrimitive.Description className="mt-2 text-muted-foreground text-sm">
                {mode === "delete"
                  ? "Remove this admin's dashboard access."
                  : "Set the admin profile and access level."}
              </DialogPrimitive.Description>
            </div>
            <DialogPrimitive.Close asChild>
              <Button aria-label="Close modal" size="icon" variant="ghost">
                <X className="size-4" />
              </Button>
            </DialogPrimitive.Close>
          </div>

          {mode === "delete" ? (
            <div className="space-y-4">
              <div className="rounded-lg border border-destructive/20 bg-destructive/10 p-4 text-destructive text-sm">
                This action revokes access immediately. Existing audit events
                remain visible.
              </div>
              <div className="flex justify-end gap-2">
                <Button onClick={onClose} variant="outline">
                  Cancel
                </Button>
                <Button onClick={onClose} variant="destructive">
                  Delete admin
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="admin-name">Name</Label>
                <Input id="admin-name" placeholder="Admin name" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="admin-email">Email</Label>
                <Input id="admin-email" placeholder="admin@interviewer.ai" />
              </div>
              <div className="grid gap-2">
                <Label>Role</Label>
                <Select defaultValue="admin">
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="super">Super Admin</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="moderator">Moderator</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <Button onClick={onClose} variant="outline">
                  Cancel
                </Button>
                <Button onClick={onClose}>
                  {mode === "edit" ? "Save changes" : "Invite admin"}
                </Button>
              </div>
            </div>
          )}
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
