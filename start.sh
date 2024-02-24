#!/bin/bash
echo "Running migration"

npm run migrate:latest:prod

echo "Starting service"

node ./build/src/main.js
