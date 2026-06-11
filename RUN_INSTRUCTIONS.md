# How to Run the Project

This document explains how to run the frontend application and connect it to the local Ollama instance for AI features.

## Prerequisites
- **Node.js**: Ensure Node.js is installed on your system.
- **Ollama**: Ensure Ollama is installed and running locally.

## 1. Start Ollama (Backend/AI)
The application relies on a local Ollama instance to generate the website design, taglines, product names, and to power the **Website Chatbot**.

1. Open a new terminal.
2. Run the following command to start Ollama with the default model (the app uses `llama3.2` by default, but you can use `llama3` or `mistral` if you prefer):
   ```bash
   ollama run llama3.2
   ```
3. Keep this terminal open so the local Ollama API (`http://localhost:11434`) remains accessible.

## 2. Start the Frontend
1. Open another terminal and navigate to the `ecommerce-generator` directory.
2. Install dependencies (if you haven't already):
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
4. Open the provided local URL (usually `http://localhost:5173`) in your browser.

## Chatbot Connection
The website chatbot has been successfully connected to your local Ollama instance! 
- Hardcoded intents like "add [product] to cart" or "checkout" are handled instantly by the local state.
- **Any other queries** are automatically routed to Ollama. The AI will act as a helpful shopping assistant for your specific generated store and return context-aware responses.
