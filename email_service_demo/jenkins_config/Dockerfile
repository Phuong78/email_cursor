# file: email_service_demo/jenkins_config/Dockerfile

# Bắt đầu từ image Jenkins chính thức
FROM jenkins/jenkins:lts

# Chuyển sang user root để có quyền cài đặt phần mềm
USER root

# Cập nhật và cài đặt các công cụ cần thiết
RUN apt-get update && apt-get install -y sudo software-properties-common curl gnupg

# Cài đặt Ansible
RUN add-apt-repository --yes --update ppa:ansible/ansible && apt-get install -y ansible

# Cài đặt Terraform
RUN curl -fsSL https://apt.releases.hashicorp.com/gpg | apt-key add -
RUN apt-add-repository "deb [arch=amd64] https://apt.releases.hashicorp.com $(lsb_release -cs) main"
RUN apt-get update && apt-get install -y terraform

# Chuyển về lại user jenkins mặc định để tăng cường bảo mật
USER jenkins