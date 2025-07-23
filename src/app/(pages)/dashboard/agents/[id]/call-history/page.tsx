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

export default function CallHistoryPage() {
  return (
    <div className="p-4 sm:p-6 space-y-6">
       <div>
        <h1 className="text-2xl font-bold">Riwayat Panggilan</h1>
        <p className="text-gray-500">
          Lihat dan kelola riwayat panggilan agen di sini.
        </p>
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
                <TableHead>Durasi</TableHead>
                <TableHead>Tanggal</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
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
                  <TableCell>{log.duration}</TableCell>
                  <TableCell>{log.date}</TableCell>
                  <TableCell className="text-right">
                    {/* Tombol "Telepon Kembali" hanya muncul jika statusnya 'failed' atau 'not_answered' */}
                    {(log.status === 'failed' || log.status === 'not_answered') && (
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => alert(`Menelpon kembali ${log.contactName}...`)}
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
