#!/bin/bash

echo "🔧 Fixing port issues..."
echo ""

# Kill process on port 5000
echo "🔴 Killing process on port 5000..."
lsof -ti:5000 | xargs kill -9 2>/dev/null || echo "✅ Port 5000 is free"

# Kill process on port 3000
echo "🔴 Killing process on port 3000..."
lsof -ti:3000 | xargs kill -9 2>/dev/null || echo "✅ Port 3000 is free"

echo ""
echo "✅ Ports are now free!"
echo ""
echo "🚀 Starting development servers..."
echo ""

npm run dev
