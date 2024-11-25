# Base image for building
FROM amazon/aws-lambda-nodejs:18 AS builder

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy all project files
COPY . .

# Build TypeScript files
RUN npx tsc

# Build Next.js project
RUN npm run build

# Lambda runtime base image
FROM amazon/aws-lambda-nodejs:18

# Set the working directory for Lambda
WORKDIR /var/task

# Copy the Next.js standalone build output
COPY --from=builder /app/.next/standalone /var/task/
COPY --from=builder /app/.next/static /var/task/.next/static
COPY --from=builder /app/.next/cache /var/task/.next/cache

# Copy compiled server.js and other output
COPY --from=builder /app/dist /var/task/

# Copy node_modules for runtime dependencies
COPY --from=builder /app/node_modules /var/task/node_modules

# Copy package.json for runtime references
COPY --from=builder /app/package*.json /var/task/

# Specify the Lambda handler
CMD ["server.handler"]
