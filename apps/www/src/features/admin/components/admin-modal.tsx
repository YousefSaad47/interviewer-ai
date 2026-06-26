"use client";

import { useEffect, useState } from "react";

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

import {
  usePromoteAdminAccount,
  useRemoveAdminAccess,
  useUpdateAdminAccount,
} from "../hooks";
import type { AdminAccount, AdminAccountRole, AdminModalState } from "../types";

export function AdminModal({
  onClose,
  state,
}: {
  onClose: () => void;
  state: AdminModalState | null;
}) {
  const mode = state?.mode ?? null;
  const admin = state?.admin;
  const promoteMutation = usePromoteAdminAccount();
  const updateMutation = useUpdateAdminAccount();
  const removeMutation = useRemoveAdminAccess();
  const isPending =
    promoteMutation.isPending ||
    updateMutation.isPending ||
    removeMutation.isPending;
  const [userId, setUserId] = useState("");
  const [role, setRole] = useState<AdminAccountRole>("ADMIN");
  const [status, setStatus] = useState<AdminAccount["rawStatus"]>("ACTIVE");

  useEffect(() => {
    if (!state) {
      return;
    }

    setUserId("");
    setRole(state.admin?.rawRole ?? "ADMIN");
    setStatus(state.admin?.rawStatus ?? "ACTIVE");
  }, [state]);

  const submit = () => {
    if (mode === "add") {
      promoteMutation.mutate(
        { userId: userId.trim(), role },
        { onSuccess: onClose },
      );
      return;
    }

    if (mode === "edit" && admin) {
      updateMutation.mutate(
        {
          adminId: admin.id,
          body: { role, status },
        },
        { onSuccess: onClose },
      );
      return;
    }

    if (mode === "delete" && admin) {
      removeMutation.mutate(admin.id, { onSuccess: onClose });
    }
  };

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
                  : mode === "add"
                    ? "Promote an existing user by ID."
                    : "Set the admin access level and status."}
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
                <Button
                  disabled={isPending || !admin}
                  onClick={submit}
                  variant="destructive"
                >
                  Delete admin
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {mode === "add" ? (
                <div className="grid gap-2">
                  <Label htmlFor="admin-user-id">User ID</Label>
                  <Input
                    id="admin-user-id"
                    onChange={(event) => setUserId(event.target.value)}
                    placeholder="Existing user UUID"
                    value={userId}
                  />
                </div>
              ) : (
                <div className="grid gap-2">
                  <Label htmlFor="admin-email">Email</Label>
                  <Input disabled id="admin-email" value={admin?.email ?? ""} />
                </div>
              )}
              <div className="grid gap-2">
                <Label>Role</Label>
                <Select
                  onValueChange={(value) => setRole(value as AdminAccountRole)}
                  value={role}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="SUPER_ADMIN">Super Admin</SelectItem>
                    <SelectItem value="ADMIN">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {mode === "edit" && (
                <div className="grid gap-2">
                  <Label>Status</Label>
                  <Select
                    onValueChange={(value) =>
                      setStatus(value as AdminAccount["rawStatus"])
                    }
                    value={status}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ACTIVE">Active</SelectItem>
                      <SelectItem value="DISABLED">Disabled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
              <div className="flex justify-end gap-2 pt-2">
                <Button onClick={onClose} variant="outline">
                  Cancel
                </Button>
                <Button
                  disabled={isPending || (mode === "add" && !userId.trim())}
                  onClick={submit}
                >
                  {mode === "edit" ? "Save changes" : "Add admin"}
                </Button>
              </div>
            </div>
          )}
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
