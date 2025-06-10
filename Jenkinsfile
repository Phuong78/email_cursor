// file: Jenkinsfile - PHIÊN BẢN SỬA LỖI CUỐI CÙNG
pipeline {
    agent any

    parameters {
        string(name: 'CUSTOMER_NAME', defaultValue: 'Test', description: 'Ten cua khach hang moi')
        string(name: 'CUSTOMER_EMAIL', defaultValue: 'test@example.com', description: 'Email lien he cua khach hang')
        string(name: 'QUOTA', defaultValue: '20', description: 'Dung luong (GB) cap cho khach hang')
    }

    stages {
        stage('Checkout Source Code') {
            steps {
                echo "Mã nguồn đã được checkout."
                checkout scm
            }
        }
        
        stage('Provision Customer VM with Terraform') {
            steps {
                dir('infra-customer') {
                    script {
                        echo "Parameters received: CUSTOMER_NAME=${params.CUSTOMER_NAME}, CUSTOMER_EMAIL=${params.CUSTOMER_EMAIL}, QUOTA=${params.QUOTA}"
                        def workspaceName = "${params.CUSTOMER_NAME}".replaceAll('[^a-zA-Z0-9_-]', '')

                        if (workspaceName.isEmpty()) {
                            error "Tên khách hàng sau khi làm sạch bị rỗng! Không thể tạo workspace."
                        }

                        echo "Đang chuẩn bị workspace: ${workspaceName}"
                        sh 'terraform init -reconfigure'
                        sh "terraform workspace new ${workspaceName} || true"
                        sh "terraform workspace select ${workspaceName}"
                        
                        echo "Đang chạy terraform apply..."
                        sh "terraform apply -auto-approve -var customer_name='${params.CUSTOMER_NAME}' -var customer_email='${params.CUSTOMER_EMAIL}' -var quota=${params.QUOTA}"
                        
                        echo "Lấy địa chỉ IP của máy chủ mới..."
                        def customer_ip = sh(script: 'terraform output -raw customer_vm_public_ip', returnStdout: true).trim()
                        if (customer_ip) {
                            env.CUSTOMER_IP = customer_ip
                        }
                    }
                }
            }
        }

        stage('Hoàn tất') {
            steps {
                // ========================================================
                // SỬA LỖI Ở ĐÂY: BỌC TOÀN BỘ LOGIC BÊN TRONG KHỐI 'script'
                // ========================================================
                script {
                    echo "Hoàn tất xử lý cho khách hàng ${params.CUSTOMER_NAME}!"
                    if (env.CUSTOMER_IP) {
                        echo "Máy chủ đã được tạo với IP: ${env.CUSTOMER_IP}"
                    }
                }
            }
        }
    }

    post {
        always {
            script {
                if (currentBuild.currentResult == 'SUCCESS' && env.CUSTOMER_IP) {
                    echo "Build thành công. Gửi thông tin khách hàng và IP đến n8n..."
                    
                    def n8nWebhookUrl = "http://n8n:5678/webhook/ad443f1d-001d-4e19-8578-de3d262602f0"

                    def jsonPayload = """
                    {
                        "customerName": "${params.CUSTOMER_NAME}",
                        "customerEmail": "${params.CUSTOMER_EMAIL}",
                        "ip": "${env.CUSTOMER_IP}"
                    }
                    """
                    sh """
                    curl --fail -X POST -H "Content-Type: application/json" -d '${jsonPayload}' ${n8nWebhookUrl}
                    """
                } else if (currentBuild.currentResult != 'SUCCESS') {
                    echo "Build thất bại. Không gửi thông báo."
                }
            }
        }
    }
}