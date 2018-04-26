#!/bin/bash

# DESCRIPTION: Sets up the newly-created gRPC project
# MAINTAINER: sam543381@protonmail.com

echo ' -> Cleaning up folder'
rm -Rf build
echo ''

echo ' -> Installing npm dependencies'
npm install
echo ''

echo ' -> Initializing a new fresh git repository...'
rm -Rf .git
git init
echo ''

echo ' -> Excluding setup script from git'
echo 'reset.bash' >> .gitignore
echo '' > src/index.ts

rm -f src/ExampleService.ts
rm -f proto/example.proto

echo ''

echo 'Done.'
echo '  You may want to add your own origins when working with a git server'
echo '  See: "git remote add origin <url>"'
echo '  Along with the "repository" field in package.json'
echo ''

echo Project setup done: $(pwd)
