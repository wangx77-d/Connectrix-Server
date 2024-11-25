FROM public.ecr.aws/lambda/nodejs:18 as builder

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json yarn.lock ./

# Install dependencies
RUN yarn install --frozen-lockfile

# Copy source code
COPY . .

# Build application
RUN yarn build

# Production image
FROM public.ecr.aws/lambda/nodejs:18

# Copy built application
COPY --from=builder /app/.next/standalone /app
COPY --from=builder /app/public /app/public
COPY --from=builder /app/.next/static /app/.next/static
COPY --from=builder /app/src/lambda.ts /app/

# Set working directory
WORKDIR /app

# Set the Lambda handler
CMD [ "lambda.handler" ]
