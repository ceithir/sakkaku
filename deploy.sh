#!/usr/bin/env bash
set -e

git checkout release
git merge main -m "Pre-release merge"
cd front
yarn build
cd ..
git add .
git commit -m "Pre-release front update"
git push origin release
eb deploy
git checkout main

