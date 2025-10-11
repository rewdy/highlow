# AWS Amplify Deployment with Terraform

This directory contains Terraform configuration to deploy the HighLow app to AWS Amplify with custom domain support for `highlow.lol`.

## What This Sets Up

- **AWS Amplify App** - Static SPA hosting (no SSR)
- **Automatic deployments** from GitHub (on push to main)
- **CloudFront CDN** (automatically included by Amplify)
- **SSL/TLS Certificate** (automatically created and managed by Amplify via ACM)
- **Custom domain** `highlow.lol` with www subdomain
- **Route 53 DNS records** (automatically managed by Terraform)

## Prerequisites

1. **AWS Account** with appropriate permissions
2. **AWS CLI** configured with credentials (`aws configure`)
3. **Terraform** installed (>= 1.0)
4. **GitHub Personal Access Token** with `repo` scope
   - Create at: https://github.com/settings/tokens
5. **Route 53 Hosted Zone** for `highlow.lol` (you already have this!)

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
domain_name       = "highlow.lol"
route53_zone_id   = "Z1234567890ABC"  # Find in Route 53 console
```

**To find your Route 53 Zone ID:**
1. Go to AWS Console → Route 53 → Hosted zones
2. Click on `highlow.lol`
3. Copy the "Hosted zone ID" (starts with Z...)

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

## What Happens Next

1. **Amplify creates your app** (~2 min)
2. **GitHub integration is set up** - every push to `main` triggers a build
3. **SSL certificate is requested** from AWS Certificate Manager (ACM)
4. **DNS records are created** in Route 53 for:
   - `highlow.lol` → Amplify CloudFront distribution
   - `www.highlow.lol` → Amplify CloudFront distribution
   - Certificate verification CNAME
5. **Domain is verified** (~5-10 min for DNS propagation)
6. **First build starts automatically**

## Accessing Your App

After deployment completes (5-15 minutes total):

```bash
terraform output
```

You'll see:
- **Default Amplify URL**: `https://main.d1234567890abc.amplifyapp.com` (available immediately)
- **Custom domain**: `https://highlow.lol` (available after DNS propagation)
- **www subdomain**: `https://www.highlow.lol` (redirects to root domain)

## Updating the App

Just push to GitHub! Amplify will automatically:
1. Detect the push
2. Run `bun install` and `bun run build`
3. Deploy the new build to CloudFront
4. Invalidate the CDN cache

**Zero manual deployment steps needed.** 🎉

## What Amplify Handles Automatically

You **DO NOT** need to separately configure:
- ✅ **CloudFront CDN** - Global edge locations included
- ✅ **SSL/TLS Certificate** - ACM certificate auto-created and managed
- ✅ **Certificate Renewal** - Auto-renewed before expiration
- ✅ **HTTPS Redirects** - HTTP → HTTPS automatic
- ✅ **Brotli/Gzip Compression** - Enabled at CloudFront edge
- ✅ **SPA Routing** - Client-side routing works correctly
- ✅ **CI/CD Pipeline** - GitHub webhook → build → deploy

## Outputs

After deployment:

```
amplify_app_id              = "d1234567890abc"
amplify_default_domain      = "https://main.d1234567890abc.amplifyapp.com"
amplify_app_arn            = "arn:aws:amplify:us-east-1:..."
custom_domain_url          = "https://highlow.lol"
dns_instructions           = "DNS records managed by Terraform"
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

Check build logs in Amplify console:
1. AWS Console → Amplify → highlow → Main branch
2. Click on the failed build
3. Review each build phase (preBuild, build)

Common issues:
- GitHub token expired → regenerate and update `terraform.tfvars`
- Bun version mismatch → check `_LIVE_UPDATES` environment variable
- Build output directory wrong → verify Vite builds to `/build`

### Custom Domain Not Working

- **DNS propagation takes 5-10 minutes** - be patient!
- Check Route 53 records: `terraform state list | grep route53`
- Verify in Amplify console: App → Domain management
- Try `dig highlow.lol` to check DNS resolution
- SSL certificate validation can take up to 30 minutes

## Cost Estimate

AWS Amplify pricing for static SPA hosting:
- **Build minutes**: $0.01 per minute
  - Free tier: 1000 build minutes/month
  - Typical build: ~2 minutes
- **Hosting**: $0.15 per GB served
  - Free tier: 15 GB/month
- **Route 53**: $0.50/month for hosted zone

**Estimated monthly cost for HighLow: < $1/month** (likely $0 with free tier) 💰

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
- Delete the Amplify app and builds
- Remove DNS records from Route 53
- Release the ACM certificate
- Clean up CloudFront distributions

⚠️ **Note**: Your Route 53 hosted zone for `highlow.lol` will NOT be deleted (managed separately).

---

For issues or questions, check the [AWS Amplify documentation](https://docs.aws.amazon.com/amplify/).
