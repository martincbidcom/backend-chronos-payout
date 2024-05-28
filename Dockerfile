FROM node:22.1.0 AS development

WORKDIR /usr/src/app

COPY package*.json ./

RUN apt-get update

RUN apt-get -y install musl-dev

RUN ln -s /usr/lib/x86_64-linux-musl/libc.so /lib/libc.musl-x86_64.so.1

RUN npm install 

COPY . .

RUN npm run build

FROM node:22.1.0 AS production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app

COPY package*.json ./

RUN apt-get update

RUN apt-get -y install musl-dev

RUN ln -s /usr/lib/x86_64-linux-musl/libc.so /lib/libc.musl-x86_64.so.1

RUN npm install 

COPY . .

COPY --from=development /usr/src/app/dist ./dist

CMD ["node", "dist/main"]
