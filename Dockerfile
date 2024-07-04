# Use a valid Node.js version
ARG NODE_VERSION=14
FROM node:${NODE_VERSION}-slim as base

# Node.js app lives here
WORKDIR /app

# Set production environment
ENV NODE_ENV=production

# Throw-away build stage to reduce size of final image
FROM base as build

# Install packages needed to build node modules
RUN apt-get update -qq && \
    apt-get install --no-install-recommends -y build-essential node-gyp pkg-config python-is-python3

# Install node modules
COPY package*.json ./
RUN npm ci

# Copy application code including views directory
COPY . .

# Ensure views directory is correctly copied
COPY views /app/views

# Final stage for app image
FROM base

# Copy built application from build stage
COPY --from=build /app /app

# Expose the port your app runs on
EXPOSE 3000

# Start the server by default, this can be overwritten at runtime
CMD ["node", "index.js"]