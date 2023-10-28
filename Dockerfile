FROM node:19-alpine3.16

WORKDIR /pdf-generator

RUN apk update && apk add texlive

COPY ./ ./

CMD ["node", "./dist/index.js"]

EXPOSE 3000
