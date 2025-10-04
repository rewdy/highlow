# AWS Amplify deployment for High/Low React Router app

terraform {
  required_version = ">= 1.0"
  
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = var.aws_region
}

# Amplify App
resource "aws_amplify_app" "highlow" {
  name       = var.app_name
  repository = var.github_repository

  # Build settings for React Router 7 with Bun
  build_spec = <<-EOT
    version: 1
    frontend:
      phases:
        preBuild:
          commands:
            - npm install -g bun
            - bun install
        build:
          commands:
            - bun run build
      artifacts:
        baseDirectory: build/client
        files:
          - '**/*'
      cache:
        paths:
          - node_modules/**/*
    backend:
      phases:
        build:
          commands:
            - npm install -g bun
            - bun install
      artifacts:
        baseDirectory: build/server
        files:
          - '**/*'
  EOT

  # Environment variables
  environment_variables = {
    NODE_VERSION = "22"
    _LIVE_UPDATES = "[{\"pkg\":\"bun\",\"type\":\"internal\",\"version\":\"latest\"}]"
  }

  # Enable SSR
  platform = "WEB_COMPUTE"

  # Custom rules for React Router
  custom_rule {
    source = "/<*>"
    status = "200"
    target = "/index.html"
  }

  # OAuth token for GitHub
  access_token = var.github_token

  # Auto branch creation
  enable_auto_branch_creation = true
  enable_branch_auto_build     = true

  auto_branch_creation_patterns = [
    "main",
    "master",
  ]

  auto_branch_creation_config {
    enable_auto_build = true
    framework         = "React"
    stage             = "PRODUCTION"
  }

  tags = {
    Name        = var.app_name
    Environment = "production"
    ManagedBy   = "terraform"
  }
}

# Main branch
resource "aws_amplify_branch" "main" {
  app_id      = aws_amplify_app.highlow.id
  branch_name = var.main_branch_name
  stage       = "PRODUCTION"

  enable_auto_build = true

  framework = "React"
  
  tags = {
    Name        = "${var.app_name}-main"
    Environment = "production"
  }
}

# Domain association (optional - uncomment if you have a custom domain)
# resource "aws_amplify_domain_association" "highlow" {
#   app_id      = aws_amplify_app.highlow.id
#   domain_name = var.domain_name
#
#   sub_domain {
#     branch_name = aws_amplify_branch.main.branch_name
#     prefix      = ""
#   }
#
#   sub_domain {
#     branch_name = aws_amplify_branch.main.branch_name
#     prefix      = "www"
#   }
# }

# Outputs
output "amplify_app_id" {
  value       = aws_amplify_app.highlow.id
  description = "Amplify App ID"
}

output "amplify_default_domain" {
  value       = "https://${aws_amplify_branch.main.branch_name}.${aws_amplify_app.highlow.default_domain}"
  description = "Default Amplify domain"
}

output "amplify_app_arn" {
  value       = aws_amplify_app.highlow.arn
  description = "Amplify App ARN"
}
