# Use an official Node runtime as a parent image
FROM node:18

# Set the working directory in the container
WORKDIR /adapt_program

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install the app dependencies
RUN npm install

# Copy the app source code to the working directory
COPY . .

# Expose the port the app runs on
EXPOSE 3000

# Define environment variable
RUN npm run build

# Command to run the application
CMD ["npm", "start"]
