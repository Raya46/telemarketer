"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Stepper,
  StepperDescription,
  StepperIndicator,
  StepperItem,
  StepperSeparator,
  StepperTrigger,
} from "@/components/ui/stepper";
import { Bot, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";

import { createAgent } from "@/app/(actions)/agents/actions";
import { colors, steps, FormState } from "@/utils/create-static/data";

// Import komponen-komponen langkah
import { Step1AgentConfig } from "@/components/layouts/create-page/step-1";
import { Step2CustomizeBehavior } from "@/components/layouts/create-page/step-2";
import { Step3EmbedAndSuccess } from "@/components/layouts/create-page/step-3";

export default function CreateAgentPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formState, setFormState] = useState<FormState>({
    createdAgentId: null,
    avatarFile: null,
    knowledgeBaseFiles: [],
    agentName: "",
    language: "id",
    voice: "alloy",
    twilioNumber: "",
    useWelcomeMessage: true,
    welcomeMessage: "",
    voicemailMessage: "",
    callRecordings: true,
    agentType: "sales",
    tone: "professional",
    goals: "",
    background: "",
    instructions: "",
    useScript: true,
    script: "",
    includeEmail: true,
  });

  const handleNext = async () => {
    // Lanjut ke step berikutnya jika belum di step terakhir
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
      return;
    }

    // Logika untuk step terakhir (Create Agent)
    if (currentStep === steps.length) {
      setIsSubmitting(true);
      const formData = new FormData();

      // Loop melalui state dan append ke FormData
      Object.entries(formState).forEach(([key, value]) => {
        // Lewati array file, akan ditangani secara terpisah
        if (key === "knowledgeBaseFiles") return;

        if (value instanceof File) {
          formData.append(key, value);
        } else if (typeof value === "boolean") {
          formData.append(key, String(value));
        } else if (value != null && typeof value !== "object") {
          formData.append(key, value as string);
        }
      });

      // DIPERBARUI: Tambahkan setiap file dari array ke FormData
      formState.knowledgeBaseFiles.forEach((file) => {
        // Gunakan nama field yang sama agar server bisa menerimanya sebagai array
        formData.append("knowledgeBaseFiles", file);
      });

      try {
        const result = await createAgent(formData);
        if (result && result.success) {
          setFormState((prevState) => ({
            ...prevState,
            createdAgentId: result.agentId ?? null,
          }));
        } else {
          console.error("An error occurred:", result?.error);
          // TODO: Tampilkan notifikasi error ke pengguna
        }
      } catch (error) {
        console.error("Submission failed:", error);
        // TODO: Tampilkan notifikasi error ke pengguna
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleBack = () => {
    if (isSubmitting) return;
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    } else {
      router.back();
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return <Step1AgentConfig state={formState} setState={setFormState} />;
      case 2:
        return (
          <Step2CustomizeBehavior state={formState} setState={setFormState} />
        );
      case 3:
        return (
          <Step3EmbedAndSuccess state={formState} setState={setFormState} />
        );
      default:
        return null;
    }
  };

  return (
    <div
      className="p-4 sm:p-6 min-h-screen"
      style={{ backgroundColor: colors.background }}
    >
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <Stepper value={currentStep} className="w-full mb-4">
            {steps.map(({ id, name, description }) => (
              <StepperItem key={id} step={id} className="not-last:flex-1">
                <StepperTrigger
                  onClick={() =>
                    !isSubmitting &&
                    !formState.createdAgentId &&
                    setCurrentStep(id)
                  }
                >
                  <div className="flex items-center gap-2">
                    <StepperIndicator
                      style={{
                        backgroundColor:
                          currentStep >= id ? colors.accent : colors.border,
                        color: colors.primaryText,
                      }}
                    />
                    <div>
                      <p style={{ color: colors.primaryText }}>{name}</p>
                      <StepperDescription
                        style={{ color: colors.secondaryText }}
                      >
                        {description}
                      </StepperDescription>
                    </div>
                  </div>
                </StepperTrigger>
                {id < steps.length && (
                  <StepperSeparator
                    style={{
                      backgroundColor:
                        currentStep > id ? colors.accent : colors.border,
                    }}
                  />
                )}
              </StepperItem>
            ))}
          </Stepper>
        </div>

        <Card
          style={{ backgroundColor: colors.card, borderColor: colors.border }}
        >
          <CardHeader>
            <div className="flex items-center gap-3">
              <div
                className="flex h-8 w-8 items-center justify-center rounded-full"
                style={{
                  backgroundColor: colors.accent,
                  color: colors.primaryText,
                }}
              >
                <Bot className="h-5 w-5" />
              </div>
              <CardTitle style={{ color: colors.primaryText }}>
                {/* Pastikan index tidak keluar dari batas */}
                {steps[currentStep - 1]?.name}
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent>{renderStepContent()}</CardContent>
        </Card>

        {/* Tampilkan tombol navigasi hanya jika agen belum dibuat */}
        {!formState.createdAgentId && (
          <div className="flex justify-between mt-6">
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={isSubmitting}
              style={{
                backgroundColor: colors.card,
                color: colors.primaryText,
                borderColor: colors.border,
              }}
            >
              <ChevronLeft className="h-4 w-4 mr-2" />
              {currentStep === 1 ? "Cancel" : "Back"}
            </Button>
            <Button
              onClick={handleNext}
              disabled={isSubmitting}
              style={{
                backgroundColor: colors.accent,
                color: colors.primaryText,
              }}
            >
              {isSubmitting && currentStep === steps.length ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating Agent...
                </>
              ) : (
                <>
                  {currentStep === steps.length
                    ? "Finish & Create Agent"
                    : "Next"}
                  {currentStep < steps.length && (
                    <ChevronRight className="h-4 w-4 ml-2" />
                  )}
                </>
              )}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
