FROM node:12-stretch-slim

WORKDIR /app/frontend

COPY ./frontend/package.json ./frontend/package-lock.json ./

ENV PATH ./node_modules/.bin/:$PATH

RUN npm install
