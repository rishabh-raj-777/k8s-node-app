pipeline {
    agent any

    environment {
        DOCKER_IMAGE = 'rishabhraj7/node-app'
        IMAGE_TAG = "${BUILD_NUMBER}"                       // ✅ BUILD_NUMBER is already exposed
        FULL_IMAGE = "rishabhraj7/node-app:${BUILD_NUMBER}" // ✅ Optional, if you want
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
                bat "docker build -t %DOCKER_IMAGE%:%IMAGE_TAG% ."
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
                        echo 🔁 Applying Kubernetes manifests...
                        kubectl apply -f k8s\\deployment.yaml
                        kubectl apply -f k8s\\service.yaml

                        echo 🔁 Setting new image...
                        kubectl set image deployment/%K8S_DEPLOYMENT% node-app=%DOCKER_IMAGE%:%IMAGE_TAG% -n %K8S_NAMESPACE%

                        echo 🔍 Checking rollout status...
                        kubectl rollout status deployment/%K8S_DEPLOYMENT% -n %K8S_NAMESPACE% --timeout=60s || (
                            echo ❌ Rollout failed or timed out. Dumping pod state...
                            kubectl get pods -n %K8S_NAMESPACE%
                            kubectl describe deployment/%K8S_DEPLOYMENT% -n %K8S_NAMESPACE%
                            kubectl get events -n %K8S_NAMESPACE% --sort-by=.metadata.creationTimestamp
                            exit 1
                        )
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
            echo '❌ Deployment failed. Check logs above.'
        }
    }
}
