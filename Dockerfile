#Carpeta Deployment
FROM node:alpine3.16

RUN apk add curl bash --no-cache

RUN curl -sf https://gobinaries.com/tj/node-prune | sh -s -- -b /usr/local/bin

WORKDIR /app

COPY package.json . 

RUN npm install

COPY . . 

RUN npm prune

RUN /usr/local/bin/node-prune

CMD ["npm", "run", "start:prod"]