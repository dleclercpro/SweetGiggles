# Define constant image details
user="dleclercpro"
app="eda-playground"
release="v1.3.0"

# Upload local images to Minikube image registry
minikube image load $user/$app-broker:$release
minikube image load $user/$app-order:$release
minikube image load $user/$app-payment:$release
minikube image load $user/$app-delivery:$release