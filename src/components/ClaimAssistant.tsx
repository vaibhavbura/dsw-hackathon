import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { FileText, Info } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const ClaimAssistant = () => {
  const [rejectionReason, setRejectionReason] = useState('');
  const [assistance, setAssistance] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const getClaimHelp = async () => {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    if (!apiKey) {
      toast({
        title: "API Key Missing",
        description: "Please set VITE_GEMINI_API_KEY in your .env file.",
        variant: "destructive",
      });
      return;
    }

    if (!rejectionReason.trim()) {
      toast({
        title: "No Information Provided",
        description: "Please enter your claim rejection details.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `Help me understand this insurance claim rejection and draft an appeal. Here's the rejection reason:

${rejectionReason}

Please provide:
1. SIMPLE EXPLANATION: Explain the rejection reason in plain English
2. WHY THIS HAPPENED: Common reasons for this type of rejection
3. APPEAL STRATEGY: Steps to take for an appeal
4. DRAFT APPEAL LETTER: A professional appeal letter template

Format your response clearly with these sections.`
            }]
          }]
        })
      });

      if (!response.ok) {
        throw new Error('Failed to get claim assistance');
      }

      const data = await response.json();
      const result = data.candidates[0]?.content?.parts[0]?.text || 'No assistance available';
      setAssistance(result);
      
      toast({
        title: "Assistance Generated",
        description: "Claim help and appeal draft have been created.",
      });
    } catch (error) {
      console.error('Assistance error:', error);
      toast({
        title: "Request Failed",
        description: "Failed to generate assistance. Please check your API key and try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-blue-600" />
            Insurance Claim Assistant
          </CardTitle>
          <CardDescription>
            Get help understanding claim rejections and draft professional appeals
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Claim Rejection Details</label>
            <Textarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="Paste your claim rejection letter or describe why your claim was denied..."
              className="min-h-32"
            />
          </div>

          <Button 
            onClick={getClaimHelp} 
            disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-700"
          >
            {isLoading ? 'Generating Help...' : 'Get Claim Assistance'}
          </Button>
        </CardContent>
      </Card>

      {assistance && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Info className="h-5 w-5 text-green-600" />
              Claim Assistance & Appeal Draft
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Alert>
              <AlertDescription>
                <pre className="whitespace-pre-wrap text-sm">{assistance}</pre>
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ClaimAssistant;
