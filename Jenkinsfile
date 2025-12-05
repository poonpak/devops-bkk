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
                    sh "ansible-playbook --inventory hosts.ini playbook.yaml"
                }
            }
        }

    }
}
