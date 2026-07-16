# CI/CD Pipeline Setup with Git, Jenkins, Kubernetes, Monitoring & Logging

## Project Overview

This project demonstrates a complete Continuous Integration and Continuous Deployment (CI/CD) pipeline using **GitHub**, **Jenkins**, **Docker**, **AWS Elastic Container Registry (ECR)**, and **Kubernetes (kubeadm)**.

The objective is to automate the software delivery process so that every code change pushed to GitHub is automatically built, containerized, pushed to a container registry, and deployed to a Kubernetes cluster with minimal manual intervention.

Additionally, the solution includes monitoring and logging using **Prometheus**, **Grafana**, and **Loki** to provide complete visibility into the CI/CD pipeline and Kubernetes environment.

---

# Problem Statement

Build a scalable CI/CD pipeline that:

- Automatically triggers builds when code is pushed to GitHub.
- Builds Docker images using Jenkins.
- Pushes images to AWS Elastic Container Registry (ECR).
- Deploys applications automatically to Kubernetes.
- Uses Groovy (Jenkins Pipeline) for automation.
- Provides monitoring and centralized logging.
- Follows security best practices.

---

# Architecture

```text
Developer
│
│ Git Push
▼
GitHub Repository
│
│ Webhook
▼
Jenkins
│
├── Checkout Source Code
├── Build Docker Image
├── Login to AWS ECR
├── Push Image
└── Deploy to Kubernetes
│
▼
Kubernetes Cluster
│
├── Deployment
├── Service
└── Running Application
│
├───────────────┐
│               │
▼               ▼
Prometheus     Loki
│               │
└──────┬────────┘
       ▼
    Grafana
```

## Technology Stack

| Component | Technology |
| :--- | :--- |
| **Version Control** | GitHub |
| **CI Server** | Jenkins |
| **Pipeline** | Jenkins Declarative Pipeline (Groovy) |
| **Containerization** | Docker |
| **Container Registry** | AWS Elastic Container Registry (ECR) |
| **Container Orchestration** | Kubernetes (kubeadm) |
| **Monitoring** | Prometheus |
| **Visualization** | Grafana |
| **Logging** | Loki |

## Operating System & Infrastructure

The project uses two Virtual Machines:

### VM-1 : Jenkins Server
**Installed Components:**
- Jenkins
- Docker
- AWS CLI
- kubectl
- Git

**Responsibilities:**
- Clone Git repository
- Build Docker image
- Push image to AWS ECR
- Deploy application to Kubernetes

### VM-2 : Kubernetes Cluster
**Installed Components:**
- kubeadm
- kubelet
- kubectl
- Container Runtime
- Calico Network Plugin

**Responsibilities:**
- Run application containers
- Expose services
- Perform rolling updates
- Health monitoring

---

# Repository Structure

```text
cicd-jenkins-k8s/
│
├── cicdapp/
│   ├── Dockerfile
│   ├── package.json
│   ├── index.js
│   └── package-lock.json
│
├── k8s/
│   ├── deployment.yaml
│   └── service.yaml
│
├── Jenkinsfile
│
└── README.md
```

---

# CI/CD Workflow

*   **Step 1:** Developer pushes code to GitHub.
    ```bash
    git add .
    git commit -m "Feature Update"
    git push origin main
    ```
*   **Step 2:** GitHub Webhook automatically notifies Jenkins. No manual build is required.
*   **Step 3:** Jenkins Pipeline starts automatically. Pipeline stages include:
    - Checkout
    - Build Docker Image
    - Login to AWS ECR
    - Push Image
    - Deploy to Kubernetes
    - Verify Deployment
*   **Step 4:** Docker image is built.
    ```bash
    docker build -t cicdapp:latest .
    ```
*   **Step 5:** Image is pushed to AWS ECR.
    ```bash
    docker push 775412354718.dkr.ecr.ap-south-1.amazonaws.com/cicdapp:latest
    ```
*   **Step 6:** Jenkins deploys the latest image to Kubernetes.
    ```bash
    kubectl set image deployment/cicdapp cicdapp=775412354718.dkr.ecr.ap-south-1.amazonaws.com/cicdapp:latest
    ```
*   **Step 7:** Kubernetes performs a rolling update:
    ```text
    Old Pods ──> New Pods ──> Health Checks ──> Traffic Switch ──> Deployment Complete
    ```
    No downtime occurs during deployment.

---

# Jenkins Pipeline (Groovy)

The CI/CD automation is implemented using a **Jenkins Declarative Pipeline**.
*   **Pipeline stages:** Checkout Source Code, Build Docker Image, Login to AWS ECR, Push Docker Image, Deploy to Kubernetes, Verify Rollout.
*   **Post Build Actions:** Handles success and failure blocks for cleanups and notifications.
*   Since Jenkinsfiles are written in Groovy, the assignment requirement for Groovy scripting is fully satisfied.

### Jenkins Plugins Used
- Git Plugin
- Docker Plugin
- Docker Pipeline
- Kubernetes CLI Plugin
- Credentials Plugin
- AWS Credentials Plugin
- Pipeline Plugin
- Blue Ocean (Optional)

---

# Kubernetes Deployment & AWS ECR Integration

### Application Architecture
The application is deployed using native Kubernetes manifests:
*   **Deployment:** Configured with specific Replica Counts, Rolling Update Strategy, Liveness Probes, and Readiness Probes.
*   **Service:** NodePort Service maps external traffic to pods.

```text
Readiness Probe ──> Checks application availability
Liveness Probe  ──> Restarts unhealthy containers automatically
```

### AWS ECR Integration
Docker images are stored securely inside AWS Elastic Container Registry.
*   **Benefits:** Central Image Repository, Version Control, Secure Infrastructure, and Easy Rollback capabilities.

---

# Monitoring & Logging Strategy

The project includes a centralized monitoring and logging stack consisting of **Prometheus**, **Loki**, and **Grafana**.

### Monitoring (Prometheus)
- **Responsibilities:** Collect Jenkins Metrics, Collect Kubernetes Metrics, Monitor Node Health, Monitor Pod Health, Monitor Deployment Status, and Monitor Resource Usage.
- **Metrics Collected:** CPU/Memory Usage, Pod & Node Status, Deployment Availability, Build Metrics, JVM Metrics, and Queue Metrics.

### Logging (Loki)
- **Logs Collected:** Kubernetes Pod Logs, Application Logs, Jenkins Logs, and Container Logs.
- **Benefits:** Faster Troubleshooting, Centralized Log Storage, Searchable Logs, and Historical Log Analysis.

### Visualizations (Grafana Dashboards)
*   **Jenkins Dashboard:** Successful/Failed Builds, Queue Length, Build Duration, Jenkins Health, JVM Memory, CPU Usage, and Executor Status.
*   **Kubernetes Dashboard:** Cluster Health, Pod Status, Deployment Status, CPU/Memory Usage, and Node Utilization.

---

# Security, Scalability, & Error Handling

### Security Best Practices
- **Jenkins Credentials:** AWS Access Keys are stored securely inside Jenkins Credentials; passwords/keys are never hardcoded inside the Jenkinsfile.
- **Kubernetes Secrets:** Docker registry authentication is handled via `imagePullSecrets`.
- **Least Privilege:** Only required AWS IAM permissions are granted to the execution role.
- **Secure Communication:** Jenkins communicates securely with Kubernetes using encrypted `kubeconfig`.

### Error Handling & Validation
The pipeline performs automatic validation post-deployment:
```bash
kubectl rollout status deployment cicdapp
```
If the deployment fails, the pipeline stops, the error logs are caught, and the status is marked as **Failed** to prevent shipping broken changes.

### Scalability
The solution is fully parameterized and reusable. Changing the configuration variables enables the same engine to support multiple repositories, namespaces, images, and Kubernetes clusters.

---

# Assignment Requirement Mapping

| Requirement | Status |
| :--- | :--- |
| Git triggers Jenkins | ✅ Completed |
| Automatic Build | ✅ Completed |
| Docker Image Build | ✅ Completed |
| Push to AWS ECR | ✅ Completed |
| Deploy to Kubernetes | ✅ Completed |
| Groovy Automation | ✅ Completed |
| Scalable Pipeline | ✅ Completed |
| Error Handling | ✅ Completed |
| Security Best Practices | ✅ Completed |
| Documentation | ✅ Completed |
| Monitoring | ✅ Completed |
| Logging | ✅ Completed |
| Health Monitoring | ✅ Completed |

---

# Application Code Adjustment

To match the architecture defined in this setup without mixing up with unauthorized GitOps engines, ensure your application entrypoint (`cicdapp/index.js`) handles roots as follows:

```javascript
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("CI/CD Pipeline with GitHub, Jenkins, Docker, AWS ECR & Kubernetes 🚀");
});

app.listen(PORT, () => {
  console.log(`Application running on port ${PORT}`);
});
```

---

# Conclusion

This project successfully implements a complete CI/CD pipeline using GitHub, Jenkins, Docker, AWS ECR, and Kubernetes. The pipeline automatically builds and deploys applications whenever code is pushed to GitHub, eliminating manual deployment steps and ensuring consistent software delivery.
