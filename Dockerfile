FROM node:16.17-alpine
WORKDIR /srv/app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
COPY package*.json ./
EXPOSE 8080
CMD ["node", "dist/index.js"]