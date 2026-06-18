# 🌱 FarmFriend

**FarmFriend** is an AI-powered smart farming assistant built with Next.js and Google Gemini. It helps farmers make better decisions with real-time weather data, crop disease diagnosis, soil health analysis, market prices, and multilingual support.

---

## ✨ Features

| Feature | Description |
|---|---|
| 🤖 **AI Crop Doctor** | Upload a photo of an affected crop and get an instant AI diagnosis with confidence score, organic & chemical treatment options, and prevention tips |
| 🌤️ **Smart Dashboard** | Hyper-local weather data, crop market prices with trend indicators, and soil health analysis (moisture, pH, nitrogen) |
| 🌱 **Season Predictor** | AI-powered seasonal crop recommendations with downloadable reports |
| 💬 **AI Chatbot** | Context-aware chatbot for weather, market prices, crop diseases, and app guidance |
| 🛒 **Marketplace** | Browse and list crops for sale within the farming community |
| 💰 **Financial Services** | Access loan applications and insurance information |
| 📚 **Knowledge Hub** | Community forum to post and answer farming questions |
| 🌍 **Multilingual Support** | English, Hindi, Telugu, Tamil, and Kannada |
| 🔐 **Firebase Auth** | Secure sign-in / sign-up with email and password |

---

## 🛠️ Tech Stack

- **Framework:** [Next.js 15](https://nextjs.org/) with Turbopack
- **AI:** [Google Gemini 2.5 Flash](https://ai.google.dev/) via [Genkit](https://genkit.dev/)
- **Auth & Database:** [Firebase](https://firebase.google.com/) (Auth + Firestore)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/) + [shadcn/ui](https://ui.shadcn.com/)
- **Language:** TypeScript
- **Charts:** [Recharts](https://recharts.org/)
- **Icons:** [Lucide React](https://lucide.dev/)

---

## 🚀 Getting Started

### Prerequisites

- Node.js `v18+`
- npm `v11+`
- A [Firebase](https://firebase.google.com/) project
- A [Google AI Studio](https://aistudio.google.com/) API key (Gemini)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/kundempranav1/FarmFriend.git
   cd FarmFriend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**

   Create a `.env` file in the root directory:
   ```env
   GEMINI_API_KEY=your_google_gemini_api_key

   NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. Open [http://localhost:9002](http://localhost:9002) in your browser.

---

## 📁 Project Structure

```
src/
├── ai/
│   ├── flows/              # Genkit AI flows (crop diagnosis, soil health, etc.)
│   └── genkit.ts           # Genkit configuration
├── app/
│   ├── auth/               # Firebase auth context
│   ├── login/              # Login / sign-up page
│   └── page.tsx            # Main app page
├── components/
│   ├── farmfriend/         # Core feature components
│   │   ├── crop-doctor.tsx
│   │   ├── dashboard.tsx
│   │   ├── chatbot.tsx
│   │   ├── season-predictor.tsx
│   │   ├── marketplace.tsx
│   │   └── ...
│   └── ui/                 # shadcn/ui base components
├── firebase/               # Firebase client setup
├── hooks/                  # Custom React hooks
└── lib/
    └── translations.ts     # Multilingual text strings
```

---

## 📜 Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the development server on port 9002 |
| `npm run build` | Build the production bundle |
| `npm run start` | Start the production server |
| `npm run lint` | Run ESLint |
| `npm run typecheck` | Run TypeScript type checking |
| `npm run genkit:dev` | Start the Genkit AI development server |

---

## 🌐 Live Demo

> Coming soon — deploy to Firebase App Hosting using `apphosting.yaml`

---

## 📄 License

This project is for educational and personal use.

---

## 👨‍💻 Author

**Kundem Pranav** — [GitHub](https://github.com/kundempranav1)
