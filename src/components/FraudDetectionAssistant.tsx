import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Shield, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const FraudDetectionAssistant = () => {
  const [transactionData, setTransactionData] = useState('');
  const [analysis, setAnalysis] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const analyzeForFraud = async () => {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    if (!apiKey) {
      toast({
        title: "API Key Missing",
        description: "Please set VITE_GEMINI_API_KEY in your .env file.",
        variant: "destructive",
      });
      return;
    }

    if (!transactionData.trim()) {
      toast({
        title: "No Data Provided",
        description: "Please enter transaction or claim details to analyze.",
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
              text: `Analyze this insurance transaction/claim data for signs of fraud. Provide a risk score (1-10) and detailed explanation of any suspicious patterns. Format your response in markdown:

${transactionData}

Please format your response as markdown with the following structure:
## RISK SCORE: [1-10]

## FRAUD INDICATORS:
- [List specific suspicious elements]

## EXPLANATION:
[Detailed analysis]

## RECOMMENDATIONS:
[What actions to take]`
            }]
          }]
        })
      });

      if (!response.ok) {
        throw new Error('Failed to analyze data');
      }

      const data = await response.json();
      const result = data.candidates[0]?.content?.parts[0]?.text || 'No analysis available';
      setAnalysis(result);
      
      toast({
        title: "Analysis Complete",
        description: "Fraud detection analysis has been generated.",
      });
    } catch (error) {
      console.error('Analysis error:', error);
      toast({
        title: "Analysis Failed",
        description: "Failed to analyze the data. Please check your API key and try again.",
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
      .replace(/^\* (.*$)/gm, '<ul class="ml-4 mb-1">• $1</ul>')
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
            <Shield className="h-5 w-5 text-red-600" />
            Fraud Detection Assistant
          </CardTitle>
          <CardDescription>
            Analyze insurance claims and transactions for potential fraud indicators
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Transaction/Claim Details</label>
            <Textarea
              value={transactionData}
              onChange={(e) => setTransactionData(e.target.value)}
              placeholder="Enter transaction data, claim details, or any suspicious information you want to analyze..."
              className="min-h-32"
            />
          </div>

          <Button 
            onClick={analyzeForFraud} 
            disabled={isLoading}
            className="w-full bg-red-600 hover:bg-red-700"
          >
            {isLoading ? 'Analyzing...' : 'Analyze for Fraud'}
          </Button>
        </CardContent>
      </Card>

      {analysis && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-orange-600" />
              Fraud Analysis Results
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Alert>
              <AlertDescription>
                <div 
                  className="prose prose-sm max-w-none"
                  dangerouslySetInnerHTML={{ __html: formatMarkdown(analysis) }}
                />
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default FraudDetectionAssistant;
