pipeline {
    agent any

    tools {
        go "1.24.1" // ใช้ Go tool version 1.24.1
    }

    // กำหนดตัวแปรสำหรับ Deploy
    def remote_user = 'laborant'
    def remote_host = 'target'
    def credentials_id = 'my-key-file'
    def app_binary = 'main'          // ชื่อไฟล์ไบนารีที่ได้จาก 'go build'
    def service_file = 'my-app.service' // ชื่อไฟล์ systemd service unit

    stages {
        stage('Test') {
            steps {
                sh "go test ./..."
            }
        }
        
        stage('Build') {
            steps {
                // ตรวจสอบให้แน่ใจว่าไฟล์ที่ถูกสร้างชื่อ 'main' อยู่ใน Workspace
                sh "go build -o ${app_binary} app/main.go" 
            }
        }
        
        stage('Deploy') {
            steps {
                // ใช้ withCredentials เพื่อดึง SSH Private Key
                withCredentials([file(credentialsId: credentials_id, variable: 'KEY_PATH')]) {
                    sh """
                        # 1. ตั้งค่าสิทธิ์ของ Private Key
                        chmod 400 ${KEY_PATH}
                        
                        echo "Starting deployment to ${remote_user}@${remote_host}..."

                        # 2. SCP ไบนารี (main) ไปยัง Home Directory บนเครื่องปลายทาง
                        scp -i ${KEY_PATH} -o StrictHostKeyChecking=no ${app_binary} ${remote_user}@${remote_host}:~/

                        # 3. SCP Service Unit (my-app.service) ไปยัง Home Directory บนเครื่องปลายทาง
                        # **หมายเหตุ:** ต้องแน่ใจว่าไฟล์ my-app.service อยู่ใน Jenkins Workspace
                        scp -i ${KEY_PATH} -o StrictHostKeyChecking=no ${service_file} ${remote_user}@${remote_host}:~/

                        # 4. SSH เข้าเครื่องปลายทางเพื่อสั่งงานด้วย sudo
                        ssh -i ${KEY_PATH} -o StrictHostKeyChecking=no ${remote_user}@${remote_host} << EOF
                            echo "Executing remote setup..."
                            
                            # B. ย้าย Service Unit ไปยัง systemd (ต้องใช้ sudo)
                            sudo mv ~/${service_file} /etc/systemd/system/${service_file}
                            
                            # C. โหลดการตั้งค่า systemd ใหม่
                            sudo systemctl daemon-reload
                            
                            # D. รีสตาร์ท Service
                            sudo systemctl restart ${service_file}
                            
                            # E. ตรวจสอบสถานะ (ทางเลือก)
                            sudo systemctl status ${service_file} || true 
                            
                            exit 0
                        EOF
                        echo "Deployment and service restart complete."
                    """
                }
            }
        }
    }
}
