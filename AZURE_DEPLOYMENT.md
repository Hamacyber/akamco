# Akamco Technologies - Azure Deployment Guide

## Production Build Steps

Before deploying to Azure, follow these steps:

### 1. Build Locally (Verify everything works)
```bash
npm run build
npm start
```

### 2. Test Production Build
Open `http://localhost:3000` and verify all pages work correctly.

---

## Deployment Options

### Option 1: Azure App Service (Recommended for Node.js apps)

#### Prerequisites:
- Azure subscription
- Azure CLI installed (`az --version`)
- App Service Plan created

#### Steps:

1. **Create Resource Group** (if not exists):
```bash
az group create \
  --name akamco-rg \
  --location eastus
```

2. **Create App Service Plan**:
```bash
az appservice plan create \
  --name akamco-plan \
  --resource-group akamco-rg \
  --sku B2 \
  --is-linux
```

3. **Create Web App**:
```bash
az webapp create \
  --resource-group akamco-rg \
  --plan akamco-plan \
  --name akamco-technologies \
  --runtime "NODE|18-lts"
```

4. **Configure Node.js**:
```bash
az webapp config appsettings set \
  --resource-group akamco-rg \
  --name akamco-technologies \
  --settings NODE_ENV=production
```

5. **Deploy via GitHub Actions or local Git**:

#### Using GitHub Actions (Recommended):

Create `.github/workflows/azure-deploy.yml`:
```yaml
name: Deploy to Azure

on:
  push:
    branches: [main, master]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Set up Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: npm ci --legacy-peer-deps
      
      - name: Build
        run: npm run build
      
      - name: Deploy to Azure
        uses: azure/webapps-deploy@v2
        with:
          app-name: akamco-technologies
          publish-profile: ${{ secrets.AZURE_PUBLISHPROFILE }}
          package: .
```

Then add `AZURE_PUBLISHPROFILE` secret in GitHub Settings.

#### Using Local Git:

```bash
# Deploy using Git
az webapp up --resource-group akamco-rg --name akamco-technologies --runtime NODE:18
```

---

### Option 2: Azure Container Instances (Docker)

1. **Create Azure Container Registry**:
```bash
az acr create \
  --resource-group akamco-rg \
  --name akamcoacr \
  --sku Basic
```

2. **Build and Push Docker Image**:
```bash
az acr build \
  --registry akamcoacr \
  --image akamco:latest .
```

3. **Deploy Container Instance**:
```bash
az container create \
  --resource-group akamco-rg \
  --name akamco-app \
  --image akamcoacr.azurecr.io/akamco:latest \
  --ports 3000 \
  --cpu 2 \
  --memory 4 \
  --registry-login-server akamcoacr.azurecr.io \
  --registry-username <USERNAME> \
  --registry-password <PASSWORD>
```

---

### Option 3: Azure Static Web Apps (For Static Export)

If you want to use Static Web Apps, modify `next.config.js`:
```js
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  reactStrictMode: true,
};

module.exports = nextConfig;
```

Then:
```bash
npm run build
# Deploy the 'out' folder to Azure Static Web Apps
```

---

## Environment Variables

Set these in Azure Portal > App Service > Settings > Environment variables:

```
NODE_ENV=production
NEXT_PUBLIC_API_URL=https://akamco-technologies.azurewebsites.net
```

---

## Performance Optimization

1. **Enable Compression** - Already configured in `web.config`
2. **Cache Settings**:
```bash
az webapp config set \
  --resource-group akamco-rg \
  --name akamco-technologies \
  --http20-enabled true
```

3. **CDN** (Optional):
```bash
az cdn profile create \
  --name akamco-cdn \
  --resource-group akamco-rg \
  --sku Standard_Microsoft
```

---

## Monitoring & Logs

View application logs:
```bash
az webapp log tail --resource-group akamco-rg --name akamco-technologies
```

Enable Application Insights:
```bash
az monitor app-insights component create \
  --app akamco-insights \
  --location eastus \
  --resource-group akamco-rg \
  --application-type web
```

---

## Database Backups

If using any database, configure daily backups:
```bash
az webapp config backup update \
  --resource-group akamco-rg \
  --name akamco-technologies \
  --backup-frequency Daily
```

---

## SSL/HTTPS

Azure App Service automatically provides HTTPS with `*.azurewebsites.net`.

For custom domain with custom SSL:
```bash
az webapp config ssl bind \
  --resource-group akamco-rg \
  --name akamco-technologies \
  --certificate-thumbprint <THUMBPRINT> \
  --ssl-type SNI
```

---

## Rollback Plan

Keep previous deployments available:
```bash
# View deployment history
az webapp deployment list --resource-group akamco-rg --name akamco-technologies

# Redeploy previous version if needed
az webapp deployment slot swap \
  --resource-group akamco-rg \
  --name akamco-technologies \
  --slot staging
```

---

## Testing Production URL

Once deployed:
- Visit: `https://akamco-technologies.azurewebsites.net`
- Check all pages load correctly
- Monitor console for errors

---

## Support & Troubleshooting

**Common Issues:**

1. **502 Bad Gateway** - Wait 2-3 minutes for app to start
2. **Module not found** - Run `npm ci --legacy-peer-deps` 
3. **Port issues** - Ensure `PORT` env var is not set (use default 3000)

Check logs:
```bash
az webapp log show --resource-group akamco-rg --name akamco-technologies
```
