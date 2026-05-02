# Cloud Run Deployment Guide

## Overview

This guide helps you deploy the backend (`upload-picture`) to Google Cloud Run.

## Prerequisites

1. Google Cloud SDK installed and configured
2. Docker installed locally (for testing)
3. Google Cloud Project created
4. Enabled APIs:
   - Cloud Build API
   - Cloud Run API
   - Container Registry API

## Deployment Methods

### Method 1: Using Cloud Build (Recommended)

```bash
# Set your project ID
export PROJECT_ID="your-project-id"

# Push code to a Git repository (required by Cloud Build)
git push origin main

# Trigger Cloud Build
gcloud builds submit \
  --config cloudbuild.yaml \
  --substitutions=_REGION="us-central1",_DB_URL="your-db-url",_DB_USER="your-db-user",_DB_PASSWORD="your-db-password",_GCS_BUCKET="your-bucket"
```

### Method 2: Direct Cloud Run Deployment

```bash
# Build Docker image locally
docker build -f backend/upload-picture/Dockerfile -t upload-picture:latest .

# Tag image for Container Registry
docker tag upload-picture:latest gcr.io/$PROJECT_ID/upload-picture:latest

# Push to Container Registry
docker push gcr.io/$PROJECT_ID/upload-picture:latest

# Deploy to Cloud Run
gcloud run deploy upload-picture \
  --image gcr.io/$PROJECT_ID/upload-picture:latest \
  --region us-central1 \
  --platform managed \
  --allow-unauthenticated \
  --memory 1Gi \
  --cpu 2 \
  --set-env-vars "SPRING_DATASOURCE_URL=your-db-url,SPRING_DATASOURCE_USERNAME=your-db-user,SPRING_DATASOURCE_PASSWORD=your-db-password,GCP_PROJECT_ID=$PROJECT_ID,GCS_BUCKET_NAME=your-bucket"
```

### Method 3: Using gcloud run deploy (Easiest)

```bash
gcloud run deploy upload-picture \
  --source . \
  --region us-central1 \
  --platform managed \
  --allow-unauthenticated \
  --memory 1Gi \
  --cpu 2 \
  --env-vars-file .env.yaml
```

## Environment Configuration

Create `.env.yaml` file for environment variables:

```yaml
SPRING_DATASOURCE_URL: jdbc:mysql://your-host:3308/file_db
SPRING_DATASOURCE_USERNAME: your-username
SPRING_DATASOURCE_PASSWORD: your-password
GCP_PROJECT_ID: your-project-id
GCS_BUCKET_NAME: your-gcs-bucket
SERVER_PORT: 8090
```

## Cloud SQL Connection Setup

### Using Cloud SQL Auth Proxy

1. Create a Cloud SQL instance:

```bash
gcloud sql instances create image-processing-db \
  --database-version MYSQL_8_0 \
  --tier db-f1-micro \
  --region us-central1
```

2. Create a database:

```bash
gcloud sql databases create file_db \
  --instance=image-processing-db
```

3. Set Cloud SQL connection in environment:

```bash
SPRING_DATASOURCE_URL=jdbc:mysql:///file_db?cloudSqlInstance=PROJECT_ID:us-central1:image-processing-db&socketFactory=com.google.cloud.sql.mysql.SocketFactory&user=root&password=password
```

## Monitoring

View logs:

```bash
gcloud run logs read upload-picture --region us-central1
```

View service details:

```bash
gcloud run services describe upload-picture --region us-central1
```

View Cloud Build logs:

```bash
gcloud builds log --stream
```

## Clean Up

Delete the Cloud Run service:

```bash
gcloud run services delete upload-picture --region us-central1
```

## Troubleshooting

### Service fails to start

- Check logs: `gcloud run logs read upload-picture`
- Verify environment variables are set correctly
- Ensure database connection string is valid

### Database connection issues

- Check Cloud SQL instance is running
- Verify Cloud SQL Auth Proxy is properly configured
- Ensure service account has necessary permissions

### Build failures

- Check Dockerfile is correct
- Verify pom.xml dependencies
- Check build logs in Cloud Build

## Architecture

```
┌─────────────────────────┐
│  Cloud Run (Backend)    │
│  upload-picture         │
│  - Port: 8090           │
│  - Memory: 1Gi          │
│  - CPU: 2               │
└──────────┬──────────────┘
           │
           ├─────────────────┐
           │                 │
      ┌────▼────┐      ┌────▼──────┐
      │ Cloud   │      │ Google    │
      │ SQL     │      │ Cloud     │
      │         │      │ Storage   │
      └─────────┘      └───────────┘
```

## Next Steps

1. Configure environment variables properly
2. Set up Cloud SQL instance and database
3. Create GCS bucket for image storage
4. Deploy using one of the methods above
5. Test the API endpoints
6. Monitor and troubleshoot as needed
