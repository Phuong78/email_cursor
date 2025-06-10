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
                checkout scm
            }
        }
        
        stage('Provision Customer VM with Terraform') {
            steps {
                dir('infra-customer') {
                    script {
                        echo "Parameters received: CUSTOMER_NAME=${params.CUSTOMER_NAME}, CUSTOMER_EMAIL=${params.CUSTOMER_EMAIL}, QUOTA=${params.QUOTA}"
                        def workspaceName = "${params.CUSTOMER_NAME}".replaceAll('[^a-zA-Z0-9_-]', '')
                        if (workspaceName.isEmpty()) { error "Customer name is invalid." }

                        echo "Preparing workspace: ${workspaceName}"
                        sh 'terraform init -reconfigure'
                        sh "terraform workspace new ${workspaceName} || true"
                        sh "terraform workspace select ${workspaceName}"
                        
                        echo "Running terraform apply..."
                        sh "terraform apply -auto-approve -var customer_name='${params.CUSTOMER_NAME}' -var customer_email='${params.CUSTOMER_EMAIL}' -var quota=${params.QUOTA}"
                        
                        echo "Getting new VM public IP..."
                        def customer_ip = sh(script: 'terraform output -raw customer_vm_public_ip', returnStdout: true).trim()
                        if (customer_ip) {
                            env.CUSTOMER_IP = customer_ip
                        }
                    }
                }
            }
        }

        // ====================================================================
        // STAGE QUAN TRỌNG BỊ THIẾU: CHẠY ANSIBLE ĐỂ CẤU HÌNH MÁY CHỦ
        // ====================================================================
        stage('Configure Customer VM with Ansible') {
            steps {
                script {
                    if (!env.CUSTOMER_IP) {
                        error "Không tìm thấy IP của khách hàng, không thể chạy Ansible."
                    }
                    echo "Waiting 60 seconds for EC2 to be fully ready for SSH..."
                    // Đợi 60 giây để đảm bảo máy chủ đã khởi động hoàn toàn
                    sleep 60 

                    echo "Configuring new server ${env.CUSTOMER_IP} with Ansible..."
                    // Sử dụng SSH key đã lưu trong Jenkins Credentials
                    withCredentials([sshUserPrivateKey(credentialsId: 'customer-vm-ssh-key', keyFileVariable: 'SSH_KEY_FILE')]) {
                        // Tắt kiểm tra host key của Ansible
                        withEnv(['ANSIBLE_HOST_KEY_CHECKING=False']) {
                            sh """
                            ansible-playbook -i "${env.CUSTOMER_IP}," \\
                                             --user ubuntu \\
                                             --private-key ${SSH_KEY_FILE} \\
                                             ansible/provision_customer.yml
                            """
                        }
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
                    def n8nWebhookUrl = "http://n8n:5678/webhook/ad443f1d-001d-4e19-8578-de3d262602f0" // DÙNG PRODUCTION URL
                    def jsonPayload = """{"customerName": "${params.CUSTOMER_NAME}", "customerEmail": "${params.CUSTOMER_EMAIL}", "ip": "${env.CUSTOMER_IP}"}"""
                    sh "curl --fail -X POST -H \"Content-Type: application/json\" -d '${jsonPayload}' ${n8nWebhookUrl}"
                } else if (currentBuild.currentResult != 'SUCCESS') {
                    echo "Build thất bại. Không gửi thông báo."
                }
            }
        }
    }
}