#!/bin/bash

# Post-deployment script to update dashboard configuration
# This script extracts stack outputs and updates dashboard configuration

set -e

STACK_NAME="MLEWTrackerStack-dev"
DASHBOARD_DIR="../dashboard"

echo "📦 Extracting stack outputs..."

# Get stack outputs
API_ENDPOINT=$(aws cloudformation describe-stacks \
  --stack-name $STACK_NAME \
  --query 'Stacks[0].Outputs[?OutputKey==`ApiEndpoint`].OutputValue' \
  --output text)

API_KEY=$(aws cloudformation describe-stacks \
  --stack-name $STACK_NAME \
  --query 'Stacks[0].Outputs[?OutputKey==`ApiKey`].OutputValue' \
  --output text)

DASHBOARD_URL=$(aws cloudformation describe-stacks \
  --stack-name $STACK_NAME \
  --query 'Stacks[0].Outputs[?OutputKey==`DashboardURL`].OutputValue' \
  --output text)

REGION=$(aws configure get region)

if [ -z "$API_ENDPOINT" ] || [ -z "$API_KEY" ]; then
  echo "❌ Failed to get stack outputs"
  exit 1
fi

echo "✅ Stack outputs retrieved:"
echo "   API Endpoint: $API_ENDPOINT"
echo "   API Key: $API_KEY"
echo "   Dashboard URL: $DASHBOARD_URL"
echo "   Region: $REGION"

# Update dashboard .env.production file
ENV_FILE="$DASHBOARD_DIR/.env.production"
echo "📝 Updating $ENV_FILE..."

cat > "$ENV_FILE" << EOF
VITE_API_ENDPOINT=$API_ENDPOINT
VITE_API_KEY=$API_KEY
VITE_ENVIRONMENT=production
VITE_AWS_REGION=$REGION
EOF

echo "✅ Dashboard configuration updated!"

# Build and deploy dashboard
echo "🚀 Building and deploying dashboard..."
cd "$DASHBOARD_DIR"
npm run build

# Upload to S3
DASHBOARD_BUCKET=$(aws cloudformation describe-stacks \
  --stack-name $STACK_NAME \
  --query 'Stacks[0].Outputs[?OutputKey==`DashboardBucketName`].OutputValue' \
  --output text)

if [ -n "$DASHBOARD_BUCKET" ]; then
  echo "📤 Uploading dashboard to S3 bucket: $DASHBOARD_BUCKET"
  aws s3 sync dist/ s3://$DASHBOARD_BUCKET/ --delete
  
  # Invalidate CloudFront cache
  DISTRIBUTION_ID=$(aws cloudfront list-distributions \
    --query "DistributionList.Items[?Origins.Items[0].DomainName=='$DASHBOARD_BUCKET.s3.amazonaws.com'].Id" \
    --output text)
  
  if [ -n "$DISTRIBUTION_ID" ]; then
    echo "🔄 Invalidating CloudFront cache..."
    aws cloudfront create-invalidation --distribution-id $DISTRIBUTION_ID --paths "/*"
  fi
  
  echo "✅ Dashboard deployed successfully!"
  echo "🌐 Access your dashboard at: $DASHBOARD_URL"
else
  echo "⚠️  Could not find dashboard bucket"
fi