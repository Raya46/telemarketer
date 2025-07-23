'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useRouter } from 'next/navigation';

const steps = [
  { id: 1, name: 'Agent Config' },
  { id: 2, name: 'Customize Behavior' },
  { id: 3, name: 'Embed Agent' },
];

export default function CreateAgentPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const router = useRouter();

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    } else {
      // Finish and redirect
      router.push('/dashboard/agents/1'); // Redirect to a newly created agent page
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    } else {
      router.back();
    }
  };

  const progressValue = (currentStep / steps.length) * 100;

  return (
    <div className="p-4 sm:p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <Progress value={progressValue} className="w-full" />
          <div className="flex justify-between mt-2 text-sm text-gray-500">
            {steps.map((step) => (
              <div key={step.id} className={`text-center ${currentStep >= step.id ? 'font-semibold text-primary' : ''}`}>
                <p>{step.name}</p>
              </div>
            ))}
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{steps[currentStep - 1].name}</CardTitle>
          </CardHeader>
          <CardContent>
            {currentStep === 1 && <Step1AgentConfig />}
            {currentStep === 2 && <Step2CustomizeBehavior />}
            {currentStep === 3 && <Step3EmbedAgent />}
          </CardContent>
        </Card>

        <div className="flex justify-between mt-6">
          <Button variant="outline" onClick={handleBack} >
            {currentStep === 1 ? 'Cancel' : 'Back'}
          </Button>
          <Button onClick={handleNext} className="btn-primary">
            {currentStep === steps.length ? 'Finish & Create Agent' : 'Next'}
          </Button>
        </div>
      </div>
    </div>
  );
}

function Step1AgentConfig() {
  return (
    <div className="grid gap-4">
      <div className="grid gap-2">
        <Label htmlFor="agent-name">Agent Name</Label>
        <Input id="agent-name" placeholder="e.g. Sales Bot"  />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="agent-goal">What is the goal of this agent?</Label>
        <Input id="agent-goal" placeholder="e.g. To book appointments for our sales team"  />
      </div>
    </div>
  );
}

function Step2CustomizeBehavior() {
  return (
    <div className="grid gap-4">
      <p>Customize how your agent behaves and responds.</p>
      {/* Add behavior customization options here */}
    </div>
  );
}

function Step3EmbedAgent() {
  return (
    <div className="grid gap-4">
       <p>Embed your agent on your website or application.</p>
       {/* Add embedding options and code snippets here */}
    </div>
  );
}