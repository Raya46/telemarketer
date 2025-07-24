"use client";
import { register } from "@/app/(actions)/auth/actions";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";

const colors = {
  background: "#1C162C",
  card: "#2A2342",
  primaryText: "#E0DDF1",
  secondaryText: "#A09CB9",
  accent: "#7F56D9",
  accentHover: "#6941C6",
  border: "#423966",
};

export default function RegisterPage() {
  const [errorMessage, dispatch] = useActionState(register, undefined);
  const { pending } = useFormStatus();

  return (
    <div
      className="flex items-center justify-center min-h-screen p-4"
      style={{ backgroundColor: colors.background }}
    >
      <Card
        className="w-full max-w-sm border-0"
        style={{ backgroundColor: colors.card }}
      >
        <CardHeader>
          <CardTitle
            className="text-3xl font-bold"
            style={{ color: colors.primaryText }}
          >
            Sign Up
          </CardTitle>
          <CardDescription style={{ color: colors.secondaryText }}>
            Enter your information to create an account.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <form action={dispatch} className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="name" style={{ color: colors.primaryText }}>
                Name
              </Label>
              <Input
                name="name"
                id="name"
                placeholder="John Doe"
                required
                className="bg-transparent border-2 focus:ring-1 focus:ring-offset-0 focus:ring-offset-transparent"
                style={{
                  color: colors.primaryText,
                  borderColor: colors.border,
                }}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email" style={{ color: colors.primaryText }}>
                Email
              </Label>
              <Input
                name="email"
                id="email"
                type="email"
                placeholder="m@example.com"
                required
                className="bg-transparent border-2 focus:ring-1 focus:ring-offset-0 focus:ring-offset-transparent"
                style={{
                  color: colors.primaryText,
                  borderColor: colors.border,
                }}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password" style={{ color: colors.primaryText }}>
                Password
              </Label>
              <Input
                name="password"
                id="password"
                type="password"
                required
                className="bg-transparent border-2 focus:ring-1 focus:ring-offset-0 focus:ring-offset-transparent"
                style={{
                  color: colors.primaryText,
                  borderColor: colors.border,
                }}
              />
            </div>
            {errorMessage && (
              <div className="text-sm font-medium text-red-500">
                {errorMessage}
              </div>
            )}
            <Button
              type="submit"
              className="w-full font-semibold text-white transition-colors"
              disabled={pending}
              style={{
                backgroundColor: pending ? colors.accentHover : colors.accent,
              }}
              onMouseOver={(e) =>
                (e.currentTarget.style.backgroundColor = colors.accentHover)
              }
              onMouseOut={(e) =>
                (e.currentTarget.style.backgroundColor = colors.accent)
              }
            >
              {pending ? "Creating Account..." : "Create an Account"}
            </Button>
            <div
              className="mt-4 text-sm text-center"
              style={{ color: colors.secondaryText }}
            >
              Already have an account?{" "}
              <Link
                href="/auth/login"
                className="underline"
                style={{ color: colors.primaryText }}
              >
                Login
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
