# Notes 

## Courses

- https://www.youtube.com/watch?v=pRI04OE5QXM&list=PLAZUzPw7MqPSWbqXibVBfon4Y5HgQT9EU&index=1&ab_channel=tuttodev
- https://pro.codely.com/library/ddd-en-typescript-modelado-y-arquitectura-172533/375662/about/

## Scaffold

📂 `project-name/`
├─ 📂 `.bin` Binary and helper files
├─ 📂 `.data` 
├─ 📂 `.docker` Docker images
├─ 📂 `.git/`
├─ 📂 `.github/`
├─ 📂 `.husky/`
├─ 📂 `.tmp/`
├─ 📂 `.vscode` Visual studio code files
├─ 📂 `coverage/`
├─ 📂 `dist/`
├─ 📂 `src/` Código a producción y a transpilar
│  ├─ 📂 `Context/`
│  │  ├─ 📂 `Mooc/`
│  │  │  ├─ 📂 `Courses/`
│  │  │  │  ├─ 📂 `application/`
│  │  │  │  ├─ 📂 `domain/`
│  │  │  │  ├─ 📂 `infrastructure/`
│  │  │  ├─ 📂 `Shared/` Elementos para compartir entre cada uno de los submodulos que hay dentro de un contexto | elementos de dominio que se comparten
│  │  ├─ 📂 `Shared/` Elementos compartidos entre diversos contextos - infraestructura - conexión a bases de datos - event bus
│  ├─ 📂 `apps/`
│  │  ├─ 📂 `mooc/`
│  │  │  ├─ 📂 `backend/`
│  │  │  ├─ 📂 `frontend/`
├─ 📂 `tests/` Código de pruebas
│  ├─ 📂 `Context/` Unitarios | Integración - Infraestructura (repositorio con base de datos)
│  │  ├─ 📂 `Mooc/`
│  │  │  ├─ 📂 `Courses/`
│  │  │  │  ├─ 📂 `__mocks__/`
│  │  │  │  ├─ 📂 `application/`
│  │  │  │  ├─ 📂 `domain/`
│  │  │  │  ├─ 📂 `infrastructure/`
│  │  │  ├─ 📂 `Shared/`
│  │  ├─ 📂 `Shared/`
│  ├─ 📂 `apps/` Aceptación | Caja negra | End to end - Probar una funcionalidad desde el punto más externo sin conocer la implementación que hay por dentro
│  │  ├─ :open_file_folder📂: `mooc/`
│  │  │  ├─ 📂 `backend/`
│  │  │  │  ├─ 📂 `features/`
│  │  │  ├─ 📂 `frontend/`
├─ 📂 `types/` 
## Test

- Apps
  - Comportamiento visible con cucumber sin dependencia a infraestructura - inputs y outputs

## Fastify
- https://github.com/fastify/fastify/blob/main/docs/Reference/Lifecycle.md

## Define

- [ ] errors vs exceptions
- [ ] CreateCourseRequest (?)

## Complement

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

docker-compose -f ./docker-compose.yml up -d --build

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
