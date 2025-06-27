import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Search, User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const ProductRecommendation = () => {
  const [profile, setProfile] = useState({
    age: '',
    income: '',
    familySize: '',
    coverageGoal: ''
  });
  const [recommendation, setRecommendation] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const getRecommendation = async () => {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    if (!apiKey) {
      toast({
        title: "API Key Missing",
        description: "Please set VITE_GEMINI_API_KEY in your .env file.",
        variant: "destructive",
      });
      return;
    }

    const missingFields = Object.entries(profile).filter(([key, value]) => !value.trim()).map(([key]) => key);
    if (missingFields.length > 0) {
      toast({
        title: "Incomplete Profile",
        description: `Please fill in: ${missingFields.join(', ')}`,
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
              text: `Based on this user profile, recommend the best insurance policies:

Age: ${profile.age}
Annual Income: $${profile.income}
Family Size: ${profile.familySize}
Coverage Goal: ${profile.coverageGoal}

Please provide:
1. TOP RECOMMENDATIONS: 3 specific insurance products/policies
2. REASONING: Why each recommendation fits this profile
3. COVERAGE AMOUNTS: Suggested coverage amounts
4. ESTIMATED COSTS: Approximate monthly/annual premiums
5. PRIORITY ORDER: Which to get first, second, third
6. ADDITIONAL CONSIDERATIONS: Any special factors for this profile

Format your response with clear sections and bullet points.`
            }]
          }]
        })
      });

      if (!response.ok) {
        throw new Error('Failed to get recommendations');
      }

      const data = await response.json();
      const result = data.candidates[0]?.content?.parts[0]?.text || 'No recommendations available';
      setRecommendation(result);
      
      toast({
        title: "Recommendations Generated",
        description: "Personalized insurance recommendations are ready.",
      });
    } catch (error) {
      console.error('Recommendation error:', error);
      toast({
        title: "Request Failed",
        description: "Failed to generate recommendations. Please check your API key and try again.",
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
            <Search className="h-5 w-5 text-green-600" />
            Insurance Product Recommendation
          </CardTitle>
          <CardDescription>
            Get personalized insurance policy recommendations based on your profile
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Age</label>
              <Input
                type="number"
                value={profile.age}
                onChange={(e) => setProfile({...profile, age: e.target.value})}
                placeholder="Your age"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Annual Income ($)</label>
              <Input
                type="number"
                value={profile.income}
                onChange={(e) => setProfile({...profile, income: e.target.value})}
                placeholder="Your annual income"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Family Size</label>
              <Select value={profile.familySize} onValueChange={(value) => setProfile({...profile, familySize: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select family size" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Just me</SelectItem>
                  <SelectItem value="2">2 people</SelectItem>
                  <SelectItem value="3">3 people</SelectItem>
                  <SelectItem value="4">4 people</SelectItem>
                  <SelectItem value="5+">5+ people</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Coverage Goal</label>
              <Select value={profile.coverageGoal} onValueChange={(value) => setProfile({...profile, coverageGoal: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="What do you need?" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="basic">Basic protection</SelectItem>
                  <SelectItem value="family">Family security</SelectItem>
                  <SelectItem value="wealth">Wealth protection</SelectItem>
                  <SelectItem value="retirement">Retirement planning</SelectItem>
                  <SelectItem value="business">Business coverage</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button 
            onClick={getRecommendation} 
            disabled={isLoading}
            className="w-full bg-green-600 hover:bg-green-700"
          >
            {isLoading ? 'Generating Recommendations...' : 'Get Personalized Recommendations'}
          </Button>
        </CardContent>
      </Card>

      {recommendation && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5 text-blue-600" />
              Your Personalized Recommendations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Alert>
              <AlertDescription>
                <pre className="whitespace-pre-wrap text-sm">{recommendation}</pre>
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ProductRecommendation;
