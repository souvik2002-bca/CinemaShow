FROM node:18-alpine

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY package*.json ./

RUN npm install

# Bundle app source
COPY . .

# Expose port (default is usually 5000, adjust if you use a different one)
EXPOSE 5000

# Start command
CMD [ "node", "index.js" ]
