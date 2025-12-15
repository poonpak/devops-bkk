provider "aws" {
  region = "ap-southeast-1"
}

resource "aws_key_pair" "main" {
  key_name   = "mykey3"
  ## replace the key with the content from previous command
  public_key = "ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAACAQDRnZcbfrQeHOd14wjKwzbeh0rWpiOgHQ5X+B7RVIsVSzUGShjJhs/xR9waz1N6R5fy4iCODE8yMAww6x0lGJKasrRmIK/YqTMaqYdnWy43gB3bEiUbwuuzAXzIbRR261A7CtbI0rByvcfyTt3XQRxei5X8gS+dAJVM6pnkXtioiYYLgCKhLWlJSUU6kSpU/ppLZ7ZdgZcV/7xGzZ3esX1KeKLX8cngXYY6IQ8iAm4cGpbe9sZ2lkE3ljwcIWusQ5XmDU3Iu8GugnCEK5mOjKeTuw0H46xGS2QZkfbNFFBaioMIQ17hhdUA9So602GUfPloy1vG3WYDYzKLhFOzCgEFePgtcqMaKQ4x0eeULaoZVT/rw1VwkE9X8Rwscyhv+EwFVxvAplQQA5CPl8PXATL9T+lZiFpwz15jFll04wI18eyB1OGAxhBZ6UV1oeaDPrr1Oveu/Dnix+/Gxaz2wiq535nH/8kNfFSaO6bPcNT5uRzt1i2te7iddPuK7MUbEQjRys5QDnxTxHktOjtfEqRJGzqjNEv7MHSLMB0FelcpKu73NT8JIhUYS1TU2Rp6eVRBQP2xqHB+cHCwOPi7lxugGHSfaN600qwiTacTCtPMi+dCzDc3acPdUh7foV8NiZHG8nKiJQ9nntXG73qCQv2kFLxclWEJeEgJbYkyzAfbcQ== maksymprokopov@maksymprokopov-K2TDG245VV"
}

resource "aws_security_group" "main" {
  name        = "allow-ssh-and-4444"
  description = "Allow SSH and port 4444 from anywhere"

  ingress {
    description = "SSH from anywhere"
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    description = "Port 4444 from anywhere"
    from_port   = 4444
    to_port     = 4444
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    description = "Allow all outbound traffic"
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "allow-ssh-and-4444"
  }
}

resource "aws_instance" "main" {
  ami           = "ami-00d8fc944fb171e29"
  instance_type = "t3.micro"
  key_name      = aws_key_pair.main.id
  
  vpc_security_group_ids = [aws_security_group.main.id]

  tags = {
    Name = "HelloWorld"
  }
}
