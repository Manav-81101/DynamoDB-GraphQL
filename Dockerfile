FROM node:16-alpine
WORKDIR /user/dynamodb
COPY . .
RUN yarn install --production
CMD ["node", "index.js"]
