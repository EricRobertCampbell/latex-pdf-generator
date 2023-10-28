FROM node:19-alpine3.16

WORKDIR /pdf-generator

RUN apk update && apk add texlive

COPY ./ ./

CMD ["npm", "build"]
CMD ["node", "./dist/index.js"]

EXPOSE 3000
