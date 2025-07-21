#!/bin/bash

# PropOps Manager Assistant Startup Script

echo "🏠 PropOps Manager Assistant - Startup Script"
echo "=============================================="

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 16+ first."
    exit 1
fi

echo "✅ Node.js version: $(node --version)"

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Please run this script from the project root directory"
    exit 1
fi

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ] || [ ! -d "server/node_modules" ] || [ ! -d "client/node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm run install-deps
    if [ $? -ne 0 ]; then
        echo "❌ Failed to install dependencies"
        exit 1
    fi
fi

# Check if .env file exists
if [ ! -f "server/.env" ]; then
    echo "⚠️  No .env file found in server directory"
    echo "📄 Creating .env from template..."
    cp server/.env.example server/.env
    echo ""
    echo "🔑 IMPORTANT: Edit server/.env and add your OpenAI API key:"
    echo "   OPENAI_API_KEY=your_api_key_here"
    echo ""
    read -p "Press Enter after you've added your API key to continue..."
fi

# Validate OpenAI API key is set
if [ -f "server/.env" ]; then
    source server/.env
    if [ -z "$OPENAI_API_KEY" ] || [ "$OPENAI_API_KEY" = "your_openai_api_key_here" ]; then
        echo "❌ OpenAI API key not configured properly in server/.env"
        echo "Please set OPENAI_API_KEY=your_actual_api_key"
        exit 1
    fi
fi

echo ""
echo "🚀 Starting PropOps Manager Assistant..."
echo ""
echo "This will start:"
echo "  • Backend server on http://localhost:5000"
echo "  • Frontend on http://localhost:3000"
echo ""
echo "Press Ctrl+C to stop both servers"
echo ""

# Start both servers concurrently
npm run dev