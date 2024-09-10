FROM node:20-alpine

WORKDIR /app

COPY .output .

CMD node server/index.mjs
