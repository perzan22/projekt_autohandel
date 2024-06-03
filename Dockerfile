# angular
FROM node:18 as angular-build

WORKDIR /app

COPY package.json package-lock.json angular.json tsconfig.app.json tsconfig.json tsconfig.spec.json ./
RUN npm install --legacy-peer-deps

COPY src ./src
RUN ls -la ./src
CMD ["npm", "run", "start"]
WORKDIR /app


#server

FROM node:18 as server

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install --legacy-peer-deps

COPY ./server ./server
WORKDIR /app/server

EXPOSE 3000
CMD ["node", "server.js"]