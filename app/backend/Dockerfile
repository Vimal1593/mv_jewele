FROM node:20-alpine

# Set securely isolated working directory
WORKDIR /usr/src/app

# Only copy over dependencies config to cache package installation
COPY package*.json ./

# Install dependencies cleanly
RUN npm install --omit=dev

# Copy application layers
COPY . .

# DevSecOps Practice: Run as non-root user securely
USER node

# Expose backend port
EXPOSE 5000

# Execute server
CMD ["node", "src/server.js"]
