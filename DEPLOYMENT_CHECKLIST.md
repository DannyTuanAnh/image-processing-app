# Quick Deployment Checklist

## ✅ Preparation Complete

Your backend is now ready for Cloud Run deployment. Here's what was done:

### 1. **Build Artifacts Created**

- ✅ Maven build successful
- ✅ JAR file created: `backend/upload-picture/target/upload-picture-0.0.1-SNAPSHOT.jar`
- ✅ Optimized multi-stage Dockerfile configured

### 2. **Configuration Files**

- ✅ `.dockerignore` - Excludes unnecessary files from Docker build
- ✅ `.gcloudignore` - Excludes unnecessary files from Cloud Build
- ✅ `cloudbuild.yaml` - Cloud Build pipeline configured
- ✅ `CLOUD_RUN_DEPLOYMENT.md` - Detailed deployment guide
- ✅ `pom.xml` - Dependencies fixed and optimized

### 3. **Cleanup Complete**

- ✅ Removed unnecessary files:
  - cloud-function/
  - diagrams/
  - docker-compose.yml
  - render.yaml
  - vercel.json
  - test.jpg
  - IDE files (.idea, .vscode)
- ✅ Kept frontend/ folder (untouched)

## 🚀 Next Steps for Deployment

### Prerequisites

```bash
# Ensure you have gcloud CLI installed
gcloud --version

# Set your project ID
export PROJECT_ID="your-gcp-project-id"

# Authenticate
gcloud auth login
gcloud config set project $PROJECT_ID
```

### Option 1: Quick Deployment (Recommended)

```bash
cd image-processing-app

gcloud run deploy upload-picture \
  --source . \
  --region us-central1 \
  --platform managed \
  --allow-unauthenticated \
  --memory 1Gi \
  --cpu 2
```

### Option 2: Using Cloud Build

```bash
gcloud builds submit \
  --config cloudbuild.yaml \
  --substitutions=_REGION="us-central1",_DB_URL="your-db-url",_DB_USER="user",_DB_PASSWORD="pass",_GCS_BUCKET="bucket-name"
```

### Option 3: Build Docker Locally & Deploy

```bash
# Build Docker image
docker build -f backend/upload-picture/Dockerfile -t upload-picture:latest .

# Tag for GCR
docker tag upload-picture:latest gcr.io/$PROJECT_ID/upload-picture:latest

# Push to GCR
docker push gcr.io/$PROJECT_ID/upload-picture:latest

# Deploy
gcloud run deploy upload-picture \
  --image gcr.io/$PROJECT_ID/upload-picture:latest \
  --region us-central1 \
  --platform managed \
  --allow-unauthenticated \
  --memory 1Gi \
  --cpu 2
```

## 📝 Environment Variables to Configure

Update these before deployment:

```yaml
SPRING_DATASOURCE_URL: "jdbc:mysql://your-host:3308/file_db"
SPRING_DATASOURCE_USERNAME: "your-username"
SPRING_DATASOURCE_PASSWORD: "your-password"
GCP_PROJECT_ID: "your-project-id"
GCS_BUCKET_NAME: "your-gcs-bucket"
SERVER_PORT: "8090"
```

## 🔍 Verify Deployment

```bash
# Check service details
gcloud run services describe upload-picture --region us-central1

# View logs
gcloud run logs read upload-picture --region us-central1

# Get service URL
gcloud run services describe upload-picture --region us-central1 --format='value(status.url)'
```

## 📂 Project Structure After Cleanup

```
image-processing-app/
├── .env.example
├── .env.production
├── .gcloudignore
├── .gitignore
├── CLOUD_RUN_DEPLOYMENT.md
├── README.md
├── cloudbuild.yaml
├── docs/
├── frontend/ (kept untouched)
├── backend/
│   └── upload-picture/
│       ├── .dockerignore
│       ├── .gitattributes
│       ├── .gitignore
│       ├── .mvn/
│       ├── Dockerfile (optimized)
│       ├── mvnw
│       ├── mvnw.cmd
│       ├── pom.xml (fixed dependencies)
│       ├── src/
│       └── target/
│           └── upload-picture-0.0.1-SNAPSHOT.jar ✅
```

## ⚠️ Important Notes

1. **Database Connection**: Update `SPRING_DATASOURCE_URL` with your Cloud SQL or external database URL
2. **Google Cloud Storage**: Create a GCS bucket and configure `GCS_BUCKET_NAME`
3. **Service Account**: Ensure the Cloud Run service account has necessary permissions
4. **Memory & CPU**: Configured to 1Gi memory and 2 CPU. Adjust based on your needs
5. **Port**: Application runs on port 8090. Ensure it matches `SERVER_PORT` environment variable

## 🆘 Troubleshooting

### Build Issues

- Check `Dockerfile` syntax: `docker build -f backend/upload-picture/Dockerfile --dry-run .`
- Verify pom.xml dependencies with: `./mvnw dependency:tree`

### Deployment Issues

- Check Cloud Run logs for errors
- Verify environment variables are correctly set
- Ensure database is accessible from Cloud Run

### Connection Issues

- Test database connectivity
- Verify GCS bucket permissions
- Check Cloud Run service account IAM roles

## 📚 Resources

- [Cloud Run Documentation](https://cloud.google.com/run/docs)
- [Spring Boot on Cloud Run](https://cloud.google.com/run/docs/quickstarts/build-and-deploy/java)
- [Cloud SQL Connection](https://cloud.google.com/sql/docs/mysql/connect-run)
- [Cloud Build Documentation](https://cloud.google.com/build/docs)
