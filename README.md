# 🌱 NaijaAgroConnect

**Empowering Nigerian Farmers with AI-Powered Agricultural Solutions**

NaijaAgroConnect is a comprehensive digital platform designed to transform agricultural practices across Nigeria through the power of artificial intelligence. Built with modern web technologies and multilingual support, it bridges the gap between traditional farming and digital innovation.

![NaijaAgroConnect Banner](https://placehold.co/1200x300/558B2F/FFFFFF/png?text=NaijaAgroConnect+-+AI+for+Nigerian+Farmers)

## 🎯 Project Overview

NaijaAgroConnect addresses critical challenges faced by Nigerian farmers by providing:

- **AI-powered crop diagnosis** from plant photos
- **Multilingual voice assistance** in English, Yoruba, Hausa, Igbo, and Pidgin
- **Smart weather forecasting** with agricultural recommendations
- **Farm yield analysis** and profitability projections
- **Community-driven knowledge sharing** platform
- **Educational resources** for sustainable farming practices

## ✨ Features

### 🤖 AI-Powered Tools

- **Crop Diagnosis**: Upload photos of diseased plants for instant AI diagnosis and treatment recommendations
- **Smart Farm Analysis**: Get comprehensive yield predictions, revenue projections, and profitability analysis
- **Weather Intelligence**: Location-based weather forecasts with agricultural recommendations
- **Multilingual AI Assistant**: Chat with "Agbè̩ anko" in your preferred Nigerian language

### 🗣️ Multilingual Support

- **English** - Standard communication
- **Yoruba** - Southwest Nigeria
- **Hausa** - Northern Nigeria  
- **Igbo** - Southeast Nigeria
- **Nigerian Pidgin** - Universal Nigerian dialect

### 🌐 Platform Features

- **Community Forum**: Share knowledge, ask questions, and connect with fellow farmers
- **Learning Center**: Access educational modules on sustainable farming practices
- **Voice Chat**: Speak directly to the AI assistant using your microphone
- **Mobile-Responsive**: Optimized for use on smartphones and tablets
- **Dark/Light Theme**: Comfortable viewing in any lighting condition

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 15.3.3 (React 18)
- **Styling**: Tailwind CSS with custom agricultural theme
- **UI Components**: Radix UI primitives with shadcn/ui
- **Icons**: Lucide React
- **Charts**: Recharts for data visualization
- **Authentication**: Firebase Auth

### Backend & AI
- **AI Framework**: Google AI Genkit
- **AI Model**: Gemini 2.0 Flash
- **Database**: Firebase Firestore
- **Server**: Next.js API routes
- **Language**: TypeScript

### Development Tools
- **Build Tool**: Turbopack (Next.js)
- **Type Checking**: TypeScript 5
- **Code Quality**: ESLint
- **Package Manager**: npm
- **Validation**: Zod schemas

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Firebase project
- Google AI API key

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/kayode96-max/agropal_3mtt.git
   cd agropal_3mtt
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Fill in your Firebase and Google AI credentials:
   ```env
   NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.firebasestorage.app
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
   GOOGLE_AI_API_KEY=your_google_ai_api_key
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Start the AI development server** (in another terminal)
   ```bash
   npm run genkit:dev
   ```

The application will be available at `http://localhost:9002`

### Building for Production

```bash
npm run build
npm start
```

## 📱 Usage Guide

### For Farmers

1. **Getting Started**
   - Create an account or sign in
   - Complete your farmer profile
   - Explore the dashboard

2. **Crop Diagnosis**
   - Navigate to "Diagnose" section
   - Upload a photo of your affected plant
   - Provide additional details about the issue
   - Receive AI-powered diagnosis and treatment recommendations

3. **Farm Analysis**
   - Go to "Yield Calculator"
   - Enter your crop type, land area, soil type, and region
   - Get comprehensive analysis including yield predictions and profitability

4. **Weather Insights**
   - Check the "Weather" section for forecasts
   - Receive agricultural recommendations based on weather conditions

5. **Community Engagement**
   - Join discussions in the Community forum
   - Share your experiences and learn from others
   - Ask questions and get answers from the community

6. **AI Assistant**
   - Use text or voice chat in your preferred language
   - Ask questions about farming practices
   - Get instant responses from "Agbè̩ anko"

### For Developers

#### Project Structure
```
src/
├── ai/                     # AI flows and Genkit configuration
│   ├── flows/             # Individual AI workflows
│   │   ├── ai-chat-response.ts
│   │   ├── diagnose-crop-issue.ts
│   │   ├── generate-farm-analysis.ts
│   │   ├── get-weather-forecast.ts
│   │   ├── moderate-community-content.ts
│   │   └── voice-chat-ai-response.ts
│   ├── genkit.ts          # Genkit configuration
│   └── dev.ts             # Development imports
├── app/                   # Next.js App Router pages
│   ├── auth/              # Authentication pages
│   ├── dashboard/         # User dashboard
│   ├── diagnose/          # Crop diagnosis feature
│   ├── community/         # Community forum
│   ├── voice-chat/        # Voice chat interface
│   ├── ai-chat/           # Text chat interface
│   ├── weather/           # Weather forecasting
│   ├── yield-calculator/  # Farm analysis tool
│   └── learning/          # Educational content
├── components/            # Reusable UI components
│   ├── ui/               # shadcn/ui components
│   └── ...               # Custom components
├── hooks/                # Custom React hooks
├── lib/                  # Utility functions and data
└── public/               # Static assets
```

#### Key AI Flows

1. **Crop Diagnosis** (`diagnose-crop-issue.ts`)
   - Plant identification using AI vision
   - Disease diagnosis with treatment recommendations
   - Localized solutions for Nigerian farming context

2. **Farm Analysis** (`generate-farm-analysis.ts`)
   - Yield prediction based on crop, soil, and region
   - Revenue and profitability projections
   - Risk assessment and recommendations

3. **Weather Forecasting** (`get-weather-forecast.ts`)
   - Location-based weather data
   - 3-day agricultural forecasts
   - Farming recommendations based on weather conditions

4. **AI Chat Assistant** (`ai-chat-response.ts` & `voice-chat-ai-response.ts`)
   - Multilingual conversation support
   - Agricultural knowledge base
   - Context-aware responses

## 🌍 Multilingual Implementation

The platform supports five languages with intelligent language detection:

- **Language Detection**: Automatic identification of user's language
- **Response Matching**: AI responds in the same language as the query
- **Voice Support**: Speech recognition and synthesis for all supported languages
- **Cultural Adaptation**: Responses tailored to local Nigerian farming contexts

Example language codes:
- `en-NG` - Nigerian English
- `yo-NG` - Yoruba
- `ha-NG` - Hausa
- `ig-NG` - Igbo

## 🤝 Contributing

We welcome contributions from developers, agricultural experts, and the farming community!

### Development Workflow

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes and commit: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

### Contribution Guidelines

- Follow TypeScript best practices
- Maintain mobile-first responsive design
- Ensure multilingual compatibility
- Add appropriate tests for new features
- Update documentation for significant changes

### Areas for Contribution

- **AI Model Training**: Improve crop disease recognition
- **Language Support**: Enhance multilingual capabilities  
- **UI/UX**: Design improvements and accessibility
- **Agricultural Data**: Local farming knowledge integration
- **Mobile App**: React Native implementation
- **API Integration**: Third-party agricultural services

## 📊 Performance & Analytics

- **Core Web Vitals**: Optimized for excellent user experience
- **Mobile Performance**: Efficient loading on low-bandwidth connections
- **AI Response Times**: Sub-3-second average response times
- **Offline Capability**: Progressive Web App features for rural connectivity

## 🔐 Security & Privacy

- **Data Protection**: End-to-end encryption for user data
- **Privacy First**: Minimal data collection with user consent
- **Secure Authentication**: Firebase Auth with multi-factor support
- **Content Moderation**: AI-powered community content filtering

## 🌟 Impact & Goals

### Current Impact
- Supporting Nigerian farmers with digital agricultural tools
- Providing multilingual AI assistance in local languages
- Enabling data-driven farming decisions
- Building a connected farming community

### Future Goals
- **Scale**: Reach 100,000+ farmers across Nigeria
- **Expansion**: Extend to other West African countries
- **Features**: Marketplace integration and financial services
- **Partnerships**: Collaborate with agricultural institutions and NGOs

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Nigerian Farmers**: For their invaluable feedback and insights
- **Google AI**: For Genkit framework and Gemini models
- **Firebase Team**: For robust backend infrastructure
- **Open Source Community**: For the amazing tools and libraries

## 📞 Contact & Support

- **Email**: support@naijaagroconnect.com
- **Website**: [https://naijaagroconnect.com](https://naijaagroconnect.com)
- **GitHub Issues**: [Report bugs and request features](https://github.com/kayode96-max/agropal_3mtt/issues)
- **Community Forum**: Join discussions on our platform

## 🔄 Changelog

### Version 0.1.0 (Current)
- Initial release with core AI features
- Multilingual chat and voice support
- Crop diagnosis and farm analysis
- Weather forecasting integration
- Community forum functionality
- Educational learning modules

---

**Built with ❤️ for Nigerian farmers by the NaijaAgroConnect team**

*Empowering agriculture through technology, one farm at a time.*
