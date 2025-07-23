"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Copy, Save } from "lucide-react";
import { useState } from "react";

export default function ApiAndFormsPage() {
  const agentId = "agent_12345-abcde-67890";
  const embedCode = `<script src="https://your-domain.com/embed/${agentId}.js"></script>`;
  const webhookUrl = `https://your-api.com/webhook/${agentId}`;
  
  const [copiedEmbed, setCopiedEmbed] = useState(false);
  const [copiedWebhook, setCopiedWebhook] = useState(false);

  const handleCopy = (textToCopy: string, type: 'embed' | 'webhook') => {
    navigator.clipboard.writeText(textToCopy).then(() => {
      if (type === 'embed') {
        setCopiedEmbed(true);
        setTimeout(() => setCopiedEmbed(false), 2000);
      } else {
        setCopiedWebhook(true);
        setTimeout(() => setCopiedWebhook(false), 2000);
      }
    });
  };

  return (
    <div className="p-4 sm:p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">API and Forms</h1>
        <p className="text-gray-500">
          Kelola integrasi API dan formulir untuk agen Anda di sini.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Kartu untuk Embed Agent */}
        <Card>
          <CardHeader>
            <CardTitle>Embed Agent</CardTitle>
            <CardDescription>
              Sematkan widget agen di website Anda dengan menyalin kode ini.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-2">
              <Label htmlFor="embed-code">Embed Code</Label>
              <div className="flex gap-2">
                <Textarea
                  id="embed-code"
                  readOnly
                  value={embedCode}
                  className="font-mono text-xs h-24"
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleCopy(embedCode, 'embed')}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
               {copiedEmbed && <p className="text-xs text-green-600">Copied to clipboard!</p>}
            </div>
          </CardContent>
        </Card>

        {/* Kartu untuk Webhook */}
        <Card>
          <CardHeader>
            <CardTitle>Webhook Endpoint</CardTitle>
            <CardDescription>
              Kirim data ke agen Anda melalui integrasi webhook.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-2">
              <Label htmlFor="webhook-url">Webhook URL</Label>
              <div className="flex gap-2">
                <Textarea
                  id="webhook-url"
                  readOnly
                  value={webhookUrl}
                  className="font-mono text-xs h-24"
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleCopy(webhookUrl, 'webhook')}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
              {copiedWebhook && <p className="text-xs text-green-600">Copied to clipboard!</p>}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-end mt-6">
        <Button onClick={() => alert("Pengaturan disimpan!")}>
          <Save className="mr-2 h-4 w-4" />
          Save Changes
        </Button>
      </div>
    </div>
  );
}
