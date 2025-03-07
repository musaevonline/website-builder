FROM node:16-alpine
ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /app
COPY package.json package-lock.json .
RUN npm install --force --only=production && npm cache clean --force
COPY build .

EXPOSE 3000

CMD ["node", "start.js"]