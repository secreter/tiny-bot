#FROM node:10
#FROM zixia/wechaty:onbuild
#MAINTAINER so@redream.cn
##RUN npm i
#CMD ["npm","run","run"]

FROM zixia/wechaty:0.22

ARG NODE_ENV
ENV NODE_ENV $NODE_ENV

WORKDIR /bot

COPY package.json .
RUN jq 'del(.dependencies.wechaty)' package.json | sponge package.json \
    && npm install \
    && sudo rm -fr /tmp/* ~/.npm
COPY . .

CMD ["npm","run","run"]
