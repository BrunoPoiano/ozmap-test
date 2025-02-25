FROM node:20
WORKDIR /app
COPY . .
COPY .env .
RUN npm install && npm run build
EXPOSE 5173
CMD ["npx", "serve", "dist", "-l", "5173"]
