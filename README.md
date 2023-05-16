# Task 3 Chat Bots

# Setup

npm init -y

npm i

npm pkg set scripts.prepare="husky install"
npx husky add .husky/pre-commit "npm test"
git add .husky/pre-commit

heroku login
heroku git:remote -a herokuName
git add .
git push heroku dev

heroku buildpacks:

- heroku/nodejs

heroku config:set TOKEN={token}
heroku config:set HEROKU_URL=$(heroku info -s | grep web_url | cut -d= -f2)
