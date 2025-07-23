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
    <Badge variant="outline" className={`gap-1.5 ${config.color}`}>
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
    { name: 'Success', count: successfulCalls, fill: '#22c55e' },
    { name: 'Failed', count: callLogs.filter(call => call.status === 'failed').length, fill: '#ef4444' },
    { name: 'Not Answered', count: callLogs.filter(call => call.status === 'not_answered').length, fill: '#6b7280' },
    { name: 'Pending', count: callLogs.filter(call => call.status === 'pending').length, fill: '#f59e0b' },
  ];

  return (
    <div className="p-4 sm:p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Agent Overview</h1>
        <p className="text-gray-500">
          Displaying analytics for agent <span className="font-mono font-medium">{params.id}</span>
        </p>
      </div>

      {/* Kartu Statistik */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Panggilan</CardTitle>
            <Phone className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCalls}</div>
            <p className="text-xs text-muted-foreground">Total panggilan yang dilakukan</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Panggilan Berhasil</CardTitle>
            <Check className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{successfulCalls}</div>
            <p className="text-xs text-muted-foreground">Panggilan dengan status 'success'</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tingkat Keberhasilan</CardTitle>
            <div className="text-green-500 font-bold">%</div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{successRate.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">Persentase panggilan berhasil</p>
          </CardContent>
        </Card>
         <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Panggilan Gagal</CardTitle>
            <X className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{callLogs.filter(call => call.status === 'failed').length}</div>
            <p className="text-xs text-muted-foreground">Panggilan dengan status 'failed'</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Chart Visualisasi */}
        <Card>
          <CardHeader>
            <CardTitle>Ringkasan Status Panggilan</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" fontSize={12} />
                <YAxis fontSize={12} />
                <Tooltip />
                <Bar dataKey="count" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        
        {/* Placeholder untuk chart lain */}
        <Card>
             <CardHeader>
                <CardTitle>Aktivitas Panggilan</CardTitle>
                <CardDescription>Placeholder untuk chart aktivitas lainnya.</CardDescription>
             </CardHeader>
             <CardContent className="flex items-center justify-center h-[280px]">
                <p className="text-muted-foreground">Chart akan datang</p>
             </CardContent>
        </Card>
      </div>

      {/* Tabel Log Panggilan */}
      <Card>
        <CardHeader>
          <CardTitle>Log Panggilan</CardTitle>
          <CardDescription>
            Daftar detail dari setiap panggilan yang telah dilakukan oleh agen.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Kontak</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Durasi</TableHead>
                <TableHead className="text-right">Tanggal</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {callLogs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell>
                    <div className="font-medium">{log.contactName}</div>
                    <div className="text-sm text-muted-foreground">
                      {log.contactNumber}
                    </div>
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={log.status} />
                  </TableCell>
                  <TableCell className="text-right">{log.duration}</TableCell>
                  <TableCell className="text-right">{log.date}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
