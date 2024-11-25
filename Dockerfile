# Use AWS Lambda Node.js runtime as the base image
FROM public.ecr.aws/lambda/nodejs:18

# Copy application files to the container
COPY . .

# Install dependencies
RUN yarn install

# Build the Next.js application
RUN yarn build

# Set the universal Lambda handler as the entry point
CMD ["lambda-handler.handler"]
