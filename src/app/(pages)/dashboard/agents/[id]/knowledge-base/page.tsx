"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { FileText, Loader2, Save, Trash2, Upload } from "lucide-react";
import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";

const colors = {
  background: "#1C162C",
  card: "#2A2342",
  primaryText: "#E0DDF1",
  secondaryText: "#A09CB9",
  accent: "#7F56D9",
  accentHover: "#6941C6",
  border: "#423966",
  dashedBorder: "#5A5178",
};

// Tipe data untuk file yang diunggah
interface KnowledgeFile {
  id: string;
  name: string;
  size: number; // in bytes
  status: 'processing' | 'ready' | 'error';
}

// Data rekaan untuk system prompt dan file yang sudah ada
const initialSystemPrompt = "1. Greet the user warmly.\n2. Ask about their needs.\n3. Offer to schedule a demo.";
const initialFiles: KnowledgeFile[] = [
    { id: 'file1', name: 'product_catalog.pdf', size: 1200000, status: 'ready' },
    { id: 'file2', name: 'faq_internal.docx', size: 45000, status: 'ready' },
];

export default function KnowledgeBasePage() {
  // State untuk mengelola system prompt dan file
  const [systemPrompt, setSystemPrompt] = useState(initialSystemPrompt);
  const [files, setFiles] = useState<KnowledgeFile[]>(initialFiles);

  // Handler untuk upload file menggunakan react-dropzone
  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newFiles: KnowledgeFile[] = acceptedFiles.map(file => ({
      id: `file-${Date.now()}-${Math.random()}`,
      name: file.name,
      size: file.size,
      status: 'processing',
    }));

    setFiles(prev => [...prev, ...newFiles]);

    // Simulasi proses "learning" oleh AI
    newFiles.forEach(file => {
        setTimeout(() => {
            setFiles(prev => prev.map(f => f.id === file.id ? { ...f, status: 'ready' } : f));
        }, 2000); // Ganti status menjadi 'ready' setelah 2 detik
    });

  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'text/plain': ['.txt'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
    }
  });

  const handleDeleteFile = (id: string) => {
    setFiles(files.filter(file => file.id !== id));
  };
  
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div
      className="min-h-screen p-4 sm:p-6 space-y-6"
      style={{ backgroundColor: colors.background }}
    >
      <div>
        <h1 className="text-2xl font-bold" style={{ color: colors.primaryText }}>
          Knowledge Base
        </h1>
        <p className="text-gray-500" style={{ color: colors.secondaryText }}>
          Kelola system prompt dan dokumen untuk melatih agen AI Anda.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Kolom Kiri: System Prompt */}
        <div className="lg:col-span-2">
          <Card style={{ backgroundColor: colors.card, borderColor: colors.border }}>
            <CardHeader>
              <CardTitle style={{ color: colors.primaryText }}>System Prompt</CardTitle>
              <CardDescription style={{ color: colors.secondaryText }}>
                Ini adalah instruksi inti yang akan selalu diikuti oleh agen Anda.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                value={systemPrompt}
                onChange={(e) => setSystemPrompt(e.target.value)}
                className="min-h-[200px] font-mono text-sm bg-transparent border-2 focus:ring-1 focus:ring-offset-0 focus:ring-offset-transparent"
                placeholder="Masukkan instruksi untuk agen di sini..."
                style={{
                  color: colors.primaryText,
                  borderColor: colors.border,
                }}
              />
            </CardContent>
          </Card>
        </div>

        {/* Kolom Kanan: Dokumen */}
        <div className="space-y-6">
          <Card style={{ backgroundColor: colors.card, borderColor: colors.border }}>
            <CardHeader>
              <CardTitle style={{ color: colors.primaryText }}>Documents</CardTitle>
              <CardDescription style={{ color: colors.secondaryText }}>
                Tambah atau hapus dokumen untuk memperluas pengetahuan agen.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div
                {...getRootProps()}
                className={`flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                  isDragActive ? 'border-primary bg-primary/10' : 'border-gray-300 hover:border-primary/50'
                }`}
                style={{
                  backgroundColor: "transparent",
                  borderColor: colors.dashedBorder,
                }}
              >
                <input {...getInputProps()} />
                <Upload className="h-8 w-8" style={{ color: colors.secondaryText }} />
                <p className="text-sm font-medium" style={{ color: colors.primaryText }}>
                  {isDragActive ? "Lepaskan file di sini..." : "Drag & drop atau klik untuk upload"}
                </p>
                <p className="text-xs" style={{ color: colors.secondaryText }}>PDF, DOCX, TXT (Max 10MB)</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Daftar File yang Diunggah */}
      <Card style={{ backgroundColor: colors.card, borderColor: colors.border }}>
        <CardHeader>
            <CardTitle style={{ color: colors.primaryText }}>Uploaded Documents</CardTitle>
        </CardHeader>
        <CardContent>
            <div className="space-y-3">
                {files.length > 0 ? files.map(file => (
                    <div key={file.id} className="flex items-center justify-between p-3 rounded-md border" style={{ backgroundColor: colors.card, borderColor: colors.border }}>
                        <div className="flex items-center gap-3">
                            <FileText className="h-5 w-5" style={{ color: colors.secondaryText }} />
                            <div>
                                <p className="font-medium text-sm" style={{ color: colors.primaryText }}>{file.name}</p>
                                <p className="text-xs" style={{ color: colors.secondaryText }}>{formatFileSize(file.size)}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            {file.status === 'ready' && <Badge className="bg-green-100 text-green-800" style={{ backgroundColor: colors.accent, color: colors.primaryText }}>Ready</Badge>}
                            {file.status === 'processing' && <Badge className="bg-blue-100 text-blue-800 flex items-center gap-1" style={{ backgroundColor: colors.accent, color: colors.primaryText }}><Loader2 className="h-3 w-3 animate-spin"/> Processing</Badge>}
                            {file.status === 'error' && <Badge variant="destructive" style={{ backgroundColor: colors.accent, color: colors.primaryText }}>Error</Badge>}
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDeleteFile(file.id)}
                              style={{ color: colors.secondaryText }}
                            >
                                <Trash2 className="h-4 w-4 text-red-500" />
                            </Button>
                        </div>
                    </div>
                )) : (
                    <p className="text-sm text-center" style={{ color: colors.secondaryText }}>Belum ada dokumen yang diunggah.</p>
                )}
            </div>
        </CardContent>
      </Card>
      
      <div className="flex justify-end mt-6">
        <Button
          onClick={() => alert('Perubahan disimpan!')}
          style={{ backgroundColor: colors.accent, color: colors.primaryText }}
          onMouseOver={(e) =>
            (e.currentTarget.style.backgroundColor = colors.accentHover)
          }
          onMouseOut={(e) =>
            (e.currentTarget.style.backgroundColor = colors.accent)
          }
        >
            <Save className="mr-2 h-4 w-4" />
            Save Changes
        </Button>
      </div>
    </div>
  );
}
