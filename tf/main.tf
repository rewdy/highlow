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

# Local values for cleaner outputs
locals {
  dns_setup_instructions = <<-EOT
    
    ⚠️  MANUAL DNS SETUP REQUIRED ⚠️
    
    To complete domain setup, add these records to your Route 53 hosted zone:
    
    1. Go to AWS Console → Route 53 → Hosted zones → ${var.domain_name}
    2. Look at the Amplify console for the exact DNS records to add
    3. Or run: terraform output amplify_domain_verification_record
    
    Alternatively, set the 'route53_zone_id' variable and run terraform apply again
    to have Terraform create the DNS records automatically.
  EOT
  
  dns_managed_message = "DNS records managed by Terraform (or no custom domain configured)"
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

# Domain association - Amplify will automatically:
# - Create an ACM certificate
# - Validate it via DNS
# - Set up CloudFront CDN
# - Provide DNS records to add to Route 53
resource "aws_amplify_domain_association" "highlow" {
  count = var.domain_name != "" ? 1 : 0

  app_id      = aws_amplify_app.highlow.id
  domain_name = var.domain_name

  # Wait for SSL certificate validation
  wait_for_verification = true

  # Root domain
  sub_domain {
    branch_name = aws_amplify_branch.main.branch_name
    prefix      = ""
  }

  # www subdomain
  sub_domain {
    branch_name = aws_amplify_branch.main.branch_name
    prefix      = "www"
  }
}

# Optional: Automatically create Route 53 records
#
# Not sure if I need these...
#
# This requires you to provide the Route 53 zone ID
# If you prefer to add DNS records manually, comment this out
# resource "aws_route53_record" "amplify_root" {
#   count = var.domain_name != "" && var.route53_zone_id != "" ? 1 : 0

#   zone_id = var.route53_zone_id
#   name    = var.domain_name
#   type    = "A"

#   alias {
#     name                   = aws_amplify_domain_association.highlow[0].certificate_verification_dns_record
#     zone_id                = aws_amplify_domain_association.highlow[0].id
#     evaluate_target_health = false
#   }
# }

# resource "aws_route53_record" "amplify_www" {
#   count = var.domain_name != "" && var.route53_zone_id != "" ? 1 : 0

#   zone_id = var.route53_zone_id
#   name    = "www.${var.domain_name}"
#   type    = "CNAME"

#   ttl     = 300
#   records = [aws_amplify_domain_association.highlow[0].certificate_verification_dns_record]
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

output "custom_domain_url" {
  value       = var.domain_name != "" ? "https://${var.domain_name}" : "Not configured"
  description = "Custom domain URL (if configured)"
}

output "dns_instructions" {
  value       = var.domain_name != "" && var.route53_zone_id == "" ? local.dns_setup_instructions : local.dns_managed_message
  description = "Instructions for manual DNS setup (if needed)"
}

output "amplify_domain_verification_record" {
  value       = var.domain_name != "" ? aws_amplify_domain_association.highlow[0].certificate_verification_dns_record : "Not applicable"
  description = "DNS verification record for Amplify domain"
  sensitive   = false
}
