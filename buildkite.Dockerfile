FROM mcr.microsoft.com/playwright:v1.40.0-jammy

# COPY ./ /e2e/

WORKDIR .

VOLUME /playwright-report

# RUN npm install

# RUN npx playwright install

# ENTRYPOINT [ "npx", "playwright", "test" ]
# CMD []
