FROM node
WORKDIR /usr/src/app
COPY package.json .
RUN npm install
EXPOSE 8080
COPY . .
RUN npm run compile
CMD ["node", "dist/index.js"]