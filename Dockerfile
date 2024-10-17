# Production Dockerfile

ARG NODE_VERSION=20.16.0
ARG RELEASE=unknown
ARG NODE_OPTIONS="--max-old-space-size=1024"

FROM node:${NODE_VERSION}-slim as base

WORKDIR /app
ENV RELEASE=$RELEASE
ENV NODE_ENV production
ENV NODE_OPTIONS=$NODE_OPTIONS

COPY scripts /app/scripts
RUN corepack enable && ./scripts/execute.sh docker-install

COPY package.json yarn.lock .yarnrc.yml nest-cli.json resources /app/

FROM base as build

WORKDIR /app
ENV RELEASE=$RELEASE
ENV NODE_ENV production
ENV NODE_OPTIONS=$NODE_OPTIONS
ENV YARN_ENABLE_GLOBAL_CACHE=false

# copy sources and dependencies
COPY . /app

# install all packages
RUN yarn install --immutable

# build the application
RUN ./scripts/execute.sh build

FROM base as final

WORKDIR /app
ENV RELEASE=$RELEASE
ENV NODE_ENV production
ENV NODE_OPTIONS=$NODE_OPTIONS
ENV YARN_ENABLE_GLOBAL_CACHE=false

# install only production dependencies
RUN yarn workspaces focus --production

# copy the built application
COPY --from=build /app/dist /app/dist
COPY .config /app/.config

EXPOSE 3000

# run the application
ENTRYPOINT ["./scripts/execute.sh","docker-start"]
