pipeline {
    agent any

    environment {
        DOCKER_IMAGE = 'rishabhraj7/node-app'
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
                    docker.build(env.DOCKER_IMAGE)
                }
            }
        }

        stage('Push to DockerHub') {
            steps {
                withDockerRegistry([credentialsId: 'docker-hub-creds', url: '']) {
                    script {
                        bat "docker tag %DOCKER_IMAGE% %DOCKER_IMAGE%:latest"
                        bat "docker push %DOCKER_IMAGE%:latest"
                    }
                }
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
                withCredentials([file(credentialsId: 'kubeconfig', variable: 'KUBECONFIG')]) {
                    bat '''
                        kubectl apply -f k8s\\deployment.yaml
                        kubectl apply -f k8s\\service.yaml
                        kubectl set image deployment/%K8S_DEPLOYMENT% node-app=%DOCKER_IMAGE% -n %K8S_NAMESPACE%
                        kubectl rollout status deployment/%K8S_DEPLOYMENT% -n %K8S_NAMESPACE%
                    '''
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
