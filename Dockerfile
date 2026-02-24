FROM node:20-alpine

WORKDIR /app

# Ensure we use the exact host IP to allow dev server to be accessible from outside
ENV VITE_HOST=0.0.0.0
ENV PORT=6278

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 6278

CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0", "--port", "6278"]
