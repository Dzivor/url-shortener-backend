# Use the official Node.js image.
FROM node:18-alpine

# Set the working directory.
WORKDIR /app

# Copy package.json and package-lock.json.
COPY package*.json ./

# Install dependencies (including devDependencies for build)
RUN npm ci --include=dev

# Copy the rest of the application code.
COPY . .

# Build TypeScript
RUN npm run build

# Expose the application port.
EXPOSE 5000

# Start the application.
CMD ["npm", "start"]
