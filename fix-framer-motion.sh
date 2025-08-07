#!/bin/bash

echo "Fixing framer-motion issue..."

# Clean install with specific version
rm -rf node_modules package-lock.json
npm install

echo "Fix complete! Run 'npm run dev' to start the application."