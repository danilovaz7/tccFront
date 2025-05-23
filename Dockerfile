FROM node:24.0 as builder

COPY . .

RUN npm i

RUN npm run build 

FROM nginx:stable-apline

COPY --from=builder /dist /usr/share/nginx/html

COPY nginx.conf /etc/nginx/nginx.config

CMD ["nginx", "-g", "daemon off;"]
