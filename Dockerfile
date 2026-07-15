# Base Image
FROM node:22

# Create working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy project files
COPY . .

# Application port
EXPOSE 3000

# Start application
CMD ["npm", "start"]