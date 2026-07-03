# Use Microsoft's official Playwright image — ships with all browsers
# and OS dependencies pre-installed, pinned to match package.json's @playwright/test version.
FROM mcr.microsoft.com/playwright:v1.51.1-jammy

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

ENV CI=true
ENV HEADLESS=true

CMD ["npx", "playwright", "test"]
