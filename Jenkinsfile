pipeline {
    agent any

    tools {
       go "1.24.1"
    }

    stages {
        stage('Test') {
              steps {
                   sh "go test ./..."
              }
        }
        stage('Build') {
            steps {
                sh "go build app/main.go"
            }
        }
        stage('Deploy') {
            steps {
                withCredentials([file(credentialsId: '19284c9e-49dd-4ae2-805b-3fd74d481d49', variable: 'KEY_PATH')]) {
                    sh "chmod 400 ${KEY_PATH}"
                    sh "scp -i ${KEY_PATH} -o StrictHostKeyChecking=no main laborant@target:~"
                }
            }
        }

    }
}
