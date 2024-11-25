FROM public.ecr.aws/lambda/nodejs:18 as builder

# Install yarn globally
RUN npm install -g yarn

# Install dependencies
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile --production=false

# Copy source code
COPY . .

# Build the application
RUN yarn build

# Production image
FROM public.ecr.aws/lambda/nodejs:18

# Copy only necessary files
COPY --from=builder /app/.next/standalone /app
COPY --from=builder /app/node_modules /app/node_modules

WORKDIR /app

# Set the Lambda handler
CMD [ "lambda.handler" ]
