# CI/CD Pipeline Setup with Git, Jenkins, Docker, AWS ECR and Kubernetes

## Overview

This project demonstrates a complete Continuous Integration and Continuous Deployment (CI/CD) pipeline that automates the software delivery process using Git, Jenkins, Docker, AWS Elastic Container Registry (ECR), and Kubernetes.

Whenever a developer pushes code to the GitHub repository, Jenkins automatically builds the application, creates a Docker image, pushes the image to AWS ECR, and deploys the latest version to a Kubernetes cluster.

The implementation minimizes manual intervention, ensures deployment consistency, and follows modern DevOps practices.

---

# Architecture

```
                   Developer
                       │
                 Git Push (GitHub)
                       │
                 GitHub Webhook
                       │
                 Jenkins Pipeline
                       │
        ┌──────────────┼──────────────┐
        │              │              │
   Build Docker    Push Image     Deploy
      Image         to AWS ECR    to Kubernetes
        │              │              │
        └──────────────┼──────────────┘
                       │
               Kubernetes Cluster
                       │
                Deployment + Service
                       │
               Running Application
                       │
      ┌────────────────┴────────────────┐
      │                                 │
  Prometheus                      Grafana
 (Monitoring)                    (Dashboard)

```

---

# Technology Stack

| Component | Technology |
|------------|------------|
| Source Code | GitHub |
| CI/CD | Jenkins |
| Containerization | Docker |
| Container Registry | AWS ECR |
| Orchestration | Kubernetes (kubeadm) |
| Build Script | Jenkins Pipeline (Groovy) |
| Monitoring | Prometheus |
| Visualization | Grafana |
| Logging | Kubernetes Logs (kubectl logs) |

---

# Infrastructure

Two Ubuntu Virtual Machines were used.

## VM 1

Jenkins Server

Installed Components

- Jenkins
- Docker
- AWS CLI
- kubectl
- Git

Responsibilities

- Pull code from GitHub
- Build Docker image
- Push image to AWS ECR
- Deploy application to Kubernetes

---

## VM 2

Kubernetes Cluster

Installed Components

- kubeadm
- kubelet
- kubectl
- Container Runtime
- Calico Network Plugin

Responsibilities

- Run application pods
- Load balancing
- Health monitoring
- Container orchestration

---

# Project Structure

```
cicd-jenkins-k8s/

│
├── Jenkinsfile
│
├── cicdapp/
│      ├── Dockerfile
│      ├── index.js
│      ├── package.json
│      └── package-lock.json
│
└── k8s/
       ├── deployment.yaml
       └── service.yaml
```

---

# CI/CD Pipeline Workflow

## Step 1

Developer pushes code to GitHub.

↓

## Step 2

GitHub triggers Jenkins automatically.

↓

## Step 3

Jenkins checks out the latest source code.

↓

## Step 4

Docker image is built.

```
docker build
```

↓

## Step 5

Docker image is pushed to AWS ECR.

```
docker push
```

↓

## Step 6

Jenkins updates the Kubernetes Deployment.

```
kubectl set image
```

↓

## Step 7

Kubernetes performs a Rolling Update.

↓

## Step 8

Application becomes available through Kubernetes Service.

---

# Jenkins Pipeline Stages

## Checkout

Downloads the latest source code from GitHub.

---

## Build Docker Image

Builds the Docker image from the Dockerfile.

---

## Login to AWS ECR

Authenticates Jenkins using AWS Credentials stored securely in Jenkins Credentials Manager.

---

## Push Docker Image

Pushes the Docker image to AWS Elastic Container Registry.

---

## Deploy to Kubernetes

Updates the Deployment image.

```
kubectl set image deployment/cicdapp ...
```

Waits until deployment completes.

```
kubectl rollout status
```

---

# Kubernetes Deployment

The application is deployed using a Kubernetes Deployment with

- Multiple Replicas
- Rolling Updates
- Readiness Probe
- Liveness Probe

Deployment Features

- High Availability
- Automatic Restart
- Zero Downtime Deployment
- Self Healing

---

# Service

Application is exposed using

```
NodePort Service
```

Example

```
http://<Node-IP>:31039
```

Application Output

```
CI/CD Pipeline with Git, Jenkins, Docker, AWS ECR & Kubernetes 🚀
```

---

# Monitoring

Monitoring is implemented using

- Prometheus
- Grafana

## Prometheus

Prometheus continuously collects metrics from

- Kubernetes Nodes
- Pods
- Deployments
- Services
- CPU Usage
- Memory Usage

Useful Commands

```
kubectl top nodes
```

```
kubectl top pods
```

---

## Grafana

Grafana provides dashboards for

- CPU Usage
- Memory Usage
- Pod Health
- Cluster Status
- Deployment Metrics
- Resource Utilization

Benefits

- Real-time Monitoring
- Alert Visualization
- Historical Metrics
- Dashboard Reporting

---

# Logging

Application logging is managed through Kubernetes.

Useful Commands

```
kubectl logs deployment/cicdapp
```

```
kubectl logs <pod-name>
```

Logs include

- Application Startup
- Runtime Logs
- Errors
- Debug Information

Future Enhancement

Centralized logging can be implemented using

- Grafana Loki
- ELK Stack

---

# Health Checks

The application includes

## Readiness Probe

Determines whether the application is ready to receive traffic.

```
HTTP GET /
```

---

## Liveness Probe

Automatically restarts unhealthy containers.

```
HTTP GET /
```

Benefits

- Improved Reliability
- Automatic Recovery
- Zero Manual Intervention

---

# Scalability

The solution is designed to support multiple

- Git Repositories
- Jenkins Pipelines
- Kubernetes Clusters
- Applications

Scaling Example

```
kubectl scale deployment cicdapp --replicas=5
```

Kubernetes automatically creates additional Pods.

---

# Security Best Practices

The following security practices were implemented.

## Jenkins Credentials

AWS Access Keys are stored securely inside Jenkins Credentials.

No credentials are stored in source code.

---

## Kubernetes Secrets

Docker Registry authentication is managed using

```
imagePullSecrets
```

---

## AWS ECR

Docker images are stored securely in AWS Elastic Container Registry.

---

## Least Privilege

Only the required IAM permissions are granted for

- Push Image
- Pull Image

---

## Version Controlled Infrastructure

Deployment manifests are maintained in Git.

Benefits

- Auditability
- Rollback
- Version History

---

# Error Handling

The pipeline provides clear feedback for failures.

Examples

Build Failure

```
Docker Build Failed
```

Deployment Failure

```
kubectl rollout status
```

Image Pull Failure

```
ImagePullBackOff
```

Authentication Failure

```
AWS Login Failed
```

Jenkins marks the build as

```
SUCCESS
```

or

```
FAILED
```

allowing quick troubleshooting.

---

# Validation

## Verify Pods

```
kubectl get pods
```

---

## Verify Deployment

```
kubectl get deployment
```

---

## Verify Service

```
kubectl get svc
```

---

## Verify Logs

```
kubectl logs deployment/cicdapp
```

---

## Verify Rollout

```
kubectl rollout status deployment/cicdapp
```

---

## Verify Application

```
curl http://localhost:31039
```

Output

```
CI/CD Pipeline with Git, Jenkins, Docker, AWS ECR & Kubernetes 🚀
```

---

# Assignment Requirements Mapping

| Requirement | Status |
|-------------|--------|
| Git commit triggers Jenkins build | ✅ Completed |
| Jenkins builds Docker image | ✅ Completed |
| Push image to AWS ECR | ✅ Completed |
| Deploy to Kubernetes | ✅ Completed |
| Groovy Pipeline | ✅ Completed |
| Kubernetes Deployment | ✅ Completed |
| Health Checks | ✅ Completed |
| Logging | ✅ Completed |
| Monitoring | ✅ Completed |
| Security Best Practices | ✅ Completed |
| Error Handling | ✅ Completed |
| Scalable Architecture | ✅ Completed |

---

# Future Enhancements

- Argo CD for GitOps deployment
- Trivy Image Scanning
- SonarQube Code Quality Analysis
- Slack/Email Notifications
- Horizontal Pod Autoscaler (HPA)
- Blue-Green Deployment
- Canary Deployment
- Grafana Loki for centralized logging

---

# Conclusion

This project successfully implements a complete CI/CD pipeline using GitHub, Jenkins, Docker, AWS ECR, and Kubernetes. The pipeline automates application build, containerization, registry management, and deployment while ensuring reliability, scalability, security, monitoring, and logging.

The solution reduces manual intervention, provides consistent deployments, supports future enhancements, and demonstrates modern DevOps best practices suitable for production-ready environments.