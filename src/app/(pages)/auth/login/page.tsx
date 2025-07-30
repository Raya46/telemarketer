"use client";

import { login } from "@/app/(actions)/auth/actions";
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

export default function LoginPage() {
  const { pending } = useFormStatus();
  const [errorMessage, dispatch] = useActionState(login, undefined);

  return (
    <div
      className="flex items-center justify-center min-h-screen p-4"
      style={{ backgroundColor: colors.background }}
    >
      {/* Kartu login dengan gaya baru */}
      <Card
        className="w-full max-w-sm border-0"
        style={{ backgroundColor: colors.card }}
      >
        <CardHeader>
          <CardTitle
            className="text-3xl font-bold"
            style={{ color: colors.primaryText }}
          >
            Login
          </CardTitle>
          <CardDescription style={{ color: colors.secondaryText }}>
            Welcome back! Please enter your details.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <form action={dispatch} className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="email" style={{ color: colors.primaryText }}>
                Email
              </Label>
              <Input
                id="email"
                type="email"
                name="email"
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
                id="password"
                type="password"
                name="password"
                required
                className="bg-transparent border-2 focus:ring-1 focus:ring-offset-0 focus:ring-offset-transparent"
                style={{
                  color: colors.primaryText,
                  borderColor: colors.border,
                }}
              />
            </div>
            {/* Menampilkan pesan error jika ada */}
            {errorMessage && (
              <div className="text-sm font-medium text-red-500">
                {errorMessage}
              </div>
            )}
            <Button
              type="submit"
              disabled={pending}
              className="w-full font-semibold text-white transition-colors"
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
              {pending ? "Logging In..." : "Login"}
            </Button>
            <div
              className="mt-4 text-sm text-center"
              style={{ color: colors.secondaryText }}
            >
              Dont have an account?{" "}
              <Link
                href="/auth/register"
                className="underline"
                style={{ color: colors.primaryText }}
              >
                Sign up
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
