pipeline {
    agent any

    environment {
        DOCKER_IMAGE = 'rishabhraj7/node-app'
        IMAGE_TAG = "${env.BUILD_NUMBER}"
        FULL_IMAGE = "rishabhraj7/node-app:${env.BUILD_NUMBER}"
        K8S_DEPLOYMENT = 'node-app-deployment'
        K8S_NAMESPACE = 'default'
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Build Docker Image') {
            steps {
                script {
                    bat "docker build -t %DOCKER_IMAGE%:%IMAGE_TAG% ."
                }
            }
        }

        stage('Push to DockerHub') {
            steps {
                withDockerRegistry([credentialsId: 'docker-hub-creds', url: '']) {
                    bat "docker push %DOCKER_IMAGE%:%IMAGE_TAG%"
                }
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
                withCredentials([file(credentialsId: 'kubeconfig', variable: 'KUBECONFIG')]) {
                    bat """
                        kubectl apply -f k8s\\deployment.yaml
                        kubectl apply -f k8s\\service.yaml
                        kubectl set image deployment/%K8S_DEPLOYMENT% node-app=%DOCKER_IMAGE%:%IMAGE_TAG% -n %K8S_NAMESPACE%
                        kubectl rollout status deployment/%K8S_DEPLOYMENT% -n %K8S_NAMESPACE%
                    """
                }
            }
        }
    }

    post {
        success {
            echo '✅ Deployment successful!'
        }
        failure {
            echo '❌ Something went wrong.'
        }
    }
}
