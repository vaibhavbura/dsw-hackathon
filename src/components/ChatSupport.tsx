import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { MessageCircle, Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import DynamicPromptManager from "@/lib/dynamicPromptManager";

const ChatSupport = () => {
  const [userQuestion, setUserQuestion] = useState('');
  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const promptManager = DynamicPromptManager.getInstance();

  const getSupport = async () => {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    if (!apiKey) {
      toast({
        title: "API Key Missing",
        description: "Please set VITE_GEMINI_API_KEY in your .env file.",
        variant: "destructive",
      });
      return;
    }

    if (!userQuestion.trim()) {
      toast({
        title: "No Question Provided",
        description: "Please enter your insurance-related question.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      // Get optimized prompt with dynamic selection
      const { prompt, temperature, max_tokens, promptId } = promptManager.getOptimizedPrompt('chat_support', {
        user_question: userQuestion
      }, {
        // You can add selection criteria here if needed
        // question_complexity: 'moderate',
        // customer_expertise_level: 'intermediate'
      });

      // Create API config
      const apiConfig = promptManager.createApiConfig(prompt, temperature, max_tokens);

      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`, apiConfig);

      if (!response.ok) {
        throw new Error('Failed to get support response');
      }

      const data = await response.json();
      const result = data.candidates[0]?.content?.parts[0]?.text || 'No response available';
      
      setResponse(result);

      toast({
        title: "Response Generated",
        description: `Support response generated using ${promptId}`,
      });
    } catch (error) {
      console.error('Support error:', error);
      toast({
        title: "Request Failed",
        description: "Failed to generate support response. Please check your API key and try again.",
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

  const agentConfig = promptManager.getAgentConfig('chat_support');

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5 text-blue-600" />
            {agentConfig.name}
          </CardTitle>
          <CardDescription>
            {agentConfig.description}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Your Question</label>
            <Textarea
              value={userQuestion}
              onChange={(e) => setUserQuestion(e.target.value)}
              placeholder="Ask any insurance-related question..."
              className="min-h-32"
              disabled={isLoading}
            />
          </div>

          <Button 
            onClick={getSupport} 
            disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-700"
          >
            {isLoading ? 'Getting Response...' : 'Get Support'}
          </Button>
        </CardContent>
      </Card>

      {response && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Send className="h-5 w-5 text-green-600" />
              Support Response
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Alert>
              <AlertDescription>
                <div 
                  className="prose prose-sm max-w-none"
                  dangerouslySetInnerHTML={{ __html: formatMarkdown(response) }}
                />
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ChatSupport;
