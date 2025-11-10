FROM node:24
WORKDIR /app
COPY --chown=node:node package*.json ./
RUN npm install
COPY --chown=node:node . .
EXPOSE 3000
RUN chown -R node:node /app && chmod -R 777 /app
CMD ["npm", "run", "start"]