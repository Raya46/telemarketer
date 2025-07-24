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
import { Button } from "@/components/ui/button";
import { Phone, Check, X, Clock, PhoneMissed, PhoneForwarded } from "lucide-react";

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

export default function CallHistoryPage() {
  return (
    <div
      className="min-h-screen p-4 sm:p-6 space-y-6"
      style={{ backgroundColor: colors.background }}
    >
       <div>
        <h1 className="text-2xl font-bold" style={{ color: colors.primaryText }}>Riwayat Panggilan</h1>
        <p className="text-gray-500" style={{ color: colors.secondaryText }}>
          Lihat dan kelola riwayat panggilan agen di sini.
        </p>
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
              <TableRow style={{ color: colors.primaryText }}>
                <TableHead style={{ color: colors.secondaryText }}>Kontak</TableHead>
                <TableHead style={{ color: colors.secondaryText }}>Status</TableHead>
                <TableHead style={{ color: colors.secondaryText }}>Durasi</TableHead>
                <TableHead style={{ color: colors.secondaryText }}>Tanggal</TableHead>
                <TableHead className="text-right" style={{ color: colors.secondaryText }}>Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {callLogs.map((log) => (
                <TableRow key={log.id} style={{ color: colors.primaryText }}>
                  <TableCell>
                    <div className="font-medium" style={{ color: colors.primaryText }}>{log.contactName}</div>
                    <div className="text-sm text-muted-foreground" style={{ color: colors.secondaryText }}>
                      {log.contactNumber}
                    </div>
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={log.status} />
                  </TableCell>
                  <TableCell style={{ color: colors.primaryText }}>{log.duration}</TableCell>
                  <TableCell style={{ color: colors.primaryText }}>{log.date}</TableCell>
                  <TableCell className="text-right">
                    {/* Tombol "Telepon Kembali" hanya muncul jika statusnya 'failed' atau 'not_answered' */}
                    {(log.status === 'failed' || log.status === 'not_answered') && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => alert(`Menelpon kembali ${log.contactName}...`)}
                        style={{ backgroundColor: colors.accent, color: colors.primaryText, borderColor: colors.border }}
                        onMouseOver={(e) =>
                          (e.currentTarget.style.backgroundColor = colors.accentHover)
                        }
                        onMouseOut={(e) =>
                          (e.currentTarget.style.backgroundColor = colors.accent)
                        }
                      >
                        <PhoneForwarded className="h-4 w-4 mr-2" />
                        Telepon Kembali
                      </Button>
                    )}
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
