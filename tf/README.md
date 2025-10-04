# High/Low Terraform Deployment

This directory contains Terraform configuration to deploy the High/Low app to AWS Amplify.

FYI, this is meant to be run locally to setup the Amplify container, then it will get hooked up to github automagically.

## Prerequisites

1. **AWS CLI configured** with appropriate credentials
2. **Terraform installed** (>= 1.0)
3. **GitHub Personal Access Token** with `repo` scope
4. **Git repository** pushed to GitHub

## Setup

1. Copy the example variables file:

   ```bash
   cp terraform.tfvars.example terraform.tfvars
   ```

2. Edit `terraform.tfvars` with your values:
   - `github_repository`: Your GitHub repo URL
   - `github_token`: Your GitHub personal access token
   - `main_branch_name`: Your main branch (usually "main" or "master")

3. Initialize Terraform:

   ```bash
   cd terraform
   terraform init
   ```

4. Review the plan:

   ```bash
   terraform plan
   ```

5. Apply the configuration:

   ```bash
   terraform apply
   ```

## GitHub Token Setup

To create a GitHub personal access token:

1. Go to GitHub Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Click "Generate new token (classic)"
3. Give it a name like "Amplify Deploy"
4. Select scopes: `repo` (full control of private repositories)
5. Generate and copy the token
6. Add it to your `terraform.tfvars` file

## Outputs

After applying, Terraform will output:

- `amplify_app_id`: The Amplify app ID
- `amplify_default_domain`: Your app's URL
- `amplify_app_arn`: The app's ARN

## Custom Domain (Optional)

To use a custom domain:

1. Uncomment the `aws_amplify_domain_association` resource in `main.tf`
2. Uncomment the `domain_name` variable in `variables.tf`
3. Add your domain to `terraform.tfvars`
4. Run `terraform apply`
5. Update your DNS records as instructed by Amplify

## Updating the App

Once deployed, Amplify will automatically rebuild and redeploy whenever you push to your main branch.

## Cleanup

To destroy the infrastructure:

```bash
terraform destroy
```

## Notes

- The build uses Bun instead of npm for faster builds
- SSR is enabled via the `WEB_COMPUTE` platform
- Auto branch creation is enabled for main/master branches
- Build artifacts are cached for faster subsequent builds
