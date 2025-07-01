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
                    docker.build(DOCKER_IMAGE)
                }
            }
        }

        stage('Push to DockerHub') {
            steps {
                withDockerRegistry([credentialsId: 'docker-hub-creds', url: '']) {
                    script {
                        docker.image(DOCKER_IMAGE).push()
                    }
                }
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
                bat """
                set KUBECONFIG=\"C:\\Users\\rishabh raj\\.kube\\config\"
                kubectl set image deployment/${K8S_DEPLOYMENT} node-app=${DOCKER_IMAGE} -n ${K8S_NAMESPACE}
                """
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