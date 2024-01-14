#!/bin/bash
echo "Running migration"

npm run migrate:latest

echo "Starting service"

node ./build/src/main.js
