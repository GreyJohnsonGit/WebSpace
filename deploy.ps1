podman build -f Dockerfile -t health-tracker-service .
podman tag health-tracker-service:latest localhost:5000/health-tracker-service:latest
Start-Process powershell -Verb RunAs -ArgumentList "minikube image load --overwrite localhost:5000/health-tracker-service"
kubectl apply -f .\k8.deployment.yml
kubectl apply -f .\k8.service.yml