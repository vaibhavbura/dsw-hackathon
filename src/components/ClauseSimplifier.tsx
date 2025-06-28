import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { BookOpen, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const ClauseSimplifier = () => {
  const [policyText, setPolicyText] = useState('');
  const [simplification, setSimplification] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const simplifyClauses = async () => {
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
        title: "No Text Provided",
        description: "Please enter insurance policy text or clauses to simplify.",
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
              text: `Please simplify this insurance policy text into plain English that anyone can understand:

${policyText}

Please format your response using markdown and follow this structure:

## SIMPLIFIED EXPLANATION
Break down the complex language into simple terms.

## KEY POINTS
- Highlight the most important takeaways.

## WHAT THIS MEANS FOR YOU
Explain how this affects the policyholder in practical terms.

## POTENTIAL CONCERNS
Mention anything the policyholder should be cautious about.

## QUESTIONS TO ASK
Suggest what questions the policyholder should ask the insurer.

Keep it friendly, conversational, and free of jargon.`
            }]
          }]
        })
      });

      if (!response.ok) {
        throw new Error('Failed to simplify clauses');
      }

      const data = await response.json();
      const result = data.candidates[0]?.content?.parts[0]?.text || 'No simplification available';
      setSimplification(result);

      toast({
        title: "Simplification Complete",
        description: "Policy clauses have been simplified into plain English.",
      });
    } catch (error) {
      console.error('Simplification error:', error);
      toast({
        title: "Request Failed",
        description: "Failed to simplify clauses. Please check your API key and try again.",
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
      .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold">$1</strong>')
      .replace(/\*(.*?)\*/g, '<em class="italic">$1</em>')
      .replace(/\n\n/g, '<br><br>')
      .replace(/\n/g, '<br>');
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-purple-600" />
            Insurance Clause Simplifier
          </CardTitle>
          <CardDescription>
            Convert complex insurance policy language into simple, understandable English
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Insurance Policy Text</label>
            <Textarea
              value={policyText}
              onChange={(e) => setPolicyText(e.target.value)}
              placeholder="Paste your insurance policy clauses, terms, or any complex insurance text here..."
              className="min-h-40"
              disabled={isLoading}
            />
          </div>

          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Tip:</strong> You can copy and paste text from PDF files, policy documents, 
              or any insurance-related document you need help understanding.
            </p>
          </div>

          <Button 
            onClick={simplifyClauses} 
            disabled={isLoading}
            className="w-full bg-purple-600 hover:bg-purple-700"
          >
            {isLoading ? 'Simplifying...' : 'Simplify Policy Language'}
          </Button>
        </CardContent>
      </Card>

      {simplification && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-green-600" />
              Simplified Explanation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Alert>
              <AlertDescription>
                <div
                  className="prose prose-sm max-w-none"
                  dangerouslySetInnerHTML={{ __html: formatMarkdown(simplification) }}
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
