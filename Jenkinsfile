// Jenkinsfile
pipeline {
    agent any

    tools {
        terraform 'terraform-latest'
    }

    parameters {
        string(name: 'CUSTOMER_NAME', defaultValue: '', description: 'Ten cua khach hang moi')
        string(name: 'CUSTOMER_EMAIL', defaultValue: '', description: 'Email lien he cua khach hang')
        string(name: 'QUOTA', defaultValue: '20', description: 'Dung luong (GB) cap cho khach hang')
    }

    stages {
        stage('Checkout Source Code') {
            steps {
                // Jenkins tự checkout code khi dùng SCM
                echo "Mã nguồn đã được checkout."
            }
        }
        
        stage('Chạy Terraform tạo máy chủ cho Khách hàng') {
            steps {
                dir('infra-customer') {
                    script {
                        // BƯỚC GỠ LỖI: Kiểm tra các tham số nhận được
                        echo "Parameters received: CUSTOMER_NAME=${params.CUSTOMER_NAME}, CUSTOMER_EMAIL=${params.CUSTOMER_EMAIL}"
                        
                        // Tạo một tên workspace an toàn từ tên khách hàng
                        def workspaceName = "${params.CUSTOMER_NAME}".replaceAll('[^a-zA-Z0-9_-]', '')

                        if (workspaceName.isEmpty()) {
                            error "Tên khách hàng sau khi làm sạch bị rỗng! Không thể tạo workspace."
                        }

                        echo "Đang chuẩn bị workspace: ${workspaceName}"
                        
                        sh 'terraform init -reconfigure'

                        // BƯỚC GỠ LỖI: In ra danh sách các workspace hiện có
                        echo "Các workspace hiện tại:"
                        sh 'terraform workspace list'

                        // Tách lệnh tạo và chọn workspace để rõ ràng hơn
                        // Cú pháp `|| true` để bỏ qua lỗi nếu workspace đã tồn tại
                        sh "terraform workspace new ${workspaceName} || true"
                        sh "terraform workspace select ${workspaceName}"

                        // BƯỚC GỠ LỖI: In ra workspace đang được sử dụng
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