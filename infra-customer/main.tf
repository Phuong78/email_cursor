# file: infra-customer/main.tf

# Khai báo nhà cung cấp dịch vụ đám mây là AWS
provider "aws" {
  region = var.aws_region
}

# Tìm kiếm AMI (Amazon Machine Image) mới nhất của Ubuntu 22.04
data "aws_ami" "ubuntu" {
  most_recent = true
  owners      = ["099720109477"] # Canonical
  filter {
    name   = "name"
    values = ["ubuntu/images/hvm-ssd/ubuntu-jammy-22.04-amd64-server-*"]
  }
}

# Lấy thông tin về VPC (mạng) mặc định trong tài khoản AWS của bạn
data "aws_vpc" "default" {
  default = true
}

# Lấy thông tin về Subnet (mạng con) mặc định trong VPC đó
data "aws_subnet" "default" {
  vpc_id            = data.aws_vpc.default.id
  # Đảm bảo bạn có subnet ở availability zone này
  availability_zone = "${var.aws_region}a"
}

# ĐÂY LÀ PHẦN QUAN TRỌNG NHẤT: ĐỊNH NGHĨA VIỆC TẠO MỘT MÁY CHỦ EC2
resource "aws_instance" "customer_vm" {
  ami                    = data.aws_ami.ubuntu.id
  instance_type          = var.instance_type
  key_name               = var.key_name
  subnet_id              = data.aws_subnet.default.id
  # Gán thẻ (tag) cho EC2 để dễ quản lý, tên sẽ chứa tên khách hàng
  tags = {
    Name    = "customer-${var.customer_name}"
    Email   = var.customer_email
    Project = "EmailServiceDemo"
  }
}

# Output để trả về IP public của máy chủ vừa tạo
output "customer_vm_public_ip" {
  value = aws_instance.customer_vm.public_ip
}