FROM node:18

WORKDIR /dockout

COPY package.json .
RUN npm install
RUN yarn install

COPY . .

CMD ["npm", "start"]