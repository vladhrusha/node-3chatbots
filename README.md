# Task 3 Chat Bots

# Setup

npm init -y

npm install eslint --save-dev
npm install --save-dev eslint-config-prettier@latest
npm install --save-dev eslint-config-standard@latest
npm install --save-dev eslint-plugin-import@latest
npm install --save-dev eslint-plugin-n@latest
npm install --save-dev eslint-plugin-prettier@latest
npm install --save-dev eslint-plugin-promise@^6.1.1

npm install prettier --save-dev

npm install husky --save-dev
npx husky install
npm pkg set scripts.prepare="husky install"
npx husky add .husky/pre-commit "npm test"
git add .husky/pre-commit

npm install --save-dev lint-staged

npm i node-telegram-bot-api

npm install dotenv

heroku login
heroku git:remote -a about-me-bot12
git add .
git push heroku dev

buildbacks
heroku/nodejs
jontewks/puppeteer
