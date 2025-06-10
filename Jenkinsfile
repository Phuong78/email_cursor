// file: Jenkinsfile - PHIÊN BẢN SỬA LỖI CUỐI CÙNG
pipeline {
    agent any

    // ======================================================
    // SỬA LẠI: ĐỊNH NGHĨA TRIGGER BẰNG KHỐI 'properties'
    // ======================================================
    options {
        // Tùy chọn này giúp job không bị chạy 2 lần khi có thay đổi SCM và webhook
        overrideIndexTriggers(false)
    }
    properties([
        pipelineTriggers([
            // Sử dụng class 'GenericTrigger' của plugin
            [$class: 'GenericTrigger',
                // Trích xuất các biến từ URL (?CUSTOMER_NAME=...&CUSTOMER_EMAIL=...)
                genericVariables: [
                    [key: 'CUSTOMER_NAME', regexpFilter: ''],
                    [key: 'CUSTOMER_EMAIL', regexpFilter: ''],
                    [key: 'QUOTA', regexpFilter: '']
                ],
                // Token để xác thực
                token: 'A_SECRET_TOKEN_FOR_CUSTOMER_JOB',
                // In log để gỡ lỗi
                printPostContent: true,
                printContributedVariables: true,
                causeString: 'Triggered by Generic Webhook'
            ]
        ])
    ])

    parameters {
        // Khối này vẫn cần thiết để job nhận diện các tham số
        string(name: 'CUSTOMER_NAME', defaultValue: '', description: 'Ten cua khach hang moi')
        string(name: 'CUSTOMER_EMAIL', defaultValue: '', description: 'Email lien he cua khach hang')
        string(name: 'QUOTA', defaultValue: '20', description: 'Dung luong (GB) cap cho khach hang')
    }

    stages {
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
                        sh 'terraform init -reconfigure'
                        sh "terraform workspace new ${workspaceName} || true"
                        sh "terraform workspace select ${workspaceName}"
                        echo "Workspace đang được chọn:"
                        sh 'terraform workspace show'
                        
                        echo "Đang chạy terraform apply trong workspace '${workspaceName}'..."
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