FROM node:latest
RUN mkdir -p /var/www
WORKDIR /var/www
COPY ./app/package.json /var/www
COPY ./app /var/www
RUN npm install
EXPOSE 3000
CMD ["node", "app.js"]
