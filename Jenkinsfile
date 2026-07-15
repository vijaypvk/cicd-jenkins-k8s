pipeline {

    agent any

    environment {

        AWS_REGION = "ap-south-1"
        ECR_REGISTRY = "775412354718.dkr.ecr.ap-south-1.amazonaws.com"
        ECR_REPOSITORY = "cicdapp"

        //IMAGE_TAG = "${BUILD_NUMBER}"
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