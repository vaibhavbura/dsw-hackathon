
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import FraudDetectionAssistant from "@/components/FraudDetectionAssistant";
import ClaimAssistant from "@/components/ClaimAssistant";
import ProductRecommendation from "@/components/ProductRecommendation";
import ClauseSimplifier from "@/components/ClauseSimplifier";
import ChatSupport from "@/components/ChatSupport";
import { Shield, FileText, Search, BookOpen, MessageCircle } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <Shield className="h-12 w-12 text-blue-600 mr-3" />
            <h1 className="text-4xl font-bold text-gray-900">AI Insurance Assistant</h1>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Your comprehensive AI-powered insurance companion for fraud detection, claim assistance, 
            product recommendations, policy clarification, and live chat support.
          </p>
        </div>

        {/* Main Content */}
        <Card className="max-w-6xl mx-auto shadow-2xl">
          <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-lg">
            <CardTitle className="text-2xl text-center">Choose Your AI Assistant</CardTitle>
            <CardDescription className="text-blue-100 text-center">
              Select the service you need help with
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <Tabs defaultValue="fraud" className="w-full">
              <TabsList className="grid w-full grid-cols-5 mb-8">
                <TabsTrigger value="fraud" className="flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  Fraud Detection
                </TabsTrigger>
                <TabsTrigger value="claim" className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Claim Assistant
                </TabsTrigger>
                <TabsTrigger value="recommend" className="flex items-center gap-2">
                  <Search className="h-4 w-4" />
                  Recommendations
                </TabsTrigger>
                <TabsTrigger value="simplify" className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4" />
                  Clause Simplifier
                </TabsTrigger>
                <TabsTrigger value="chat" className="flex items-center gap-2">
                  <MessageCircle className="h-4 w-4" />
                  Chat Support
                </TabsTrigger>
              </TabsList>

              <TabsContent value="fraud">
                <FraudDetectionAssistant />
              </TabsContent>
              
              <TabsContent value="claim">
                <ClaimAssistant />
              </TabsContent>
              
              <TabsContent value="recommend">
                <ProductRecommendation />
              </TabsContent>
              
              <TabsContent value="simplify">
                <ClauseSimplifier />
              </TabsContent>
              
              <TabsContent value="chat">
                <ChatSupport />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-12 text-gray-600">
          <p>Made by Vaibhav Bura ♥</p>
        </div>
      </div>
    </div>
  );
};

export default Index;
