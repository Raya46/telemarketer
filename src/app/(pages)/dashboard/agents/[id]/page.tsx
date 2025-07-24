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

const colors = {
  background: "#1C162C",
  card: "#2A2342",
  primaryText: "#E0DDF1",
  secondaryText: "#A09CB9",
  accent: "#7F56D9",
  accentHover: "#6941C6",
  border: "#423966",
};

// --- Tipe Data & Data Rekaan ---

type CallStatus = "success" | "failed" | "pending" | "not_answered";

interface CallLog {
  id: string;
  contactName: string;
  contactNumber: string;
  status: CallStatus;
  duration: string;
  date: string;
}

const callLogs: CallLog[] = [
  { id: "1", contactName: "Andi Budianto", contactNumber: "+6281234567890", status: "success", duration: "3m 45s", date: "July 22, 2025" },
  { id: "2", contactName: "Citra Lestari", contactNumber: "+6281234567891", status: "failed", duration: "0m 30s", date: "July 22, 2025" },
  { id: "3", contactName: "Dewi Sartika", contactNumber: "+6281234567892", status: "not_answered", duration: "0m 0s", date: "July 22, 2025" },
  { id: "4", contactName: "Eko Prasetyo", contactNumber: "+6281234567893", status: "success", duration: "5m 10s", date: "July 21, 2025" },
  { id: "5", contactName: "Fitriani", contactNumber: "+6281234567894", status: "pending", duration: "N/A", date: "July 21, 2025" },
  { id: "6", contactName: "Guntur Wibowo", contactNumber: "+6281234567895", status: "success", duration: "2m 5s", date: "July 20, 2025" },
  { id: "7", contactName: "Hesti Puspita", contactNumber: "+6281234567896", status: "not_answered", duration: "0m 0s", date: "July 20, 2025" },
];

// --- Komponen Helper ---

const StatusBadge = ({ status }: { status: CallStatus }) => {
  const statusConfig = {
    success: { icon: <Check className="h-3 w-3" />, text: "Success", color: "bg-green-100 text-green-800" },
    failed: { icon: <X className="h-3 w-3" />, text: "Failed", color: "bg-red-100 text-red-800" },
    pending: { icon: <Clock className="h-3 w-3" />, text: "Pending", color: "bg-yellow-100 text-yellow-800" },
    not_answered: { icon: <PhoneMissed className="h-3 w-3" />, text: "Not Answered", color: "bg-gray-100 text-gray-800" },
  };

  const config = statusConfig[status];

  return (
    <Badge variant="outline" className={`gap-1.5 ${config.color}`} style={{ borderColor: colors.border, color: colors.primaryText }}>
      {config.icon}
      {config.text}
    </Badge>
  );
};

// --- Komponen Utama ---

export default function AgentDetailPage({ params }: { params: { id: string } }) {
  // Kalkulasi statistik dari data rekaan
  const totalCalls = callLogs.length;
  const successfulCalls = callLogs.filter(call => call.status === 'success').length;
  const successRate = totalCalls > 0 ? (successfulCalls / totalCalls) * 100 : 0;

  // Data untuk bar chart
  const chartData = [
    { name: 'Success', count: successfulCalls, fill: colors.accent },
    { name: 'Failed', count: callLogs.filter(call => call.status === 'failed').length, fill: colors.accentHover },
    { name: 'Not Answered', count: callLogs.filter(call => call.status === 'not_answered').length, fill: colors.secondaryText },
    { name: 'Pending', count: callLogs.filter(call => call.status === 'pending').length, fill: colors.border },
  ];

  return (
    <div
      className="min-h-screen p-4 sm:p-6 space-y-6"
      style={{ backgroundColor: colors.background }}
    >
      <div>
        <h1 className="text-2xl font-bold" style={{ color: colors.primaryText }}>Agent Overview</h1>
        <p className="text-gray-500" style={{ color: colors.secondaryText }}>
          Displaying analytics for agent <span className="font-mono font-medium" style={{ color: colors.primaryText }}>{params.id}</span>
        </p>
      </div>

      {/* Kartu Statistik */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card style={{ backgroundColor: colors.card, borderColor: colors.border }}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium" style={{ color: colors.primaryText }}>Total Panggilan</CardTitle>
            <Phone className="h-4 w-4" style={{ color: colors.secondaryText }} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" style={{ color: colors.primaryText }}>{totalCalls}</div>
            <p className="text-xs text-muted-foreground" style={{ color: colors.secondaryText }}>Total panggilan yang dilakukan</p>
          </CardContent>
        </Card>
        <Card style={{ backgroundColor: colors.card, borderColor: colors.border }}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium" style={{ color: colors.primaryText }}>Panggilan Berhasil</CardTitle>
            <Check className="h-4 w-4" style={{ color: colors.secondaryText }} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" style={{ color: colors.primaryText }}>{successfulCalls}</div>
            <p className="text-xs text-muted-foreground" style={{ color: colors.secondaryText }}>Panggilan dengan status 'success'</p>
          </CardContent>
        </Card>
        <Card style={{ backgroundColor: colors.card, borderColor: colors.border }}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium" style={{ color: colors.primaryText }}>Tingkat Keberhasilan</CardTitle>
            <div className="font-bold" style={{ color: colors.accent }}>%</div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" style={{ color: colors.primaryText }}>{successRate.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground" style={{ color: colors.secondaryText }}>Persentase panggilan berhasil</p>
          </CardContent>
        </Card>
         <Card style={{ backgroundColor: colors.card, borderColor: colors.border }}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium" style={{ color: colors.primaryText }}>Panggilan Gagal</CardTitle>
            <X className="h-4 w-4" style={{ color: colors.secondaryText }} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" style={{ color: colors.primaryText }}>{callLogs.filter(call => call.status === 'failed').length}</div>
            <p className="text-xs text-muted-foreground" style={{ color: colors.secondaryText }}>Panggilan dengan status 'failed'</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Chart Visualisasi */}
        <Card style={{ backgroundColor: colors.card, borderColor: colors.border }}>
          <CardHeader>
            <CardTitle style={{ color: colors.primaryText }}>Ringkasan Status Panggilan</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke={colors.border} />
                <XAxis dataKey="name" fontSize={12} stroke={colors.secondaryText} tick={{ fill: colors.secondaryText }} />
                <YAxis fontSize={12} stroke={colors.secondaryText} tick={{ fill: colors.secondaryText }} />
                <Tooltip cursor={{ fill: colors.accentHover }} contentStyle={{ backgroundColor: colors.card, borderColor: colors.border, color: colors.primaryText }} />
                <Bar dataKey="count" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        
        {/* Placeholder untuk chart lain */}
        <Card style={{ backgroundColor: colors.card, borderColor: colors.border }}>
             <CardHeader>
                <CardTitle style={{ color: colors.primaryText }}>Aktivitas Panggilan</CardTitle>
                <CardDescription style={{ color: colors.secondaryText }}>Placeholder untuk chart aktivitas lainnya.</CardDescription>
             </CardHeader>
             <CardContent className="flex items-center justify-center h-[280px]">
                <p className="text-muted-foreground" style={{ color: colors.secondaryText }}>Chart akan datang</p>
             </CardContent>
        </Card>
      </div>

      {/* Tabel Log Panggilan */}
      <Card style={{ backgroundColor: colors.card, borderColor: colors.border }}>
        <CardHeader>
          <CardTitle style={{ color: colors.primaryText }}>Log Panggilan</CardTitle>
          <CardDescription style={{ color: colors.secondaryText }}>
            Daftar detail dari setiap panggilan yang telah dilakukan oleh agen.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow style={{ color: colors.primaryText, borderColor: colors.border }}>
                <TableHead style={{ color: colors.secondaryText }}>Kontak</TableHead>
                <TableHead style={{ color: colors.secondaryText }}>Status</TableHead>
                <TableHead className="text-right" style={{ color: colors.secondaryText }}>Durasi</TableHead>
                <TableHead className="text-right" style={{ color: colors.secondaryText }}>Tanggal</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {callLogs.map((log) => (
                <TableRow key={log.id} style={{ color: colors.primaryText, borderColor: colors.border }}>
                  <TableCell>
                    <div className="font-medium" style={{ color: colors.primaryText }}>{log.contactName}</div>
                    <div className="text-sm text-muted-foreground" style={{ color: colors.secondaryText }}>
                      {log.contactNumber}
                    </div>
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={log.status} />
                  </TableCell>
                  <TableCell className="text-right" style={{ color: colors.primaryText }}>{log.duration}</TableCell>
                  <TableCell className="text-right" style={{ color: colors.primaryText }}>{log.date}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
