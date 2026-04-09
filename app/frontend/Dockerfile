# STAGE 1: Build Image
FROM node:20-alpine as builder

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# STAGE 2: Secure Nginx Server
FROM nginx:alpine

# Copy custom Nginx network proxy configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy built artifacts from the prior build stage
COPY --from=builder /usr/src/app/dist /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Run nginx without root privileges for better DevSecOps (optional/custom configs usually)
CMD ["nginx", "-g", "daemon off;"]
