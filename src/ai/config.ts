// Gemini AI configuration
// This ensures the API key is always available on all hosting platforms
// (Vercel, Netlify, Firebase Hosting, local dev, etc.)
export const geminiConfig = {
  apiKey: process.env.GEMINI_API_KEY || 'AIzaSyBPhN9litHMA9YIZkTm30RrLG377ZrErQs',
};
