variable "aws_region" {
  description = "AWS region to deploy to"
  type        = string
  default     = "us-east-1"
}

variable "app_name" {
  description = "Name of the Amplify app"
  type        = string
  default     = "highlow"
}

variable "github_repository" {
  description = "GitHub repository URL (e.g., https://github.com/username/repo)"
  type        = string
}

variable "github_token" {
  description = "GitHub personal access token for Amplify to access the repository"
  type        = string
  sensitive   = true
}

variable "main_branch_name" {
  description = "Name of the main branch to deploy"
  type        = string
  default     = "main"
}

# Uncomment if using custom domain
# variable "domain_name" {
#   description = "Custom domain name for the app"
#   type        = string
# }
