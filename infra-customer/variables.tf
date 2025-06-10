# infra-customer/variables.tf

variable "aws_region" {
  default = "us-east-1"
}

variable "instance_type" {
  default = "t2.micro"
}

variable "key_name" {
  description = "SSH key pair name"
  default     = "nguyenp-key-pair" # Đảm bảo key này tồn tại
}

# Các biến này sẽ được Jenkins truyền vào
variable "customer_name" {
  description = "Name of the new customer"
  type        = string
}

variable "customer_email" {
  description = "Contact email of the new customer"
  type        = string
}

variable "quota" {
  description = "Disk quota for the customer in GB"
  type        = number
  default     = 20
}