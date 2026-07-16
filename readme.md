
# CI/CD Pipeline Setup with Git, Jenkins, Kubernetes, Monitoring & Logging
## Project Overview  

This project implements an end-to-end Continuous Integration and Continuous Deployment (CI/CD) pipeline that automatically builds, packages, and deploys an application whenever changes are pushed to GitHub.

The solution integrates:

- GitHub
- Jenkins (Declarative Pipeline written in Groovy)
- Docker
- AWS Elastic Container Registry (ECR)
- Kubernetes (kubeadm)
- Prometheus
- Grafana
- Loki

The pipeline minimizes manual intervention, ensures consistent deployments, and provides centralized monitoring and logging.

  

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

![ChatGPT Image](https://github.com/vijaypvk/cicd-jenkins-k8s/blob/main/assets/ChatGPT%20Image%20Jul%2016,%202026,%2007_14_18%20PM.png?raw=true)

---
# Technology Stack

| Component        | Technology                    |
| ---------------- | ----------------------------- |
| Version Control  | GitHub                        |
| CI/CD            | Jenkins                       |
| Pipeline         | Declarative Pipeline (Groovy) |
| Containerization | Docker                        |
| Registry         | AWS ECR                       |
| Orchestration    | Kubernetes                    |
| Monitoring       | Prometheus                    |
| Visualization    | Grafana                       |
| Logging          | Loki                          |

---
## 🎥 Demo Video

👉 [Watch the Demo Video](https://drive.google.com/file/d/1JcBhSlEo3QXChS1C0rD48viMPIo_W_YX/view?usp=sharing)
---



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

│   ├── Dockerfile

│   ├── package.json

│   ├── index.js

│   └── package-lock.json

│

├── k8s/

│   ├── deployment.yaml

│   └── service.yaml

│

├── Jenkinsfile

│

└── README.md

```

  

---

  

# CI/CD Workflow
  
*   **Step 1:** Developer pushes code to GitHub.

``` bash
    git add .

    git commit -m "Feature Update"

    git push origin main
```




*   **Step 2:** GitHub Webhook automatically notifies Jenkins. No manual build is required.

![webhook for trigger based deployment](https://github.com/vijaypvk/cicd-jenkins-k8s/blob/main/assets/Screenshot%202026-07-16%20203950.png?raw=true)


*   **Step 3:** Jenkins Pipeline starts automatically. Pipeline stages include:

    - Checkout

    - Build Docker Image

    - Login to AWS ECR

    - Push Image

    - Deploy to Kubernetes

    - Verify Deployment

![Jenkins CI/CD Pipeline Dashboard](https://github.com/vijaypvk/cicd-jenkins-k8s/blob/main/assets/Screenshot%202026-07-16%20201854.png?raw=true)


*   **Step 4:** Docker image is built.

       ```
        docker build -t cicdapp:latest .
       ```
   


*   **Step 5:** Image is pushed to AWS ECR.

       ```
       docker push 775412354718.dkr.ecr.ap-south-1.amazonaws.com/cicdapp:latest
       ```

  ![Jenkins CI/CD Pipeline Dashboard](https://github.com/vijaypvk/cicd-jenkins-k8s/blob/main/assets/Screenshot%202026-07-16%20201831.png?raw=true)
  

*   **Step 6:** Jenkins deploys the latest image to Kubernetes.

       ```
       kubectl set image deployment/cicdapp cicdapp=775412354718.dkr.ecr.ap-south-1.amazonaws.com/cicdapp:latest
       ```


*   **Step 7:** Kubernetes performs a rolling update:

       ```
        Old Pods ──> New Pods ──> Health Checks ──> Traffic Switch ──> Deployment Complete
       ```
    No downtime occurs during deployment.

  
![Jenkins CI/CD Pipeline Dashboard](https://github.com/vijaypvk/cicd-jenkins-k8s/blob/main/assets/Screenshot%202026-07-16%20201916.png?raw=true)

---

  

# Jenkins Pipeline (Groovy)

  ```
  pipeline {

    agent any

    environment {

        AWS_REGION = "ap-south-1"
        ECR_REGISTRY = "775412354718.dkr.ecr.ap-south-1.amazonaws.com"
        ECR_REPOSITORY = "cicdapp"
        
        IMAGE = "${ECR_REGISTRY}/${ECR_REPOSITORY}:latest"

    }

    stages {

        stage('Checkout') {

            steps {

                git branch: 'main',
                    url: 'https://github.com/vijaypvk/cicd-jenkins-k8s.git'

            }

        }

        stage('Build Docker Image') {

            steps {

                dir('cicdapp') {

                    sh '''
                    docker build -t ${IMAGE} .
                    '''

                }

            }

        }

        stage('Login to ECR') {

            steps {

                withCredentials([
                    [$class: 'AmazonWebServicesCredentialsBinding',
                    credentialsId: 'aws-creds']
                ]) {

                    sh '''
                    aws ecr get-login-password --region ${AWS_REGION} \
                    | docker login --username AWS --password-stdin ${ECR_REGISTRY}
                    '''

                }

            }

        }

        stage('Push Image') {

            steps {

                sh '''
                docker push ${IMAGE}
                '''

            }

        }

        stage('Deploy to Kubernetes') {
            steps {
                sh '''
                    export KUBECONFIG=/var/lib/jenkins/.kube/config

                    kubectl set image deployment/cicdapp \
                    cicdapp=${IMAGE}

                    kubectl rollout status deployment/cicdapp
        '''
    }
}

    }

    post {

        success {

            echo "Deployment Successful"

        }

        failure {

            echo "Deployment Failed"

        }

    }

}
  ```

The CI/CD automation is implemented using a **Jenkins Declarative Pipeline**.

*   **Pipeline stages:** Checkout Source Code, Build Docker Image, Login to AWS ECR, Push Docker Image, Deploy to Kubernetes, Verify Rollout.

*   **Post Build Actions:** Handles success and failure blocks for cleanups and notifications.

*   Since Jenkinsfiles are written in Groovy, the assignment requirement for Groovy scripting is fully satisfied.

  

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

*   **Deployment:** Configured with specific Replica Counts, Rolling Update Strategy, Liveness Probes, and Readiness Probes.

```
apiVersion: apps/v1
kind: Deployment

metadata:
  name: cicdapp

spec:
  replicas: 2

  selector:
    matchLabels:
      app: cicdapp

  template:
    metadata:
      labels:
        app: cicdapp

    spec:
      imagePullSecrets:
        - name: ecr-secret

      containers:
      - name: cicdapp
        image: 775412354718.dkr.ecr.ap-south-1.amazonaws.com/cicdapp:latest
        imagePullPolicy: Always

        ports:
        - containerPort: 3000

        readinessProbe:
          httpGet:
            path: /
            port: 3000
          initialDelaySeconds: 10
          periodSeconds: 5

        livenessProbe:
          httpGet:
            path: /
            port: 3000
          initialDelaySeconds: 20
          periodSeconds: 10
```

*   **Service:** NodePort Service maps external traffic to pods.

```
apiVersion: v1
kind: Service

metadata:
  name: cicdapp-service

spec:
  selector:
    app: cicdapp

  ports:
    - protocol: TCP
      port: 80
      targetPort: 3000

  type: NodePort
```


```text

Readiness Probe ──> Checks application availability

Liveness Probe  ──> Restarts unhealthy containers automatically

```
### Output :

![kubectl get pods](https://github.com/vijaypvk/cicd-jenkins-k8s/blob/main/assets/Screenshot%202026-07-16%20200914.png?raw=true)

![kubectl get svc](https://github.com/vijaypvk/cicd-jenkins-k8s/blob/main/assets/Screenshot%202026-07-16%20200923.png?raw=true)

![output of app](https://github.com/vijaypvk/cicd-jenkins-k8s/blob/main/assets/Screenshot%202026-07-16%20200935.png?raw=true)

 

### AWS ECR Integration

Docker images are stored securely inside AWS Elastic Container Registry.

*   **Benefits:** Central Image Repository, Version Control, Secure Infrastructure, and Easy Rollback capabilities.

  

---

  

# Monitoring & Logging Strategy

  

The project includes a centralized monitoring and logging stack consisting of **Prometheus**, **Loki**, and **Grafana**.

  

### Monitoring (Prometheus)

Monitoring is implemented using Prometheus and Grafana.

Metrics monitored include:

- Jenkins build success/failure
- Pipeline execution duration
- Jenkins queue
- Executor availability
- CPU utilization
- Memory utilization
- JVM metrics
- Kubernetes node health
- Pod health
- Deployment availability
- Cluster resource usage

Benefits

- Detect pipeline failures
- Detect infrastructure bottlenecks
- Monitor deployment health
- Capacity planning
### output:

![kubectl get svc -n monitoring ](https://github.com/vijaypvk/cicd-jenkins-k8s/blob/main/assets/Screenshot%202026-07-16%20201043.png?raw=true)
![helm list monitoring](https://github.com/vijaypvk/cicd-jenkins-k8s/blob/main/assets/Screenshot%202026-07-16%20201113.png?raw=true)
  
![prometheus](https://github.com/vijaypvk/cicd-jenkins-k8s/blob/main/assets/Screenshot%202026-07-16%20201136.png?raw=true)

![jenkins health and perfromance monitoring ](https://github.com/vijaypvk/cicd-jenkins-k8s/blob/main/assets/Screenshot%202026-07-16%20201158.png?raw=true)
### Logging (Loki)

- **Logs Collected:** Kubernetes Pod Logs, Application Logs, Jenkins Logs, and Container Logs.

- **Benefits:** Faster Troubleshooting, Centralized Log Storage, Searchable Logs, and Historical Log Analysis.

![loki logs view in grafana](https://github.com/vijaypvk/cicd-jenkins-k8s/blob/main/assets/Screenshot%202026-07-16%20201704.png?raw=true)

  

### Visualizations (Grafana Dashboards)

*   **Jenkins Dashboard:** Successful/Failed Builds, Queue Length, Build Duration, Jenkins Health, JVM Memory, CPU Usage, and Executor Status.

*   **Kubernetes Dashboard:** Cluster Health, Pod Status, Deployment Status, CPU/Memory Usage, and Node Utilization.


![kubernetes monitoring dashboard](https://github.com/vijaypvk/cicd-jenkins-k8s/blob/main/assets/Screenshot%202026-07-16%20201237.png?raw=true)


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

# Validation & Testing

Deployment validation

```bash
kubectl get pods
kubectl get deployment
kubectl get svc
```

Application validation

```bash
curl http://<NODE-IP>:<NODEPORT>
```

Expected Output

```text
CI/CD Pipeline with Git, Jenkins, Docker, AWS ECR & Kubernetes 🚀
```

Monitoring validation

- Jenkins dashboard available
- Kubernetes dashboard available
- Prometheus targets healthy

Logging validation

- Logs searchable in Grafana Explore
---
 
# Conclusion

  

This project successfully satisfies the assignment requirements by implementing an automated CI/CD pipeline using GitHub, Jenkins (Groovy), Docker, AWS ECR, and Kubernetes.

The pipeline automatically builds and deploys applications after every code commit, reducing manual intervention and ensuring consistent software delivery.

Security best practices, deployment validation, centralized monitoring with Prometheus and Grafana, and centralized logging with Loki have also been implemented, resulting in a robust, scalable, and production-oriented CI/CD solution.
