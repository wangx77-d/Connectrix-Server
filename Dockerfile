# Use Node.js base image
FROM node:18

# Set the working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package.json yarn.lock ./
RUN yarn install

# Copy all application files
COPY . .

# Build the Next.js application
RUN yarn build

# Expose port for Lambda runtime
EXPOSE 3000

# Start the Next.js application (serverless-compatible)
CMD ["yarn", "start"]
