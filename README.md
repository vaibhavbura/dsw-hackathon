# AI Insurance Agent Platform

AI Insurance Assistant is a multi-agent GenAI platform for solving real-world insurance challenges like fraud detection, claims, and policy clarification.It uses Google’s Gemini model to deliver domain-specific, intelligent responses in real-time.
Built with React and TypeScript, it offers a clean and interactive user experience.

## 🚀 Features

### AI Agents

1. **Fraud Detection Assistant**
   - Analyzes insurance claims and transactions for fraud indicators
   - Provides risk scores and detailed analysis

2. **Customer Support GenAI Agent**
   - Interactive chat interface for insurance-related queries
   - Professional and friendly customer service experience

3. **Insurance Claim Assistant**
   - Helps understand claim rejections
   - Generates professional appeal letters
   - Provides step-by-step guidance for claim processes

4. **Insurance Product Recommendation Agent**
   - Personalized insurance recommendations based on user profile
   - Considers age, income, family size, and coverage goals

5. **Clause Simplifier**
   - Converts complex insurance policy language into plain English
   - Breaks down legal jargon into understandable terms
   - Highlights key points and potential concerns

## 🛠️ Technology Stack

- **Frontend:** React+TypeScript
- **Styling:** Tailwind CSS
- **UI Components:** shadcn/ui
- **AI Model:** Google Gemini API
- **Icons:** Lucide React

## 📋 Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Google Gemini API key

## 🔧 Installation

1. **Clone the repository**
   ```bash
   git clone <your-repository-url>
   cd ai-insurance-agent
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory:
   ```env
   VITE_GEMINI_API_KEY=your-gemini-api-key-here
   ```

4. **Get your Gemini API key**
   - Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Create a new API key
   - Copy the key to your `.env` file

## 🚀 Running the Application

### Development Mode
```bash
npm run dev
```
The application will be available at `http://localhost:8080`

### Build for Production
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```


## 🏗️ Project Structure

```
src/
├── components/
│   ├── ui/                 # shadcn/ui components
│   ├── ChatSupport.tsx     # Customer support agent
│   ├── ClaimAssistant.tsx  # Claim help agent
│   ├── ClauseSimplifier.tsx # Policy simplification agent
│   ├── FraudDetectionAssistant.tsx # Fraud analysis agent
│   └── ProductRecommendation.tsx # Product recommendation agent
├── hooks/                  # Custom React hooks
├── lib/                    # Utility functions
├── pages/                  # Page components
└── App.tsx                 # Main application component
```

## 🔒 Security

- API keys are stored in environment variables
- Never commit `.env` files to version control
- Use `.env.example` as a template for required environment variables

## 🙏 Acknowledgments

- Built with [shadcn/ui](https://ui.shadcn.com/) components
- Powered by [Google Gemini AI](https://ai.google.dev/)
- Icons from [Lucide React](https://lucide.dev/)

