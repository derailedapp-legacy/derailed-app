FROM node:16-alpine

WORKDIR /
COPY . .

RUN yarn install --frozen-lockfile

EXPOSE 8080
CMD [ "yarn", "start" ]