FROM node:20-alpine

# Set working directory inside container
WORKDIR /app

# Copy only package.json + package-lock.json first (for caching npm install)
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy rest of the backend code
COPY . .

# Expose the port your server listens on
EXPOSE 4000

# Start your server
CMD ["npm", "start"]
