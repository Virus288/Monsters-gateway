# Monsters - gateway

## 1. How to start

### Install dependencies

```shell
npm install / yarn
```

### Prepare environment

```shell
npm run prepare / yarn prepare
chmod +x .husky/pre-commit
```

## 2. How to build

```shell
npm run build / yarn build
```

If you even encounter strange build behavior, tsconfig is set to create build with cache. Set option `incremental` in
tsConfig to false

## 3. Useful information

### 3.1 Logs folder

#### Linux

```text
~/.cache/"package.json -> productName"/logs
```

#### Windows

```text
~/AppData/Roaming/"package.json -> productName"/logs
```

### 3.2 Testing

#### All test currently are written using jest. You can run all tests or just type specific tests

#### Available targets

```text
yarn test:e2e = run 'end to end' tests
yarn test:db = run 'database' tests
yarn test:unit = run 'unit' tests
yarn test:watch = run tests in 'watch' mode
```

To run all tests, use makefile script

```text
make test
```

#### Important node:

In order to run e2e tests, you should run other services in "test" mode. Test mode uses in memory database and does not
save data anywhere ( except rabbitMQ )

### 3,3 Docs

#### This project is using swagger docs. You can access them by route http://localhost:<port>/docs