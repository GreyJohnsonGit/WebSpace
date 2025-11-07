
```podman build -f Dockerfile -t basic-ui .```
```podman tag basic-ui:latest localhost:5000/basic-ui:latest```
```minikube image load --overwrite localhost:5000/basic-ui```
```kubectl apply -f .\k8.deployment.yml```
