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
        stage('Image') {
            steps {
                sh "docker build -t ttl.sh/myapp_pp:1h ."
                sh "docker push ttl.sh/myapp_pp:1h"
            }
        }
        
        stage('Deploy') {
            
            steps {
                /*
                withCredentials([sshUserPrivateKey(
                        credentialsId: 'my-ssh-credential', // ใช้ Credentials ID ที่ระบุใน Jenkins UI <<< changeit
                        usernameVariable: 'SSH_USER',        // ตัวแปรสำหรับเก็บชื่อผู้ใช้
                        keyFileVariable: 'SSH_KEY_PATH',     // ตัวแปรสำหรับเก็บพาธของ Private Key (เป็นไฟล์ชั่วคราว)
                        passphraseVariable: 'SSH_PASSPHRASE' // (ทางเลือก) ตัวแปรสำหรับเก็บ Passphrase ถ้ามี
                    )]) {
                }
                */
                withCredentials([file(credentialsId: 'my-key-file', variable: 'KEY_PATH')]) {
                    sh "chmod 400 ${KEY_PATH}"
                    sh """
                        ssh -i ${KEY_PATH} -o StrictHostKeyChecking=no jenkins@docker << EOF
                            docker run -d -p 4444:4444 ttl.sh/myapp_pp:1h
                        EOF
                    """
                    /*
                    sh "scp -i ${KEY_PATH} -o StrictHostKeyChecking=no main laborant@target:~"
                    sh """
                        scp -i ${KEY_PATH} -o StrictHostKeyChecking=no my-app.service laborant@target:~
                        ssh -i ${KEY_PATH} -o StrictHostKeyChecking=no laborant@target << EOF
                            # ย้ายไบนารีไปยังพาธรันไทม์ (ตัวอย่าง /usr/local/bin)
                            sudo mv ~/main /usr/local/bin/main 
                            # ย้าย Service Unit ไปยัง systemd ด้วย sudo
                            sudo mv ~/my-app.service /etc/systemd/system/my-app.service
                            # โหลดการตั้งค่า systemd และรีสตาร์ท Service
                            sudo systemctl daemon-reload
                            sudo systemctl restart my-app.service
                            exit 0
                        EOF
                    """
                    */
                }
            }
            
        }
        stage('Deploy to Kubernetes') {
            steps {
                 withKubeConfig([credentialsId: 'myapikey', serverUrl: 'https://kubernetes:6443']) {
                  sh 'kubectl apply -f deployment.yaml'
                  sh 'kubectl apply -f service.yaml'
                }
            }
        }
        

    }
}
