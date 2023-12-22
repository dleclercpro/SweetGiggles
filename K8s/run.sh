#!/bin/bash

# Get the directory containing the script
dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Get K8s directories
services="${dir}/services"
deployments="${dir}/deployments"

# Create service for each deployment
kubectl apply -f $services/Broker.service.yml
kubectl apply -f $services/Order.service.yml
kubectl apply -f $services/Payment.service.yml
kubectl apply -f $services/Delivery.service.yml

# Create deployments
kubectl apply -f $deployments/Broker.deployment.yml
kubectl apply -f $deployments/Order.deployment.yml
kubectl apply -f $deployments/Payment.deployment.yml
kubectl apply -f $deployments/Delivery.deployment.yml

# Expose broker app
# kubectl port-forward service/broker 8080:8000