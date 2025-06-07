resource "aws_vpc" "demo_vpc_2024" {
  cidr_block = var.vpc_cidr
  tags = {
    Name = "demo-vpc-2024"
  }
}

resource "aws_internet_gateway" "demo_igw_2024" {
  vpc_id = aws_vpc.demo_vpc_2024.id
  tags = {
    Name = "demo-igw-2024"
  }
}

resource "aws_subnet" "demo_subnet_2024" {
  vpc_id                  = aws_vpc.demo_vpc_2024.id
  cidr_block              = var.public_subnet_cidr
  map_public_ip_on_launch = true
  availability_zone       = "${var.aws_region}a"
  tags = {
    Name = "demo-subnet-2024"
  }
}

resource "aws_route_table" "demo_rt_2024" {
  vpc_id = aws_vpc.demo_vpc_2024.id
  tags = {
    Name = "demo-rt-2024"
  }
}

resource "aws_route" "demo_route_2024" {
  route_table_id         = aws_route_table.demo_rt_2024.id
  destination_cidr_block = "0.0.0.0/0"
  gateway_id             = aws_internet_gateway.demo_igw_2024.id
}

resource "aws_route_table_association" "demo_rta_2024" {
  subnet_id      = aws_subnet.demo_subnet_2024.id
  route_table_id = aws_route_table.demo_rt_2024.id
}

resource "aws_security_group" "demo_sg_2024" {
  name        = "demo-sg-2024"
  description = "Allow SSH and HTTP"
  vpc_id      = aws_vpc.demo_vpc_2024.id

  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 8080
    to_port     = 8080
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "demo-sg-2024"
  }
}

resource "aws_instance" "jenkins_demo_2024" {
  ami                    = data.aws_ami.ubuntu.id
  instance_type          = var.instance_type
  subnet_id              = aws_subnet.demo_subnet_2024.id
  vpc_security_group_ids = [aws_security_group.demo_sg_2024.id]
  key_name               = var.key_name

  tags = {
    Name = "jenkins-demo-2024"
  }
}

data "aws_ami" "ubuntu" {
  most_recent = true
  owners      = ["099720109477"] # Canonical

  filter {
    name   = "name"
    values = ["ubuntu/images/hvm-ssd/ubuntu-jammy-22.04-amd64-server-*"]
  }
}
