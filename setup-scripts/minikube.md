
Install minikube
```powershell
winget install Kubernetes.minikube
```

Open admin terminal:
```powershell
Start-Process powershell -Verb RunAs
```

Start minikube service:
```powershell
minikube start
```

Create `Deployment`
```powershell
kubectl create deployment hello-node --image=registry.k8s.io/e2e-test-images/agnhost:2.53 -- /agnhost netexec --http-port=8080
```

View `Deployment`s
```powershell
kubectl get deployments
```

View `Pod`s
```powershell
kubectl get pods
```

View `Event`s
```powershell
kubectl get events
```

View config
```powershell
minikube config view
```

View pod logs
```powershell
kubectl logs <pod-name>
```

Expose pod to internet
```powershell
kubectl expose deployment hello-node --type=LoadBalancer --port=8080
```

Build `basic-ui` image
```powershell
podman build -f Dockerfile -t basic-ui .
```

Promote image `basic-ui` to minikube
```powershell
minikube image load basic-ui:latest
```

Create image repository
```powershell
podman run -d -p 5000:5000 --name local-registry registry:2
```

Push image to local registry
```powershell
podman tag basic-ui:latest localhost:5000/basic-ui:latest
podman push --tls-verify=false localhost:5000/basic-ui:latest
```

```powershell
kubectl apply -f .\k8.deployment.yml
```
Promote image from local registry to minikube
```powershell
minikube image load localhost:5000/basic-ui
```

Get service URL
```powershell
minikube service <SERVICE_LABEL> --url
```