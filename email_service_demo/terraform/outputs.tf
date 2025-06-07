output "jenkins_public_ip" {
  value = aws_instance.jenkins_demo_2024.public_ip
}

output "vpc_id" {
  value = aws_vpc.demo_vpc_2024.id
}

output "subnet_id" {
  value = aws_subnet.demo_subnet_2024.id
}
