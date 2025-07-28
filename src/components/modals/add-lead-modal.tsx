"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createLead } from "@/app/(actions)/dashboard/actions";
import { useActionState, useEffect } from "react";
import { useFormStatus } from "react-dom";

const colors = {
  card: "#2A2342",
  primaryText: "#E0DDF1",
  secondaryText: "#A09CB9",
  accent: "#7F56D9",
  border: "#423966",
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button
      type="submit"
      disabled={pending}
      className="w-full font-semibold text-white"
      style={{ backgroundColor: colors.accent }}
    >
      {pending ? "Adding..." : "Add Lead"}
    </Button>
  );
}

export function AddLeadModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  // PERBAIKAN: Menggunakan hook useActionState
  const [state, formAction] = useActionState(createLead, {
    success: false,
    message: "",
  });

  useEffect(() => {
    if (state.success) {
      onClose(); // Tutup modal jika berhasil
    }
  }, [state, onClose]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        style={{ backgroundColor: colors.card, borderColor: colors.border }}
      >
        <DialogHeader>
          <DialogTitle style={{ color: colors.primaryText }}>
            Add New Lead
          </DialogTitle>
        </DialogHeader>
        <form action={formAction} className="space-y-4">
          <div>
            <Label htmlFor="fullName" style={{ color: colors.primaryText }}>
              Full Name
            </Label>
            <Input
              id="fullName"
              name="fullName"
              required
              style={{
                backgroundColor: "transparent",
                color: colors.primaryText,
                borderColor: colors.border,
              }}
            />
          </div>
          <div>
            <Label htmlFor="phoneNumber" style={{ color: colors.primaryText }}>
              Phone Number
            </Label>
            <Input
              id="phoneNumber"
              name="phoneNumber"
              required
              style={{
                backgroundColor: "transparent",
                color: colors.primaryText,
                borderColor: colors.border,
              }}
            />
          </div>
          <div>
            <Label htmlFor="email" style={{ color: colors.primaryText }}>
              Email (Optional)
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              style={{
                backgroundColor: "transparent",
                color: colors.primaryText,
                borderColor: colors.border,
              }}
            />
          </div>
          {state.message && !state.success && (
            <p className="text-sm text-red-500">{state.message}</p>
          )}
          <DialogFooter>
            <SubmitButton />
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
