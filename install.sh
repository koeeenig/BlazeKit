#!/usr/bin/env bash
yum -y install wget tar gzip libicu
wget https://dot.net/v1/dotnet-install.sh -O dotnet-install.sh
chmod +x ./dotnet-install.sh
./dotnet-install.sh --version latest
