# file: email_service_demo/jenkins_config/Dockerfile - PHIÊN BẢN HOÀN CHỈNH

# Bắt đầu từ image Jenkins chính thức
FROM jenkins/jenkins:lts

# Chuyển sang user root để có quyền cài đặt phần mềm
USER root

# BƯỚC 1: Cài đặt TẤT CẢ các gói hệ thống cần thiết trong một lệnh duy nhất
RUN apt-get update && apt-get install -y \
    sudo \
    curl \
    gnupg \
    lsb-release \
    software-properties-common \
    python3-pip \
    git

# BƯỚC 2: Cài đặt Ansible bằng pip (đã khắc phục lỗi PEP 668)
RUN pip3 install ansible --break-system-packages

# BƯỚC 3: Cài đặt Terraform (bây giờ sẽ thành công vì đã có lsb-release và apt-add-repository)
RUN curl -fsSL https://apt.releases.hashicorp.com/gpg | apt-key add -
RUN apt-add-repository "deb [arch=amd64] https://apt.releases.hashicorp.com $(lsb_release -cs) main"
RUN apt-get update && apt-get install -y terraform

# Chuyển về lại user jenkins mặc định
USER jenkins