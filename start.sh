#!/bin/bash
echo "Initializing database"

npm run migrate:init

echo "Running migration"

npm run migrate:latest

echo "Starting service"

node ./build/src/main.js
