import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { StepProps } from "@/utils/create-static/data";
import { colors } from "@/utils/create-static/data";
import { CheckCircle, Copy } from "lucide-react";

export function Step3EmbedAndSuccess({ state }: StepProps) {
  // Jika agentId sudah ada, tampilkan halaman sukses
  if (state.createdAgentId) {
    const embedCode = `<script src="https://your-domain.com/embed/${state.createdAgentId}.js"></script>`;
    const webhookUrl = `https://your-api.com/webhook/${state.createdAgentId}`;

    return (
      <div className="text-center flex flex-col items-center space-y-6">
        <CheckCircle className="h-16 w-16 text-green-500" />
        <h2
          className="text-2xl font-bold"
          style={{ color: colors.primaryText }}
        >
          Agent Created Successfully!
        </h2>
        <p style={{ color: colors.secondaryText }}>
          Your agent: {state.agentName} is now live. Use the details below to
          integrate it.
        </p>
        <div className="w-full text-left space-y-6 pt-4">
          <div className="grid gap-2">
            <Label style={{ color: colors.primaryText }}>
              Embed Agent on Website
            </Label>
            <div className="flex gap-2">
              <Textarea
                readOnly
                value={embedCode}
                className="font-mono text-xs bg-transparent border-2"
                style={{
                  color: colors.primaryText,
                  borderColor: colors.border,
                }}
              />
              <Button
                variant="outline"
                size="icon"
                onClick={() => navigator.clipboard.writeText(embedCode)}
                style={{
                  backgroundColor: colors.accent,
                  color: colors.primaryText,
                  borderColor: colors.border,
                }}
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div className="grid gap-2">
            <Label style={{ color: colors.primaryText }}>
              Webhook Endpoint
            </Label>
            <div className="flex gap-2">
              <Textarea
                readOnly
                value={webhookUrl}
                className="font-mono text-xs bg-transparent border-2"
                style={{
                  color: colors.primaryText,
                  borderColor: colors.border,
                }}
              />
              <Button
                variant="outline"
                size="icon"
                onClick={() => navigator.clipboard.writeText(webhookUrl)}
                style={{
                  backgroundColor: colors.accent,
                  color: colors.primaryText,
                  borderColor: colors.border,
                }}
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Jika belum, tampilkan pratinjau embed
  return (
    <div className="space-y-8">
      <Card
        className="p-6"
        style={{ backgroundColor: colors.card, borderColor: colors.border }}
      >
        <div className="flex items-center gap-4 mb-4">
          <Avatar className="h-16 w-16">
            <AvatarImage
              src={
                state.avatarFile
                  ? URL.createObjectURL(state.avatarFile)
                  : "https://github.com/shadcn.png"
              }
              alt={state.agentName || "Agent Avatar"}
            />
            <AvatarFallback
              style={{
                backgroundColor: colors.border,
                color: colors.primaryText,
              }}
            >
              AI
            </AvatarFallback>
          </Avatar>
          <div>
            <CardTitle style={{ color: colors.primaryText }}>
              {state.agentName || "Your Agent"}
            </CardTitle>
            <CardDescription style={{ color: colors.secondaryText }}>
              Live Preview
            </CardDescription>
          </div>
        </div>
        <div className="space-y-4">
          {/* Email field and switch removed */}
          <Input
            placeholder="Name"
            className="bg-transparent border-2"
            style={{ color: colors.primaryText, borderColor: colors.border }}
            value={state.agentName}
            readOnly
          />
          <Input
            placeholder="Phone Number"
            className="bg-transparent border-2"
            style={{ color: colors.primaryText, borderColor: colors.border }}
            value={state.twilioNumber}
            readOnly
          />
          <Button
            className="w-full"
            style={{
              backgroundColor: colors.accent,
              color: colors.primaryText,
            }}
          >
            Call Me Now
          </Button>
        </div>
      </Card>
    </div>
  );
}
