# syntax=docker/dockerfile:1

FROM node:14.18.1 as build

ENV NODE_ENV=development

ENTRYPOINT ["/usr/local/bin/docker-entrypoint.sh"]

WORKDIR /app

COPY ["package.json", "package-lock.json", "./"]

RUN npm ci

COPY . .

RUN npm run build

FROM nginx

RUN rm /etc/nginx/conf.d/default.conf

COPY --from=build /app/nginx/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html