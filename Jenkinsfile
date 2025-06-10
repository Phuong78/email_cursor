// file: Jenkinsfile - PHIÊN BẢN ĐÃ SỬA LỖI
pipeline {
    agent any

    // ======================================================
    // SỬA LỖI Ở ĐÂY:
    // 1. Đổi tên 'pipelineTriggers' thành 'triggers'
    // 2. Chuyển khối này ra ngoài 'options'
    // ======================================================
    

    parameters {
        // Khối này vẫn cần thiết để job nhận diện các tham số
        string(name: 'CUSTOMER_NAME', defaultValue: 'Test', description: 'Ten cua khach hang moi')
        string(name: 'CUSTOMER_EMAIL', defaultValue: 'test@example.com', description: 'Email lien he cua khach hang')
        string(name: 'QUOTA', defaultValue: '20', description: 'Dung luong (GB) cap cho khach hang')
    }

    stages {
        // Giữ nguyên các stage như cũ
        stage('Checkout Source Code') {
            steps {
                echo "Mã nguồn đã được checkout."
                checkout scm
            }
        }
        
        stage('Chạy Terraform tạo máy chủ cho Khách hàng') {
            steps {
                dir('infra-customer') {
                    script {
                        echo "Parameters received: CUSTOMER_NAME=${params.CUSTOMER_NAME}, CUSTOMER_EMAIL=${params.CUSTOMER_EMAIL}"
                        def workspaceName = "${params.CUSTOMER_NAME}".replaceAll('[^a-zA-Z0-9_-]', '')

                        if (workspaceName.isEmpty()) {
                            error "Tên khách hàng sau khi làm sạch bị rỗng! Không thể tạo workspace."
                        }

                        echo "Đang chuẩn bị workspace: ${workspaceName}"
                        // Chúng ta sẽ sử dụng Jenkins Credentials ở các bước sau
                        sh 'terraform init -reconfigure'
                        sh "terraform workspace new ${workspaceName} || true"
                        sh "terraform workspace select ${workspaceName}"
                        
                        echo "Đang chạy terraform apply..."
                        sh "terraform apply -auto-approve -var customer_name='${params.CUSTOMER_NAME}' -var customer_email='${params.CUSTOMER_EMAIL}' -var quota=${params.QUOTA}"
                    }
                }
            }
        }

        stage('Hoàn tất') {
            steps {
                echo "Hoàn tất xử lý cho khách hàng ${params.CUSTOMER_NAME}!"
            }
        }
    }
}
post {
        always {
            script {
                // Kiểm tra xem job có chạy thành công và biến môi trường CUSTOMER_IP có tồn tại không
                if (currentBuild.currentResult == 'SUCCESS' && env.CUSTOMER_IP) {
                    echo "Build thành công. Gửi thông tin khách hàng và IP đến n8n..."
                    
                    // BẠN CẦN TẠO MỘT WEBHOOK TRÊN N8N VÀ DÁN URL VÀO ĐÂY
                    def n8nWebhookUrl = "https://your-n8n-instance.com/webhook/customer-created"

                    def jsonPayload = """
                    {
                        "customerName": "${params.CUSTOMER_NAME}",
                        "customerEmail": "${params.CUSTOMER_EMAIL}",
                        "ip": "${env.CUSTOMER_IP}"
                    }
                    """

                    // Dùng curl để gửi dữ liệu JSON
                    sh """
                    curl -X POST -H "Content-Type: application/json" -d '${jsonPayload}' ${n8nWebhookUrl}
                    """
                } else if (currentBuild.currentResult != 'SUCCESS') {
                    echo "Build thất bại. Không gửi thông báo."
                }
            }
        }
    }
