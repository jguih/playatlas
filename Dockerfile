FROM node:24.3-slim AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

FROM base AS deps
COPY . /usr/src/app
WORKDIR /usr/src/app
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile

FROM deps AS build
RUN pnpm build
RUN pnpm deploy --filter=playnite-insights --prod /prod/playatlas
RUN pnpm deploy --filter=@playatlas/system --prod /prod/system

FROM base AS prod
WORKDIR /app
ENV PLAYATLAS_DATA_DIR=/app/data
ENV NODE_ENV='production'
ENV BODY_SIZE_LIMIT=128M

RUN groupadd --system playatlas \
 && useradd  --system --gid playatlas --create-home playatlas
RUN mkdir $PLAYATLAS_DATA_DIR \
  && chown playatlas:playatlas $PLAYATLAS_DATA_DIR \
  && chmod 744 $PLAYATLAS_DATA_DIR

COPY --from=build --chown=playatlas:playatlas /prod/playatlas/node_modules /app/node_modules
COPY --from=build --chown=playatlas:playatlas /prod/playatlas/build /app/build
COPY --from=build --chown=playatlas:playatlas /prod/playatlas/package.json /app/package.json
COPY --from=build --chown=playatlas:playatlas /prod/playatlas/pnpm-lock.yaml /app/pnpm-lock.yaml
COPY --from=build --chown=playatlas:playatlas /prod/system/src/infra/database/migrations /app/infra/migrations

EXPOSE 3000

USER playatlas

ENTRYPOINT ["node", "build"]

FROM mcr.microsoft.com/playwright:v1.54.1-noble AS playwright-base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable pnpm

FROM playwright-base AS playwright-deps
COPY ./packages /usr/src/app/packages
COPY ./playwright /usr/src/app/playwright
COPY ./pnpm-workspace.yaml /usr/src/app
COPY ./package.json /usr/src/app
COPY ./tsconfig.json /usr/src/app
WORKDIR /usr/src/app
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install

FROM playwright-deps AS playwright
WORKDIR /usr/src/app
ENTRYPOINT ["pnpm", "--filter", "playwright", "exec", "playwright", "test"]

FROM python:3.14 AS mkdocs-build

WORKDIR /app

RUN pip install mkdocs-material

COPY ./docs /app
RUN mkdocs build -d ./dist

FROM busybox:1.36 AS mkdocs-runtime

WORKDIR /app

RUN adduser -D mkdocs

COPY --chown=mkdocs:mkdocs --from=mkdocs-build /app/dist /app

EXPOSE 3001

USER mkdocs

ENTRYPOINT ["busybox", "httpd", "-f", "-v", "-p", "3001"]