#!/usr/bin/env bash
set -e

git checkout release
git merge main
cd front
yarn build
cd ..
git add .
git commit -m "Pre-release commit"
git push origin release
eb deploy
git checkout main

