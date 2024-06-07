FROM mcr.microsoft.com/playwright:v1.43.0

COPY . /e2e

WORKDIR /e2e

VOLUME /e2e/playwright-report

RUN npm install

RUN npx playwright install

ENTRYPOINT [ "npx", "playwright", "test" ]
CMD []
