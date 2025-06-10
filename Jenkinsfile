// file: Jenkinsfile - PHIÊN BẢN ĐÃ SỬA LỖI
pipeline {
    agent any

    // ======================================================
    // SỬA LỖI Ở ĐÂY:
    // 1. Đổi tên 'pipelineTriggers' thành 'triggers'
    // 2. Chuyển khối này ra ngoài 'options'
    // ======================================================
    triggers {
        GenericTrigger(
            genericVariables: [
                [key: 'CUSTOMER_NAME', value: '$.body.customerName'],
                [key: 'CUSTOMER_EMAIL', value: '$.body.customerEmail'],
                [key: 'QUOTA', value: '$.body.quota']
            ],
            // Token để xác thực
            token: 'A_SECRET_TOKEN_FOR_CUSTOMER_JOB',
            // In log để gỡ lỗi
            printPostContent: true,
            printContributedVariables: true,
            causeString: 'Triggered by Generic Webhook'
        )
    }

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
                        sh "terraform apply -auto-approve -var customer_name='${params.CUSTOMER_NAME}' -var customer_email='${params.CUSTOMER_EMAIL}'"
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