import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { FileText, Info } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import DynamicPromptManager from "@/lib/dynamicPromptManager";

const ClaimAssistant = () => {
  const [rejectionReason, setRejectionReason] = useState('');
  const [assistance, setAssistance] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const promptManager = DynamicPromptManager.getInstance();

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
      // Get optimized prompt with dynamic selection
      const { prompt, temperature, max_tokens, promptId } = promptManager.getOptimizedPrompt('claim_assistant', {
        rejection_reason: rejectionReason
      }, {
        // You can add selection criteria here if needed
        // complexity_of_rejection: 'moderate',
        // legal_involvement: 'basic'
      });

      // Create API config
      const apiConfig = promptManager.createApiConfig(prompt, temperature, max_tokens);

      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`, apiConfig);

      if (!response.ok) {
        throw new Error('Failed to get claim assistance');
      }

      const data = await response.json();
      const result = data.candidates[0]?.content?.parts[0]?.text || 'No assistance available';
      
      setAssistance(result);

      toast({
        title: "Assistance Generated",
        description: `Claim help and appeal draft have been created using ${promptId}`,
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

  const formatMarkdown = (text: string) => {
    return text
      .replace(/^## (.*$)/gm, '<h2 class="text-lg font-semibold mb-2 text-gray-800">$1</h2>')
      .replace(/^### (.*$)/gm, '<h3 class="text-md font-semibold mb-2 text-gray-700">$1</h3>')
      .replace(/^- (.*$)/gm, '<ul class="ml-4 mb-1">• $1</ul>')
      .replace(/^\* (.*$)/gm, '<ul class="ml-4 mb-1">• $1</ul>')
      .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold">$1</strong>')
      .replace(/\*(.*?)\*/g, '<em class="italic">$1</em>')
      .replace(/\n\n/g, '<br><br>')
      .replace(/\n/g, '<br>');
  };

  const agentConfig = promptManager.getAgentConfig('claim_assistant');

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-blue-600" />
            {agentConfig.name}
          </CardTitle>
          <CardDescription>
            {agentConfig.description}
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
              disabled={isLoading}
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
                <div 
                  className="prose prose-sm max-w-none"
                  dangerouslySetInnerHTML={{ __html: formatMarkdown(assistance) }}
                />
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ClaimAssistant;
