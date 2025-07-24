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

const colors = {
  background: "#1C162C",
  card: "#2A2342",
  primaryText: "#E0DDF1",
  secondaryText: "#A09CB9",
  accent: "#7F56D9",
  accentHover: "#6941C6",
  border: "#423966",
};

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
    <div
      className="min-h-screen p-4 sm:p-6 space-y-6"
      style={{ backgroundColor: colors.background }}
    >
      <div>
        <h1 className="text-2xl font-bold" style={{ color: colors.primaryText }}>
          API and Forms
        </h1>
        <p className="text-gray-500" style={{ color: colors.secondaryText }}>
          Kelola integrasi API dan formulir untuk agen Anda di sini.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Kartu untuk Embed Agent */}
        <Card style={{ backgroundColor: colors.card, borderColor: colors.border }}>
          <CardHeader>
            <CardTitle style={{ color: colors.primaryText }}>Embed Agent</CardTitle>
            <CardDescription style={{ color: colors.secondaryText }}>
              Sematkan widget agen di website Anda dengan menyalin kode ini.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-2">
              <Label htmlFor="embed-code" style={{ color: colors.primaryText }}>Embed Code</Label>
              <div className="flex gap-2">
                <Textarea
                  id="embed-code"
                  readOnly
                  value={embedCode}
                  className="font-mono text-xs h-24 bg-transparent border-2 focus:ring-1 focus:ring-offset-0 focus:ring-offset-transparent"
                  style={{
                    color: colors.primaryText,
                    borderColor: colors.border,
                  }}
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleCopy(embedCode, 'embed')}
                  style={{ backgroundColor: colors.accent, color: colors.primaryText, borderColor: colors.border }}
                  onMouseOver={(e) =>
                    (e.currentTarget.style.backgroundColor = colors.accentHover)
                  }
                  onMouseOut={(e) =>
                    (e.currentTarget.style.backgroundColor = colors.accent)
                  }
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
               {copiedEmbed && <p className="text-xs text-green-600" style={{ color: colors.secondaryText }}>Copied to clipboard!</p>}
            </div>
          </CardContent>
        </Card>

        {/* Kartu untuk Webhook */}
        <Card style={{ backgroundColor: colors.card, borderColor: colors.border }}>
          <CardHeader>
            <CardTitle style={{ color: colors.primaryText }}>Webhook Endpoint</CardTitle>
            <CardDescription style={{ color: colors.secondaryText }}>
              Kirim data ke agen Anda melalui integrasi webhook.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-2">
              <Label htmlFor="webhook-url" style={{ color: colors.primaryText }}>Webhook URL</Label>
              <div className="flex gap-2">
                <Textarea
                  id="webhook-url"
                  readOnly
                  value={webhookUrl}
                  className="font-mono text-xs h-24 bg-transparent border-2 focus:ring-1 focus:ring-offset-0 focus:ring-offset-transparent"
                  style={{
                    color: colors.primaryText,
                    borderColor: colors.border,
                  }}
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleCopy(webhookUrl, 'webhook')}
                  style={{ backgroundColor: colors.accent, color: colors.primaryText, borderColor: colors.border }}
                  onMouseOver={(e) =>
                    (e.currentTarget.style.backgroundColor = colors.accentHover)
                  }
                  onMouseOut={(e) =>
                    (e.currentTarget.style.backgroundColor = colors.accent)
                  }
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
              {copiedWebhook && <p className="text-xs text-green-600" style={{ color: colors.secondaryText }}>Copied to clipboard!</p>}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-end mt-6">
        <Button
          onClick={() => alert("Pengaturan disimpan!")}
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
