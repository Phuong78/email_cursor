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
                echo "Bắt đầu lấy mã nguồn từ Git..."
                // Jenkins sẽ tự động thực hiện bước checkout khi cấu hình SCM
                // Lệnh này chỉ để ghi log
            }
        }
        
        stage('Chạy Terraform tạo máy chủ') {
            steps {
                dir('infra-customer') {
                    script {
                        echo "Đang chạy terraform init..."
                        sh 'terraform init -reconfigure'
                        
                        echo "Đang chạy terraform apply..."
                        sh "terraform apply -auto-approve -var customer_name='${params.CUSTOMER_NAME}' -var customer_email='${params.CUSTOMER_EMAIL}'"
                    }
                }
            }
        }

        stage('Hoàn tất') {
            steps {
                echo "Tạo máy chủ cho khách hàng ${params.CUSTOMER_NAME} thành công!"
            }
        }
    }
}