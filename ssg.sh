#!/usr/bin/env bash
cd ./src/BlazeKit.Website
/vercel/.dotnet/dotnet publish -o .blazekit/build/tmp
/vercel/.dotnet/dotnet run ssg
mkdir -p ../../.vercel/output/static
rsync -av .blazekit/build/ssg/ ../../.vercel/output/static/
