#!/bin/sh

rm -rf .tmp
mkdir .tmp
npm run build
cp -r dist .tmp
cp package.json .tmp
cp package-lock.json .tmp
cp serverless.yml .tmp
cd .tmp
npm install --omit=dev
npm run migration:generate -- --schema=../prisma/schema.prisma
serverless deploy
cd ..
rm -rf .tmp
