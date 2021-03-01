FROM node:15.5-alpine3.12 as builder
WORKDIR /app
COPY package.json /app/package.json
COPY yarn.lock /app/yarn.lock
RUN apk --no-cache add --virtual builds-deps build-base python
RUN yarn
COPY . /app
RUN yarn build