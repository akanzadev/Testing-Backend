#Carpeta Deployment
FROM node:alpine3.16 AS DEPLOYMENT

RUN apk add curl bash --no-cache

RUN curl -sf https://gobinaries.com/tj/node-prune | sh -s -- -b /usr/local/bin

WORKDIR /build

COPY package.json . 

RUN npm install

COPY . . 

RUN npm run build

RUN npm prune

RUN /usr/local/bin/node-prune

#Carpeta Production
FROM node:alpine3.16

WORKDIR /app

COPY --from=DEPLOYMENT /build ./dist

COPY --from=DEPLOYMENT /build/.env ./.env

CMD ["npm", "run", "prod"]