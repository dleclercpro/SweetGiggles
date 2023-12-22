#!/bin/bash

# Get the directory containing the script
dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Change the current directory to the apps directory
cd "$dir/../Apps"

# Define constant image details
user="dleclercpro"
app="eda-playground"
release="k8s"

# Push app images to Dockerhub
docker push $user/$app-broker:$release
docker push $user/$app-order:$release
docker push $user/$app-payment:$release
docker push $user/$app-delivery:$release