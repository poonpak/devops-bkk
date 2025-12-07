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
                withCredentials([file(credentialsId: 'my-key-file', variable: 'KEY_PATH')]) {
                    sh "chmod 400 ${KEY_PATH}"
                    sh "scp -i ${KEY_PATH} -o StrictHostKeyChecking=no main laborant@target:~"
                    sh "scp my-app.service laborant@target:/etc/systemd/system/"
                }
            }
        }

    }
}
