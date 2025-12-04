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
                script {
                    // ID นี้คือ ID ของ Credential (SSH Username with Private Key) ที่คุณสร้างไว้
                    def sshCredentialId = '19284c9e-49dd-4ae2-805b-3fd74d481d49' 
                    
                    sshagent(credentials: [sshCredentialId]) {
                        
                        // คำสั่ง scp จะรู้ว่าต้องใช้ Key ที่ถูกโหลดใน Agent โดยอัตโนมัติ
                        // ไม่ต้องใช้ -i /path/to/key
                        def sourceFile = 'main'
                        def targetUser = 'laborant'
                        def targetHost = 'target'
                        
                        // **สำคัญ:** หากคุณยังพบปัญหา Host key verification failed 
                        // ให้ใช้ -o StrictHostKeyChecking=no ชั่วคราวในการทดสอบ
                        sh "scp -o StrictHostKeyChecking=no ${sourceFile} ${targetUser}@${targetHost}:~"
                    }
                }
            }
        }

    }
}
