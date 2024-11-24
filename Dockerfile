# Use the AWS Lambda Node.js 18 runtime as the base image
FROM public.ecr.aws/lambda/nodejs:18

# Install Yarn
RUN npm install -g yarn

# Copy application files into the container
COPY . .

# Install dependencies
RUN yarn install --production

# Build the application
RUN yarn build

# Set the Lambda handler
CMD [".next/server/pages/index.handler"]
