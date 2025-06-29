import fraudDetectionPrompts from '../prompts/fraud_detection.json';
import claimAssistantPrompts from '../prompts/claim_assistant.json';
import productRecommendationPrompts from '../prompts/product_recommendation.json';
import clauseSimplifierPrompts from '../prompts/clause_simplifier.json';


export interface PromptConfig {
  id: string;
  name: string;
  description: string;
  prompt: string;
  temperature: number;
  max_tokens: number;
  priority: number;
}

export interface AgentPromptData {
  agent_info: {
    name: string;
    description: string;
    icon: string;
    color: string;
  };
  prompts: PromptConfig[];
  selection_criteria: {
    default_prompt: string;
    factors: string[];
  };
}

export interface PromptSelectionCriteria {
  response_time_requirement?: 'fast' | 'standard' | 'detailed';
  complexity_level?: 'simple' | 'moderate' | 'complex';
  detail_requirement?: 'basic' | 'comprehensive' | 'expert';
  budget_constraints?: 'low' | 'medium' | 'high';
  coverage_complexity?: 'basic' | 'standard' | 'comprehensive';
  income_level?: 'low' | 'medium' | 'high';
  complexity_of_rejection?: 'simple' | 'moderate' | 'complex';
  legal_involvement?: 'none' | 'basic' | 'extensive';
  time_sensitivity?: 'low' | 'medium' | 'high';
  complexity_of_language?: 'simple' | 'moderate' | 'complex';
  legal_importance?: 'low' | 'medium' | 'high';
  time_urgency?: 'low' | 'medium' | 'high';
  question_complexity?: 'simple' | 'moderate' | 'complex';
  response_urgency?: 'low' | 'medium' | 'high';
  customer_expertise_level?: 'beginner' | 'intermediate' | 'expert';
}

class DynamicPromptManager {
  private static instance: DynamicPromptManager;
  private promptData: Record<string, AgentPromptData> = {};

  private constructor() {
    this.promptData = {
      fraud_detection: fraudDetectionPrompts as AgentPromptData,
      claim_assistant: claimAssistantPrompts as AgentPromptData,
      product_recommendation: productRecommendationPrompts as AgentPromptData,
      clause_simplifier: clauseSimplifierPrompts as AgentPromptData,
    };
  }

  public static getInstance(): DynamicPromptManager {
    if (!DynamicPromptManager.instance) {
      DynamicPromptManager.instance = new DynamicPromptManager();
    }
    return DynamicPromptManager.instance;
  }

  /**
   * Get agent configuration
   */
  public getAgentConfig(agentKey: string): AgentPromptData['agent_info'] {
    return this.promptData[agentKey]?.agent_info;
  }

  /**
   * Get all available prompts for an agent
   */
  public getAvailablePrompts(agentKey: string): PromptConfig[] {
    return this.promptData[agentKey]?.prompts || [];
  }

  /**
   * Select the best prompt based on criteria
   */
  public selectBestPrompt(agentKey: string, criteria: PromptSelectionCriteria = {}): PromptConfig {
    const prompts = this.getAvailablePrompts(agentKey);
    if (prompts.length === 0) {
      throw new Error(`No prompts available for agent: ${agentKey}`);
    }

    // If no criteria provided, return default prompt
    if (Object.keys(criteria).length === 0) {
      const defaultPromptId = this.promptData[agentKey]?.selection_criteria?.default_prompt;
      const defaultPrompt = prompts.find(p => p.id === defaultPromptId);
      return defaultPrompt || prompts[0];
    }

    // Score each prompt based on criteria
    const scoredPrompts = prompts.map(prompt => ({
      prompt,
      score: this.calculatePromptScore(agentKey, prompt, criteria)
    }));

    // Sort by score (highest first) and return the best match
    scoredPrompts.sort((a, b) => b.score - a.score);
    return scoredPrompts[0].prompt;
  }

  /**
   * Calculate score for a prompt based on selection criteria
   */
  private calculatePromptScore(agentKey: string, prompt: PromptConfig, criteria: PromptSelectionCriteria): number {
    let score = 0;

    switch (agentKey) {
      case 'fraud_detection':
        score = this.scoreFraudDetectionPrompt(prompt, criteria);
        break;
      case 'claim_assistant':
        score = this.scoreClaimAssistantPrompt(prompt, criteria);
        break;
      case 'product_recommendation':
        score = this.scoreProductRecommendationPrompt(prompt, criteria);
        break;
      case 'clause_simplifier':
        score = this.scoreClauseSimplifierPrompt(prompt, criteria);
        break;
      default:
        score = prompt.priority; // Fallback to priority
    }

    return score;
  }

  private scoreFraudDetectionPrompt(prompt: PromptConfig, criteria: PromptSelectionCriteria): number {
    let score = prompt.priority * 10;

    // Response time requirement
    if (criteria.response_time_requirement === 'fast' && prompt.id.includes('v2')) {
      score += 20;
    } else if (criteria.response_time_requirement === 'detailed' && prompt.id.includes('v3')) {
      score += 20;
    } else if (criteria.response_time_requirement === 'standard' && prompt.id.includes('v1')) {
      score += 20;
    }

    // Complexity level
    if (criteria.complexity_level === 'simple' && prompt.id.includes('v2')) {
      score += 15;
    } else if (criteria.complexity_level === 'complex' && prompt.id.includes('v3')) {
      score += 15;
    } else if (criteria.complexity_level === 'moderate' && prompt.id.includes('v1')) {
      score += 15;
    }

    return score;
  }

  private scoreClaimAssistantPrompt(prompt: PromptConfig, criteria: PromptSelectionCriteria): number {
    let score = prompt.priority * 10;

    // Complexity of rejection
    if (criteria.complexity_of_rejection === 'simple' && prompt.id.includes('v2')) {
      score += 20;
    } else if (criteria.complexity_of_rejection === 'complex' && prompt.id.includes('v3')) {
      score += 20;
    } else if (criteria.complexity_of_rejection === 'moderate' && prompt.id.includes('v1')) {
      score += 20;
    }

    // Legal involvement
    if (criteria.legal_involvement === 'extensive' && prompt.id.includes('v3')) {
      score += 15;
    } else if (criteria.legal_involvement === 'none' && prompt.id.includes('v2')) {
      score += 15;
    } else if (criteria.legal_involvement === 'basic' && prompt.id.includes('v1')) {
      score += 15;
    }

    return score;
  }

  private scoreProductRecommendationPrompt(prompt: PromptConfig, criteria: PromptSelectionCriteria): number {
    let score = prompt.priority * 10;

    // Budget constraints
    if (criteria.budget_constraints === 'low' && prompt.id.includes('v2')) {
      score += 20;
    } else if (criteria.budget_constraints === 'high' && prompt.id.includes('v3')) {
      score += 20;
    } else if (criteria.budget_constraints === 'medium' && prompt.id.includes('v1')) {
      score += 20;
    }

    // Coverage complexity
    if (criteria.coverage_complexity === 'basic' && prompt.id.includes('v2')) {
      score += 15;
    } else if (criteria.coverage_complexity === 'comprehensive' && prompt.id.includes('v3')) {
      score += 15;
    } else if (criteria.coverage_complexity === 'standard' && prompt.id.includes('v1')) {
      score += 15;
    }

    return score;
  }

  private scoreClauseSimplifierPrompt(prompt: PromptConfig, criteria: PromptSelectionCriteria): number {
    let score = prompt.priority * 10;

    // Complexity of language
    if (criteria.complexity_of_language === 'simple' && prompt.id.includes('v2')) {
      score += 20;
    } else if (criteria.complexity_of_language === 'complex' && prompt.id.includes('v3')) {
      score += 20;
    } else if (criteria.complexity_of_language === 'moderate' && prompt.id.includes('v1')) {
      score += 20;
    }

    // Legal importance
    if (criteria.legal_importance === 'high' && prompt.id.includes('v3')) {
      score += 15;
    } else if (criteria.legal_importance === 'low' && prompt.id.includes('v2')) {
      score += 15;
    } else if (criteria.legal_importance === 'medium' && prompt.id.includes('v1')) {
      score += 15;
    }

    return score;
  }

  


  /**
   * Get optimized prompt with variable replacement
   */
  public getOptimizedPrompt(agentKey: string, variables: Record<string, string>, criteria: PromptSelectionCriteria = {}): {
    prompt: string;
    temperature: number;
    max_tokens: number;
    promptId: string;
  } {
    const selectedPrompt = this.selectBestPrompt(agentKey, criteria);
    let prompt = selectedPrompt.prompt;

    // Replace variables in the prompt
    Object.entries(variables).forEach(([key, value]) => {
      const placeholder = `{${key}}`;
      prompt = prompt.replace(new RegExp(placeholder, 'g'), value);
    });

    return {
      prompt,
      temperature: selectedPrompt.temperature,
      max_tokens: selectedPrompt.max_tokens,
      promptId: selectedPrompt.id
    };
  }

  /*
   * Create API configuration for Gemini
   */
  public createApiConfig(prompt: string, temperature: number, maxTokens: number) {
    return {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }],
        generationConfig: {
          temperature: temperature,
          maxOutputTokens: maxTokens,
          topP: 0.8,
          topK: 40
        }
      })
    };
  }

  /**
   * Get project information
   */
  public getProjectInfo() {
    return {
      name: "AI Insurance Assistant Platform",
      description: "Multi-agent GenAI platform for insurance fraud detection, claims assistance, product recommendations, policy clarification, and customer support",
      version: "2.0.0",
      ai_model: "Google Gemini 1.5 Flash",
      framework: "React + TypeScript + Tailwind CSS"
    };
  }
}

export default DynamicPromptManager; 