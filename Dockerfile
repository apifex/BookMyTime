# syntax=docker/dockerfile:1

FROM node:14.18.1 as build

ENV NODE_ENV=development

WORKDIR /app

COPY ["package.json", "package-lock.json", "./"]

RUN npm ci

COPY . .

RUN npm run build

CMD ["npm", "run", "prod"]