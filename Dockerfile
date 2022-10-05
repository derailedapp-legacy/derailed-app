FROM node:16-alpine

WORKDIR /
COPY . .

RUN yarn install --frozen-lockfile
RUN yarn build

EXPOSE 8080
CMD [ "yarn", "start" ]