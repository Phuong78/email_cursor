# file: email_service_demo/jenkins_config/Dockerfile

# Bắt đầu từ image Jenkins chính thức
FROM jenkins/jenkins:lts

# Chuyển sang user root để có quyền cài đặt phần mềm
USER root

# Cập nhật và cài đặt các công cụ cơ bản + python3-pip
RUN apt-get update && apt-get install -y sudo curl gnupg python3-pip

# DÙNG PIP ĐỂ CÀI ANSIBLE VỚI TÙY CHỌN BỎ QUA CẢNH BÁO
RUN pip3 install ansible --break-system-packages

# Cài đặt Terraform (giữ nguyên như cũ)
RUN curl -fsSL https://apt.releases.hashicorp.com/gpg | apt-key add -
RUN apt-add-repository "deb [arch=amd64] https://apt.releases.hashicorp.com $(lsb_release -cs) main"
RUN apt-get update && apt-get install -y terraform

# Chuyển về lại user jenkins mặc định
USER jenkins