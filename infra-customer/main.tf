provider "aws" {
  region = var.aws_region
}

# TẠO MỘT SECURITY GROUP RIÊNG CHO MỖI KHÁCH HÀNG
resource "aws_security_group" "customer_sg" {
  name        = "sg-customer-${var.customer_name}"
  description = "Allow SSH traffic for customer"
  vpc_id      = data.aws_vpc.default.id

  # Luồng truy cập vào: Cho phép SSH từ mọi nơi
  ingress {
    description      = "SSH from Anywhere"
    from_port        = 22
    to_port          = 22
    protocol         = "tcp"
    # LƯU Ý: Cho phép mọi IP (0.0.0.0/0) là tiện lợi cho demo,
    # nhưng trong môi trường thực tế, bạn nên giới hạn lại chỉ IP của bạn.
    cidr_blocks      = ["0.0.0.0/0"]
  }

  # Luồng đi ra ngoài: Cho phép mọi kết nối đi ra
  egress {
    from_port        = 0
    to_port          = 0
    protocol         = "-1"
    cidr_blocks      = ["0.0.0.0/0"]
  }

  tags = {
    Name = "sg-customer-${var.customer_name}"
  }
}

# Lấy thông tin AMI, VPC, Subnet như cũ
data "aws_ami" "ubuntu" {
  most_recent = true
  owners      = ["099720109477"] # Canonical
  filter {
    name   = "name"
    values = ["ubuntu/images/hvm-ssd/ubuntu-jammy-22.04-amd64-server-*"]
  }
}
data "aws_vpc" "default" {
  default = true
}
data "aws_subnet" "default" {
  vpc_id            = data.aws_vpc.default.id
  availability_zone = "${var.aws_region}a"
}

# CẬP NHẬT: GÁN SECURITY GROUP MỚI VÀO EC2
resource "aws_instance" "customer_vm" {
  ami           = data.aws_ami.ubuntu.id
  instance_type = var.instance_type
  key_name      = var.key_name
  subnet_id     = data.aws_subnet.default.id
  
  # Dòng quan trọng: Gán Security Group đã tạo ở trên
  vpc_security_group_ids = [aws_security_group.customer_sg.id]

  tags = {
    Name    = "customer-${var.customer_name}"
    Email   = var.customer_email
    Project = "EmailServiceDemo"
  }
}

# Output giữ nguyên
output "customer_vm_public_ip" {
  value = aws_instance.customer_vm.public_ip
}