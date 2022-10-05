FROM node:16-buster AS builder

WORKDIR /derailed-app-src
COPY . .

RUN yarn install --frozen-lockfile

FROM node:16-alpine
WORKDIR /derailed-app-src
COPY --from=builder /derailed-app-src .

EXPOSE 8080
CMD [ "yarn", "start" ]