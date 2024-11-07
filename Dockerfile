FROM node:lts-alpine

ARG ASSET_PREFIX
ENV ASSET_PREFIX $ASSET_PREFIX

ENV APP_UID=9999
ENV APP_GID=9999

RUN apk --no-cache add shadow
RUN groupmod -g $APP_GID node
RUN usermod -u $APP_UID -g $APP_GID node

RUN mkdir -p /usr/src
RUN chown -R node /usr/src
USER node
WORKDIR /usr/src

COPY . /usr/src

VOLUME [ "/usr/src/public/static/dms_user_assets" ]

RUN npm cache clean --force
RUN npm ci
RUN NEXT_TELEMETRY_DISABLED=1 npm run build

EXPOSE 3000
CMD npm start