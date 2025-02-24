FROM node:20
WORKDIR /app
COPY . .
COPY .env .
RUN npm install && npm run build
EXPOSE 3000

CMD ["node", "dist/index.js"]
