# Deployment Guide

## Quick Deployment Options

### Option 1: Railway (Recommended for MVP)

**Pros**: Free tier, automatic deployments, built-in database  
**Best for**: Early testing, demos

1. **Install Railway CLI**
```bash
npm install -g @railway/cli
```

2. **Login and initialize**
```bash
railway login
railway init
```

3. **Add environment variables**
```bash
railway variables set NODE_ENV=production
railway variables set PORT=3000
# Add other vars from .env.example
```

4. **Deploy**
```bash
railway up
```

5. **Get URL**
```bash
railway domain
```

---

### Option 2: Heroku

**Pros**: Simple, well-documented  
**Cons**: Paid plans only (as of 2022)

1. **Install Heroku CLI**
```bash
brew install heroku/brew/heroku
```

2. **Create app**
```bash
heroku create nyayaghost-app
```

3. **Set environment variables**
```bash
heroku config:set NODE_ENV=production
heroku config:set OPENAI_API_KEY=your_key
```

4. **Deploy**
```bash
git push heroku main
```

5. **Open**
```bash
heroku open
```

---

### Option 3: AWS EC2 (Production-Ready)

**Pros**: Full control, scalable  
**Best for**: Production with expected high traffic

#### Step 1: Launch EC2 Instance

1. Go to AWS Console → EC2
2. Launch Instance:
   - **AMI**: Ubuntu 22.04 LTS
   - **Instance Type**: t3.small (2 vCPU, 2GB RAM)
   - **Security Group**: Allow ports 22 (SSH), 80 (HTTP), 443 (HTTPS)
   - **Key Pair**: Create/download for SSH access

#### Step 2: Connect and Setup

```bash
# SSH into instance
ssh -i your-key.pem ubuntu@your-ec2-ip

# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install Nginx (reverse proxy)
sudo apt install -y nginx

# Install PM2 (process manager)
sudo npm install -g pm2

# Install Git
sudo apt install -y git
```

#### Step 3: Clone and Setup Application

```bash
# Clone repository
git clone https://github.com/Mahesharunaladi/NyayaGhost.git
cd NyayaGhost

# Install dependencies
npm install --production

# Create .env file
nano .env
# Paste production environment variables

# Start with PM2
pm2 start server.js --name nyayaghost
pm2 save
pm2 startup
```

#### Step 4: Configure Nginx

```bash
sudo nano /etc/nginx/sites-available/nyayaghost
```

Add:
```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable site:
```bash
sudo ln -s /etc/nginx/sites-available/nyayaghost /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

#### Step 5: Setup SSL (HTTPS)

```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

---

### Option 4: Vercel (Frontend Only)

**Best for**: Hosting the PWA separately from backend

1. **Install Vercel CLI**
```bash
npm install -g vercel
```

2. **Deploy frontend**
```bash
vercel --prod
```

3. **Update API URLs** in `script.js` to point to your backend deployment

---

## Database Setup

### PostgreSQL on Railway

```bash
# Railway automatically provisions
railway add postgres

# Get connection string
railway variables
# Copy DATABASE_URL

# Update server.js to use DATABASE_URL
```

### MongoDB Atlas (Free Tier)

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create free cluster
3. Add database user
4. Whitelist IP addresses (or use 0.0.0.0/0 for development)
5. Get connection string
6. Add to `.env`: `MONGODB_URI=mongodb+srv://...`

---

## Environment Variables for Production

**Critical Security Settings**:

```bash
NODE_ENV=production
JWT_SECRET=<generate-with-openssl-rand-base64-32>
ENCRYPTION_KEY=<generate-with-openssl-rand-base64-32>
ALLOWED_ORIGINS=https://yourdomain.com
```

**Generate secure secrets**:
```bash
openssl rand -base64 32
```

---

## Monitoring & Maintenance

### Setup Error Tracking (Sentry)

1. Create account at [Sentry.io](https://sentry.io)
2. Create new project (Node.js)
3. Install SDK:
```bash
npm install @sentry/node
```

4. Add to `server.js`:
```javascript
const Sentry = require('@sentry/node');
Sentry.init({ dsn: process.env.SENTRY_DSN });

// Add error handler
app.use(Sentry.Handlers.errorHandler());
```

### Setup Uptime Monitoring

**Free options**:
- [UptimeRobot](https://uptimerobot.com) - 50 monitors free
- [Freshping](https://www.freshworks.com/website-monitoring/) - Unlimited

### Log Management

**Using PM2**:
```bash
pm2 logs nyayaghost --lines 100
pm2 logs --json > logs.json
```

**Rotate logs**:
```bash
pm2 install pm2-logrotate
pm2 set pm2-logrotate:max_size 10M
```

---

## Scaling Strategy

### Phase 1: Single Server (0-1000 users)
- 1 EC2 t3.small instance
- Managed PostgreSQL (Railway/RDS)
- Cloudflare CDN for frontend

### Phase 2: Horizontal Scaling (1K-10K users)
- Load Balancer (AWS ALB)
- 2-3 EC2 instances
- Redis for session caching
- S3 for document storage

### Phase 3: Microservices (10K+ users)
```
Frontend (Cloudflare CDN)
    ↓
API Gateway
    ↓
┌─────────┬──────────┬─────────┐
│RightFinder│ Filing  │ Notify │
│ Service │ Service  │ Service │
└─────────┴──────────┴─────────┘
    ↓           ↓          ↓
Database     File Store  SMS API
```

**Technologies**:
- Container orchestration: Kubernetes
- Service mesh: Istio
- Message queue: RabbitMQ
- Caching: Redis Cluster

---

## CI/CD Pipeline

### GitHub Actions (Recommended)

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run tests
        run: npm test
      
      - name: Deploy to Railway
        run: |
          npm install -g @railway/cli
          railway link ${{ secrets.RAILWAY_PROJECT_ID }}
          railway up
        env:
          RAILWAY_TOKEN: ${{ secrets.RAILWAY_TOKEN }}
```

Add secrets in GitHub repo settings:
- `RAILWAY_TOKEN`
- `RAILWAY_PROJECT_ID`

---

## Backup Strategy

### Database Backups

**Automated daily backups**:
```bash
# PostgreSQL
pg_dump $DATABASE_URL > backup-$(date +%Y%m%d).sql

# MongoDB
mongodump --uri="$MONGODB_URI" --out=/backups/$(date +%Y%m%d)
```

**Setup cron job**:
```bash
crontab -e

# Add line:
0 2 * * * /path/to/backup-script.sh
```

### File Storage Backups

**AWS S3 versioning**:
```bash
aws s3api put-bucket-versioning \
  --bucket nyayaghost-documents \
  --versioning-configuration Status=Enabled
```

---

## Performance Optimization

### 1. Enable GZIP Compression

**Nginx**:
```nginx
gzip on;
gzip_types text/plain text/css application/json application/javascript;
```

**Express**:
```javascript
const compression = require('compression');
app.use(compression());
```

### 2. CDN for Static Assets

**Cloudflare Setup**:
1. Add domain to Cloudflare
2. Update DNS nameservers
3. Enable caching rules
4. Turn on "Auto Minify" for CSS/JS

### 3. Database Indexing

```sql
-- Add indexes for common queries
CREATE INDEX idx_query_type ON legal_queries(query_type);
CREATE INDEX idx_user_location ON users(state, district);
```

### 4. Caching Strategy

```javascript
const redis = require('redis');
const client = redis.createClient(process.env.REDIS_URL);

// Cache legal database
app.get('/api/rightfinder', async (req, res) => {
  const cacheKey = `right:${req.body.query}`;
  const cached = await client.get(cacheKey);
  
  if (cached) return res.json(JSON.parse(cached));
  
  const result = await rightFinderEngine(req.body.query);
  await client.setEx(cacheKey, 3600, JSON.stringify(result));
  res.json(result);
});
```

---

## Security Checklist

- [ ] HTTPS enabled with valid certificate
- [ ] Environment variables not committed to Git
- [ ] Database credentials rotated regularly
- [ ] API rate limiting enabled
- [ ] CORS properly configured
- [ ] Input validation on all endpoints
- [ ] SQL injection protection (parameterized queries)
- [ ] XSS protection (sanitize user input)
- [ ] Security headers (Helmet.js)
- [ ] Regular dependency updates (`npm audit`)
- [ ] DDoS protection (Cloudflare)
- [ ] Backup & disaster recovery plan

---

## Cost Estimation

### MVP Phase (0-1000 users)
- **Hosting**: Railway/Heroku - $0-25/month
- **Database**: Free tier (Railway/Atlas)
- **CDN**: Cloudflare - $0
- **AI API**: OpenAI/Gemini - $50-200/month
- **SMS**: Twilio - $20-50/month
- **Total**: ~$100-300/month

### Growth Phase (1K-10K users)
- **Hosting**: AWS EC2 - $50-100/month
- **Database**: RDS - $50-100/month
- **CDN**: CloudFront - $10-30/month
- **AI API**: $500-1000/month
- **SMS**: $200-500/month
- **Total**: ~$800-1700/month

---

## Troubleshooting Common Issues

### Issue: Voice recognition not working

**Solution**:
- Ensure HTTPS (required for getUserMedia)
- Check browser compatibility (Chrome/Edge recommended)
- Verify microphone permissions

### Issue: High API costs

**Solution**:
- Implement caching for common queries
- Use smaller AI models for simple questions
- Rate limit per user

### Issue: Slow response times

**Solution**:
- Add database indexes
- Enable CDN for static assets
- Implement request caching
- Upgrade server resources

---

## Support

For deployment help:
- **GitHub Issues**: Technical problems
- **Email**: [maintainer email]
- **Documentation**: This file + [TECH.md](docs/TECH.md)

---

**Deployment checklist complete? Start serving justice! 🕊️**
