# AI Insurance Assistant Platform

A comprehensive AI-powered insurance platform featuring 5 specialized GenAI agents for fraud detection, claims assistance, product recommendations, policy clarification, and customer support.

##  Features

### Dynamic Prompt Selection System
- **Multiple prompt variations** per agent for different use cases
- **Intelligent prompt selection** based on criteria like complexity, urgency, and user expertise
- **Extensible architecture** - easily add new prompts without code changes
- **JSON-based configuration** for easy maintenance and updates

### AI Agents

1. **Fraud Detection Assistant** 
   - Standard fraud analysis with risk scoring
   - Quick risk assessment for high-volume processing

2. **Claim Assistant** 
   - Standard claim rejection analysis and appeal guidance
   - Quick appeal guide for simple rejections

3. **Product Recommendation Agent** 
   - Standard product matching
   - Budget-focused recommendations

4. **Clause Simplifier** 
   - Standard clause simplification
   - Quick translation in simple words


5. **Chat Support Agent** 
   - Standard customer support
   - Quick response

##  Technology Stack

- **Frontend**: React + TypeScript + Tailwind CSS
- **AI Model**: Google Gemini 1.5 Flash
- **UI Components**: shadcn/ui
- **Build Tool**: Vite
- **Prompt Management**: Dynamic JSON-based system

## 📁 Project Structure

```
src/
├── components/          
├── lib/
│   └── dynamicPromptManager.ts  
├── prompts/           
│   ├── fraud_detection.json
│   ├── claim_assistant.json
│   ├── product_recommendation.json
│   ├── clause_simplifier.json
│   └── chat_support.json
└── pages/
    └── Index.tsx       
```

## 🔧 Setup Instructions

1. **Clone the repository**
   ```bash
   git clone https://github.com/vaibhavbura/dsw-hackathon.git
   cd dsw-hackathon
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory:
   ```env
   VITE_GEMINI_API_KEY=your_gemini_api_key_here
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5173`

##  Adding New Prompts


Each agent has its own JSON file in the `src/prompts/` directory. To add a new prompt:

```json
{
  "id": "agent_name_v4",
  "name": "New Prompt Name",
  "description": "Description of what this prompt does",
  "prompt": "Your prompt template with {variables}",
  "temperature": 0.3,
  "max_tokens": 2000,
  "priority": 4
}
```


##  Prompt Selection Logic

The system automatically selects the best prompt based on:

### Fraud Detection
- **Response time requirement**: fast/standard/detailed
- **Complexity level**: simple/moderate/complex

### Claim Assistant
- **Complexity of rejection**: simple/moderate/complex
- **Legal involvement**: none/basic/extensive

### Product Recommendation
- **Budget constraints**: low/medium/high
- **Coverage complexity**: basic/standard/comprehensive

### Clause Simplifier
- **Complexity of language**: simple/moderate/complex
- **Legal importance**: low/medium/high

### Chat Support
- **Question complexity**: simple/moderate/complex
- **Customer expertise level**: beginner/intermediate/expert

##  API Integration

| Parameter       | Purpose                                          | Use Case Examples                                                                                                         |
| --------------- | ------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------- |
| **Temperature** | Controls response creativity and randomness      | `Low (0.2)` → Accurate and focused (e.g., fraud checks)  <br> `High (0.6+)` → Creative and varied (e.g., recommendations) |
| **Max Tokens**  | Limits length of AI output                       | `1000` → Short responses like quick risk assessment <br> `3000+` → Detailed investigation or legal analysis               |
| **Priority**    | Sets base importance of prompt (used in scoring) | `1 = Low`, `2 = Medium`, `3 = High` <br> Higher priority prompts are favored when criteria match is equal                 |


##  Deployment

### Build for Production
```bash
npm run build
```

### Deploy to Vercel
```bash
npm install -g vercel
vercel
```


## Performance

- **Fast response times** - optimized prompt selection
- **Efficient API usage** - appropriate token limits
- **Scalable architecture** - easy to add new agents and prompts




##  Author

**Vaibhav Bura**
- Built for DSW GenAI Agent Hackathon

---



