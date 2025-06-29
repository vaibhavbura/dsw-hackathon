import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { BookOpen, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import DynamicPromptManager from "@/lib/dynamicPromptManager";

const ClauseSimplifier = () => {
  const [policyText, setPolicyText] = useState('');
  const [simplifiedText, setSimplifiedText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const promptManager = DynamicPromptManager.getInstance();

  const simplifyClause = async () => {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    if (!apiKey) {
      toast({
        title: "API Key Missing",
        description: "Please set VITE_GEMINI_API_KEY in your .env file.",
        variant: "destructive",
      });
      return;
    }

    if (!policyText.trim()) {
      toast({
        title: "No Policy Text Provided",
        description: "Please enter the insurance policy text you want to simplify.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      // Get optimized prompt with dynamic selection
      const { prompt, temperature, max_tokens, promptId } = promptManager.getOptimizedPrompt('clause_simplifier', {
        policy_text: policyText
      }, {
        // You can add selection criteria here if needed
        // complexity_of_language: 'moderate',
        // legal_importance: 'medium'
      });

      // Create API config
      const apiConfig = promptManager.createApiConfig(prompt, temperature, max_tokens);

      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`, apiConfig);

      if (!response.ok) {
        throw new Error('Failed to simplify policy text');
      }

      const data = await response.json();
      const result = data.candidates[0]?.content?.parts[0]?.text || 'No simplified text available';
      
      setSimplifiedText(result);

      toast({
        title: "Policy Simplified",
        description: `Policy text has been simplified using ${promptId}`,
      });
    } catch (error) {
      console.error('Simplification error:', error);
      toast({
        title: "Request Failed",
        description: "Failed to simplify the policy text. Please check your API key and try again.",
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

  const agentConfig = promptManager.getAgentConfig('clause_simplifier');

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-purple-600" />
            {agentConfig.name}
          </CardTitle>
          <CardDescription>
            {agentConfig.description}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Insurance Policy Text</label>
            <Textarea
              value={policyText}
              onChange={(e) => setPolicyText(e.target.value)}
              placeholder="Paste the complex insurance policy language here..."
              className="min-h-32"
              disabled={isLoading}
            />
          </div>

          <Button 
            onClick={simplifyClause} 
            disabled={isLoading}
            className="w-full bg-purple-600 hover:bg-purple-700"
          >
            {isLoading ? 'Simplifying...' : 'Simplify Policy Language'}
          </Button>
        </CardContent>
      </Card>

      {simplifiedText && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-green-600" />
              Simplified Policy Explanation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Alert>
              <AlertDescription>
                <div 
                  className="prose prose-sm max-w-none"
                  dangerouslySetInnerHTML={{ __html: formatMarkdown(simplifiedText) }}
                />
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ClauseSimplifier;
