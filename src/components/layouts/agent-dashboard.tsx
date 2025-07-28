"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Phone, Check, X, Clock, PhoneMissed } from "lucide-react";
import type { CallWithDetails } from "@/app/(actions)/dashboard/actions";

const colors = {
  background: "#1C162C",
  card: "#2A2342",
  primaryText: "#E0DDF1",
  secondaryText: "#A09CB9",
  accent: "#7F56D9",
  accentHover: "#6941C6",
  border: "#423966",
};

type CallOutcome = "completed" | "failed" | "no-answer" | "busy" | "pending";

const StatusBadge = ({ status }: { status: CallOutcome }) => {
  const statusConfig = {
    completed: { icon: <Check className="h-3 w-3" />, text: "Completed" },
    failed: { icon: <X className="h-3 w-3" />, text: "Failed" },
    "no-answer": {
      icon: <PhoneMissed className="h-3 w-3" />,
      text: "No Answer",
    },
    busy: { icon: <Clock className="h-3 w-3" />, text: "Busy" },
    pending: { icon: <Clock className="h-3 w-3" />, text: "Pending" },
  };
  const config = statusConfig[status] || statusConfig.pending;
  return (
    <Badge
      variant="outline"
      className={"gap-1.5"}
      style={{ borderColor: colors.border, color: colors.primaryText }}
    >
      {config.icon}
      {config.text}
    </Badge>
  );
};

export function AgentDashboardClient({
  recentCalls,
  agentId,
}: {
  recentCalls: CallWithDetails[];
  agentId: string;
}) {
  const totalCalls = recentCalls.length;
  const successfulCalls = recentCalls.filter(
    (call) => call.outcome === "completed"
  ).length;
  const successRate = totalCalls > 0 ? (successfulCalls / totalCalls) * 100 : 0;
  const failedCalls = recentCalls.filter(
    (call) => call.outcome === "failed"
  ).length;

  const chartData = [
    { name: "Success", count: successfulCalls, fill: colors.accent },
    { name: "Failed", count: failedCalls, fill: colors.accentHover },
    {
      name: "No Answer",
      count: recentCalls.filter((call) => call.outcome === "no-answer").length,
      fill: colors.secondaryText,
    },
    {
      name: "Busy",
      count: recentCalls.filter((call) => call.outcome === "busy").length,
      fill: colors.border,
    },
  ];

  return (
    <div
      className="min-h-screen p-4 sm:p-6 space-y-6"
      style={{ backgroundColor: colors.background }}
    >
      <div>
        <h1
          className="text-2xl font-bold"
          style={{ color: colors.primaryText }}
        >
          Agent Overview
        </h1>
        <p className="text-gray-500" style={{ color: colors.secondaryText }}>
          Displaying analytics for agent{" "}
          <span
            className="font-mono font-medium"
            style={{ color: colors.primaryText }}
          >
            {agentId}
          </span>
        </p>
      </div>

      {/* Kartu Statistik menggunakan data nyata */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card
          style={{ backgroundColor: colors.card, borderColor: colors.border }}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle
              className="text-sm font-medium"
              style={{ color: colors.primaryText }}
            >
              Total Panggilan
            </CardTitle>
            <Phone
              className="h-4 w-4"
              style={{ color: colors.secondaryText }}
            />
          </CardHeader>
          <CardContent>
            <div
              className="text-2xl font-bold"
              style={{ color: colors.primaryText }}
            >
              {totalCalls}
            </div>
          </CardContent>
        </Card>
        <Card
          style={{ backgroundColor: colors.card, borderColor: colors.border }}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle
              className="text-sm font-medium"
              style={{ color: colors.primaryText }}
            >
              Panggilan Berhasil
            </CardTitle>
            <Check
              className="h-4 w-4"
              style={{ color: colors.secondaryText }}
            />
          </CardHeader>
          <CardContent>
            <div
              className="text-2xl font-bold"
              style={{ color: colors.primaryText }}
            >
              {successfulCalls}
            </div>
          </CardContent>
        </Card>
        <Card
          style={{ backgroundColor: colors.card, borderColor: colors.border }}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle
              className="text-sm font-medium"
              style={{ color: colors.primaryText }}
            >
              Tingkat Keberhasilan
            </CardTitle>
            <div className="font-bold" style={{ color: colors.accent }}>
              %
            </div>
          </CardHeader>
          <CardContent>
            <div
              className="text-2xl font-bold"
              style={{ color: colors.primaryText }}
            >
              {successRate.toFixed(1)}%
            </div>
          </CardContent>
        </Card>
        <Card
          style={{ backgroundColor: colors.card, borderColor: colors.border }}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle
              className="text-sm font-medium"
              style={{ color: colors.primaryText }}
            >
              Panggilan Gagal
            </CardTitle>
            <X className="h-4 w-4" style={{ color: colors.secondaryText }} />
          </CardHeader>
          <CardContent>
            <div
              className="text-2xl font-bold"
              style={{ color: colors.primaryText }}
            >
              {failedCalls}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Chart Visualisasi menggunakan data nyata */}
        <Card
          style={{ backgroundColor: colors.card, borderColor: colors.border }}
        >
          <CardHeader>
            <CardTitle style={{ color: colors.primaryText }}>
              Ringkasan Status Panggilan
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke={colors.border} />
                <XAxis
                  dataKey="name"
                  fontSize={12}
                  stroke={colors.secondaryText}
                  tick={{ fill: colors.secondaryText }}
                />
                <YAxis
                  fontSize={12}
                  stroke={colors.secondaryText}
                  tick={{ fill: colors.secondaryText }}
                />
                <Tooltip
                  cursor={{ fill: colors.accentHover }}
                  contentStyle={{
                    backgroundColor: colors.card,
                    borderColor: colors.border,
                    color: colors.primaryText,
                  }}
                />
                <Bar dataKey="count" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        {/* Placeholder lain */}
      </div>

      {/* Tabel Log Panggilan menggunakan data nyata */}
      <Card
        style={{ backgroundColor: colors.card, borderColor: colors.border }}
      >
        <CardHeader>
          <CardTitle style={{ color: colors.primaryText }}>
            Log Panggilan
          </CardTitle>
          <CardDescription style={{ color: colors.secondaryText }}>
            Daftar detail dari setiap panggilan yang telah dilakukan oleh agen.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow
                style={{
                  color: colors.primaryText,
                  borderColor: colors.border,
                }}
              >
                <TableHead style={{ color: colors.secondaryText }}>
                  Kontak
                </TableHead>
                <TableHead style={{ color: colors.secondaryText }}>
                  Status
                </TableHead>
                <TableHead
                  className="text-right"
                  style={{ color: colors.secondaryText }}
                >
                  Durasi
                </TableHead>
                <TableHead
                  className="text-right"
                  style={{ color: colors.secondaryText }}
                >
                  Tanggal
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentCalls.map((call) => (
                <TableRow
                  key={call.id}
                  style={{
                    color: colors.primaryText,
                    borderColor: colors.border,
                  }}
                >
                  <TableCell>
                    <div
                      className="font-medium"
                      style={{ color: colors.primaryText }}
                    >
                      {call.leads?.full_name || "Unknown Lead"}
                    </div>
                    <div
                      className="text-sm text-muted-foreground"
                      style={{ color: colors.secondaryText }}
                    >
                      {call.leads?.phone_number || "No number"}
                    </div>
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={call.outcome as CallOutcome} />
                  </TableCell>
                  <TableCell
                    className="text-right"
                    style={{ color: colors.primaryText }}
                  >
                    {call.call_duration_seconds
                      ? `${Math.floor(call.call_duration_seconds / 60)}m ${
                          call.call_duration_seconds % 60
                        }s`
                      : "N/A"}
                  </TableCell>
                  <TableCell
                    className="text-right"
                    style={{ color: colors.primaryText }}
                  >
                    {new Date(call.start_time).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
