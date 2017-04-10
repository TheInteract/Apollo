FROM node:7-slim
MAINTAINER ChinCluBi <chinnaporn.s@ku.th>
COPY /src /app/src
COPY /static /app/static
COPY /config /app/config
COPY /node_modules /app/node_modules
COPY /.babelrc /app
COPY /*.js /app/
COPY /package.json /app
WORKDIR /app
EXPOSE 3000 3002
ENTRYPOINT ["npm", "run", "start"]
