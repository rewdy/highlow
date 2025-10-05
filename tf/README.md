# AWS Amplify Deployment with Terraform

This directory contains Terraform configuration to deploy the High/Low app to AWS Amplify with optional custom domain support.

## What This Sets Up

- **AWS Amplify App** with SSR support (WEB_COMPUTE platform)
- **Automatic deployments** from GitHub (on push to main)
- **CloudFront CDN** (automatically included by Amplify)
- **SSL/TLS Certificate** (automatically created and managed by Amplify via ACM)
- **Custom domain support** (optional) with automatic certificate validation
- **Route 53 DNS records** (optional - can be managed by Terraform or manually)

## Prerequisites

1. **AWS Account** with appropriate permissions
2. **AWS CLI** configured with credentials (`aws configure`)
3. **Terraform** installed (>= 1.0)
4. **GitHub Personal Access Token** with `repo` and `admin:repo_hook` permissions
5. **(Optional) Domain in Route 53** if you want to use a custom domain

## Quick Start

### 1. Configure Your Variables

```bash
cd tf
cp terraform.tfvars.example terraform.tfvars
```

Edit `terraform.tfvars` with your values:

```hcl
aws_region        = "us-east-1"
app_name          = "highlow"
github_repository = "https://github.com/rewdy/highlow"
github_token      = "ghp_your_actual_token_here"
main_branch_name  = "main"

# For custom domain (optional):
domain_name     = "yourdomain.com"      # Your Route 53 domain
route53_zone_id = "Z1234567890ABC"      # Your Route 53 hosted zone ID
```

### 2. Initialize Terraform

```bash
terraform init
```

### 3. Preview Changes

```bash
terraform plan
```

### 4. Deploy

```bash
terraform apply
```

Type `yes` when prompted to confirm.

## Custom Domain Setup

### Option A: Automatic DNS Management (Recommended)

If you provide both `domain_name` and `route53_zone_id`, Terraform will:
1. Create the Amplify domain association
2. Request an ACM certificate
3. Automatically add the required DNS records to Route 53
4. Wait for certificate validation

**To find your Route 53 Zone ID:**
1. Go to AWS Console → Route 53 → Hosted zones
2. Click on your domain
3. Copy the "Hosted zone ID" (looks like `Z1234567890ABC`)

### Option B: Manual DNS Management

If you only provide `domain_name` (without `route53_zone_id`), Terraform will:
1. Create the Amplify domain association
2. Request an ACM certificate
3. Output instructions for DNS records you need to add manually

**After `terraform apply`, you'll need to:**
1. Run `terraform output amplify_domain_verification_record` to get the DNS record
2. Go to Route 53 → Hosted zones → Your domain
3. Add the DNS records shown in the Amplify console or Terraform output
4. Wait for DNS propagation and certificate validation (can take 5-30 minutes)

### Option C: No Custom Domain

Leave `domain_name = ""` to use only the default Amplify domain:
- `https://main.xxxxx.amplifyapp.com`

## What Amplify Handles Automatically

You **DO NOT** need to separately configure:
- ✅ **CloudFront CDN** - Amplify uses CloudFront behind the scenes
- ✅ **SSL/TLS Certificate** - Amplify creates and manages ACM certificates
- ✅ **Certificate Renewal** - Amplify auto-renews certificates
- ✅ **Global Edge Locations** - Content is distributed via CloudFront
- ✅ **HTTPS Redirects** - Amplify handles HTTP → HTTPS redirects
- ✅ **Brotli/Gzip Compression** - Automatic at CloudFront edge

## Outputs

After deployment, you'll see:

```
amplify_app_id              = "d1234567890abc"
amplify_default_domain      = "https://main.d1234567890abc.amplifyapp.com"
amplify_app_arn            = "arn:aws:amplify:..."
custom_domain_url          = "https://yourdomain.com" (if configured)
dns_instructions           = "..." (if manual DNS setup needed)
amplify_domain_verification_record = "..." (DNS record for validation)
```

## Monitoring & Logs

- **Amplify Console**: AWS Console → Amplify → highlow
- **Build Logs**: Click on a build to see detailed logs
- **Access Logs**: Available in CloudWatch (via CloudFront)

## Troubleshooting

### Domain Validation Taking Too Long

If certificate validation is stuck:
1. Check Route 53 records are correctly added
2. Verify the domain name matches exactly (no trailing dots)
3. DNS propagation can take up to 48 hours (usually 5-30 minutes)
4. Check the Amplify console for specific validation errors

### Build Failures

Check the Amplify console build logs:
1. AWS Console → Amplify → highlow → Main branch
2. Click on the failed build
3. Review each phase (preBuild, build, postBuild)

Common issues:
- GitHub token permissions
- Bun installation issues
- Build command failures

### Custom Domain Not Working

1. Verify DNS records in Route 53 match Amplify requirements
2. Check certificate status in ACM console
3. Ensure domain is pointing to Amplify's CloudFront distribution
4. Try accessing via `www.yourdomain.com` and root domain separately

## Cost Estimate

AWS Amplify pricing (as of 2025):
- **Build minutes**: $0.01 per minute (first 1,000 minutes/month free)
- **Hosting (SSR)**: ~$0.15 per GB served + $0.30 per GB stored
- **Free tier**: 15 GB served/month, 5 GB stored/month (12 months)

Estimated monthly cost for low-moderate traffic: **$5-20/month**

## Security Notes

- ⚠️ **NEVER commit `terraform.tfvars`** - it contains secrets
- The `github_token` is marked as sensitive in Terraform state
- Store Terraform state securely (consider using S3 backend with encryption)
- Rotate GitHub tokens periodically

## Cleanup

To destroy all resources:

```bash
terraform destroy
```

Type `yes` when prompted. This will:
- Delete the Amplify app
- Remove DNS records (if managed by Terraform)
- Release the ACM certificate
- Clean up CloudFront distributions

⚠️ **Note**: The domain itself (Route 53 hosted zone) is NOT deleted.

---

For issues or questions, check the [AWS Amplify documentation](https://docs.aws.amazon.com/amplify/).
