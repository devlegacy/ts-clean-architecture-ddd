# Readme

- https://www.youtube.com/watch?v=pRI04OE5QXM&list=PLAZUzPw7MqPSWbqXibVBfon4Y5HgQT9EU&index=1&ab_channel=tuttodev

```sh

mkdir ./project-name
cd ./project-name

git init

npm init -y

mkdir ./.vscode
mkdir ./src
mkdir ./dist

npm i \
      fastify @fastify/compress @fastify/cookie @fastify/cors @fastify/helmet @fastify/rate-limit \
      dotenv dotenv-expand \
      reflect-metadata tsyringe \
      uuid \
      mongodb \
      pino pino-pretty \

npm i -D \
      @types/node @types/jest @types/uuid \
      typescript ts-node ts-node-dev tsconfig-paths tslib resolve-tspaths \
      @typescript-eslint/eslint-plugin @typescript-eslint/parser eslint eslint-config-prettier eslint-plugin-import eslint-plugin-jest eslint-plugin-prettier eslint-plugin-simple-import-sort \
      prettier tslint-config-prettier \
      jest ts-jest \
      husky \
      lint-staged \
      @commitlint/config-conventional @commitlint/cli \

npm install -g \
  commitizen \

npx mrm@2 lint-staged

# - https://typicode.github.io/husky/#/?id=install
# - https://commitlint.js.org/#/guides-local-setup?id=guide-local-setup
  
npm i -O npm-check-updates

npx tsc --init
npx jest --init

```

- download config files
- settings.json
- launch.json

```json
{
  "config": {
    "commitizen": {
      "path": "./node_modules/cz-conventional-changelog"
    }
  },
  "lint-staged": {
    "*.js": "eslint --cache --fix"
  }
}
```

## First commit message sample

chore: project   
start project   
create scaffolding, add config files, setting config files   
