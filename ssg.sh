#!/usr/bin/env bash
cd ./src/BlazeKit.Website
/vercel/.dotnet/dotnet publish -o .blazekit/build/tmp
/vercel/.dotnet/dotnet run ssg ../../.vercel/output/static
