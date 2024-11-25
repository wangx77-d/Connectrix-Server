# Use AWS Lambda Node.js runtime as the base image
FROM public.ecr.aws/lambda/nodejs:18

# Install Yarn
RUN npm install -g yarn

# Copy application files to the container
COPY . .

# Install dependencies
RUN yarn install

# Build the Next.js application
RUN yarn build

# Add AWS Lambda Runtime Interface Emulator for local testing (optional)
ADD https://github.com/aws/aws-lambda-runtime-interface-emulator/releases/latest/download/aws-lambda-rie /usr/local/bin/aws-lambda-rie
RUN chmod +x /usr/local/bin/aws-lambda-rie

# Set the universal Lambda handler as the entry point
CMD ["lambda-handler.handler"]
