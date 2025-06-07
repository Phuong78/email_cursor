variable "aws_region" {
  description = "AWS region"
  default     = "us-east-1"
}

variable "aws_profile" {
  description = "AWS CLI profile name"
  default     = "default"
}

variable "vpc_cidr" {
  default = "10.20.0.0/16"
}

variable "public_subnet_cidr" {
  default = "10.20.1.0/24"
}

variable "instance_type" {
  default = "t2.micro"
}

variable "key_name" {
  description = "Tên SSH key pair đã tạo trên AWS"
  default     = "nguyenp-key-pair"
}

# infra/variables.tf
variable "private_key_path" {
  description = "Path to the SSH private key file"
  default     = "~/.ssh/nguyenp-key-pair.pem" # <-- Sửa lại cho đúng với đường dẫn của bạn
}
