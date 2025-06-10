# email_service_demo/jenkins_config/Dockerfile - PHIÊN BẢN HOÀN CHỈNH

FROM jenkins/jenkins:lts

# Chuyển sang user root để có quyền cài đặt phần mềm
USER root

# BƯỚC 1: Cài đặt TẤT CẢ các gói hệ thống cần thiết
RUN apt-get update && apt-get install -y \
    sudo \
    curl \
    gnupg \
    lsb-release \
    software-properties-common \
    python3-pip \
    git

# BƯỚC 2: Cài đặt Ansible bằng pip
RUN pip3 install ansible --break-system-packages

# BƯỚC 3: Cài đặt Terraform (THEO PHƯƠNG PHÁP MỚI, ĐÁNG TIN CẬY HƠN)
# Tải GPG key của HashiCorp và thêm vào keyring của apt một cách an toàn
RUN install -m 0755 -d /etc/apt/keyrings
RUN curl -fsSL https://apt.releases.hashicorp.com/gpg | gpg --dearmor -o /etc/apt/keyrings/hashicorp.gpg
RUN chmod a+r /etc/apt/keyrings/hashicorp.gpg

# Thêm kho chứa của HashiCorp vào danh sách nguồn của apt
RUN echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/hashicorp.gpg] https://apt.releases.hashicorp.com $(lsb_release -cs) main" | tee /etc/apt/sources.list.d/hashicorp.list

# Cuối cùng, cập nhật lại danh sách gói và cài đặt Terraform
RUN apt-get update && apt-get install -y terraform

# Chuyển về lại user jenkins mặc định
USER jenkins