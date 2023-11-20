# --------------- BUILD STAGE --------------- #
FROM node:lts as build-stage

# Move to root directory
WORKDIR /apps

# Copy all necessary files
COPY ./CommonApp ./CommonApp
COPY ./BrokerApp ./BrokerApp

# Install common app
WORKDIR /apps/CommonApp

# Install packages
RUN npm install

# Install service
WORKDIR /apps/BrokerApp

# Install packages
RUN npm install

# Build the app
RUN npm run build



# --------------- RUN STAGE --------------- #
FROM node:lts-alpine as run-stage

# Move to root directory
WORKDIR /apps

# Only copy compiled files to build runnable service
COPY --from=build-stage ./apps/BrokerApp/dist ./

# Install common app
WORKDIR /apps/CommonApp

# Only install production-related packages
RUN npm install --omit=dev

# Install service
WORKDIR /apps/BrokerApp

# Only install production-related packages
RUN npm install --omit=dev

# Copy environment variables file inside service
COPY ./BrokerApp/.env.production ./.env.production

# Expose necessary port to talk with service
EXPOSE 3000

# Define command to run when launching the image
CMD ["npm", "run", "start:prod"]