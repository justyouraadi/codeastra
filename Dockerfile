# Stage 1: Build the React app
FROM node:23.4.0-alpine3.20 AS build

# Set the working directory
WORKDIR /app

# Install pnpm globally
RUN npm install -g pnpm

# Copy package.json, pnpm-lock.yaml
COPY package.json pnpm-lock.yaml ./

# Install dependencies using pnpm
RUN pnpm install

# Approve the build scripts for dependencies
RUN pnpm approve-builds

# Copy the rest of the application code
COPY . .

# Build the application
RUN pnpm build

# Stage 2: Serve the built app
FROM node:23.4.0-alpine3.20

# Install serve globally
RUN npm install -g serve

# Set the working directory
WORKDIR /app

# Copy the build artifacts from the previous stage
COPY --from=build /app/dist ./dist

# Expose the port the app runs on
EXPOSE 3093

# Command to serve the application
CMD ["serve", "-s", "dist", "-l", "3093"]