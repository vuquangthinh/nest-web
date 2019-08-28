FROM node:alpine as builder

ARG API_URL=http://localhost:3000
ENV APP__API_URL=${API_URL}

ARG APP_BUILD_ID=1
ENV APP__BUILD_ID=${APP_BUILD_ID}

ENV CI=true

WORKDIR /usr/src/app/

COPY package.json ./
RUN npm install --silent --no-cache

COPY . .

RUN ["npm", "run", "build"]

FROM nginx:alpine

RUN mkdir /usr/share/nginx/html/admin

COPY --from=builder /usr/src/app/dist /usr/share/nginx/html/admin

COPY docker/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]


# FROM node:alpine

# WORKDIR /usr/src/app/

# COPY package.json ./
# RUN npm install --silent --no-cache

# COPY ./ ./

# ENV PORT 80

# CMD ["npm", "run", "start"]