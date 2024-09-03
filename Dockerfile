FROM node:20

WORKDIR /app

COPY . .

RUN npm install
RUN npm run build

CMD node ./.output/server/index.mjs

# FROM nginx:latest
# COPY --from=0 /app/.output /usr/share/nginx/html

# EXPOSE 8080

# CMD nginx -g daemon off;
