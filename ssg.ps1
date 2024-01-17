cd ./src/BlazeKit.Website
dotnet publish -o .blazekit/build/tmp
dotnet run ssg ../../.vercel/output/static
cd ..
cd ..
