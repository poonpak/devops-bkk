pipeline {
    agent any

    tools {
       go "1.24.1"
    }

    stages {
        stage('Check OS User') {
            steps {
                sh 'echo "Running Ansible as user: $(whoami)"' // <-- คำสั่งนี้จะแสดงชื่อผู้ใช้
                sh 'echo "Current working directory is: $(pwd)"'
            }
        }
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
