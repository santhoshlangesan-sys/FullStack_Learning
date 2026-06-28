# Docker & OpenShift Setup Guide for Jaguars Cricket Club

## What We Created

1. **Dockerfile.backend** - Containerizes your Node.js Express server
2. **Dockerfile.frontend** - Containerizes your React app with multi-stage build
3. **docker-compose.yml** - Orchestrates all services (Frontend, Backend, MongoDB)
4. **.dockerignore** - Excludes unnecessary files from Docker image

---

## Step 1: Install Docker Locally

### For Windows:

1. **Download Docker Desktop**
   - Visit: https://www.docker.com/products/docker-desktop
   - Download "Docker Desktop for Windows"

2. **Install it**
   - Run the installer
   - Accept default settings
   - Restart your computer when prompted

3. **Verify Installation**
   - Open PowerShell and run:
   ```powershell
   docker --version
   docker run hello-world
   ```
   - You should see version info and "Hello from Docker!"

### For Mac:
   - Download from: https://www.docker.com/products/docker-desktop
   - Install like any other app

---

## Step 2: Build and Run Locally with Docker Compose

### In your project root directory (`e:\Jaguars Cricket Club`):

```powershell
# Navigate to project
cd "e:\Jaguars Cricket Club"

# Build all images (takes a few minutes)
docker-compose build

# Start all containers
docker-compose up
```

### What happens:
1. **MongoDB** starts and is ready
2. **Backend** (Node.js) starts and connects to MongoDB
3. **Frontend** (React) builds and starts
4. All services communicate with each other

### Access your app:
- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:5000/api/teams
- **MongoDB:** localhost:27017

### Stop everything:
```powershell
# In another terminal or Ctrl+C
docker-compose down
```

---

## Step 3: Verify It Works

1. Run: `docker-compose up`
2. Open: http://localhost:3000
3. Try adding a team
4. Check MongoDB logs: `docker-compose logs mongodb`
5. Check Backend logs: `docker-compose logs backend`
6. Check Frontend logs: `docker-compose logs frontend`

---

## Step 4: Deploy to OpenShift (Free Tier)

### 4.1 Create OpenShift Account

1. Visit: https://www.openshift.com/try
2. Sign up (free tier includes 30GB storage, networking, etc.)
3. Create an account with GitHub or email
4. Verify email

### 4.2 Create a New Project

1. Login to OpenShift Console
2. Click "Create Project"
3. Name: `jaguars-cricket`
4. Display Name: `Jaguars Cricket Club`
5. Click "Create"

### 4.3 Install OpenShift CLI (oc)

```powershell
# Download oc CLI
# Visit: https://mirror.openshift.com/pub/openshift-v4/x86_64/clients/ocp/latest/openshift-client-windows.zip
# Or use this command (if you have curl):
curl -O https://mirror.openshift.com/pub/openshift-v4/x86_64/clients/ocp/latest/openshift-client-windows.zip

# Extract and add to PATH
# Or verify installation:
oc version
```

### 4.4 Login to OpenShift

```powershell
# Get login token from OpenShift Console
# Click your profile → Copy Login Command
# Paste in PowerShell:
oc login --token=<YOUR_TOKEN> --server=https://api.openshift.com
```

### 4.5 Create and Deploy

```powershell
# Create new app from your Dockerfile
oc new-app . --name=jaguars-backend -f Dockerfile.backend

# Create a second app for frontend
oc new-app . --name=jaguars-frontend -f Dockerfile.frontend

# Create MongoDB
oc new-app mongodb-ephemeral -p MONGODB_DATABASE=jaguars-cricket

# Link MongoDB to backend
oc set env dc/jaguars-backend MONGODB_URI=mongodb://mongodb:27017/jaguars-cricket

# Expose services
oc expose svc/jaguars-backend
oc expose svc/jaguars-frontend
```

### 4.6 Get Your URLs

```powershell
# See your routes
oc get routes

# You'll see:
# jaguars-backend   jaguars-backend-project.openshift.com
# jaguars-frontend  jaguars-frontend-project.openshift.com
```

---

## Useful Docker Commands

```powershell
# View running containers
docker-compose ps

# View logs
docker-compose logs backend
docker-compose logs frontend
docker-compose logs mongodb

# Stop all containers
docker-compose stop

# Remove all containers
docker-compose down

# Remove all containers and volumes
docker-compose down -v

# Build specific service
docker-compose build frontend

# Rebuild without cache
docker-compose build --no-cache
```

---

## Useful OpenShift Commands

```powershell
# View all resources
oc get all

# View logs
oc logs pod/<pod-name>

# Describe a resource
oc describe pod/<pod-name>

# Delete app
oc delete dc jaguars-backend

# Scale replicas
oc scale dc/jaguars-backend --replicas=2
```

---

## Troubleshooting

### Docker won't start
- Restart Docker Desktop
- Check if Virtualization is enabled in BIOS

### Port already in use
- Change ports in docker-compose.yml:
```yaml
ports:
  - "5001:5000"  # Host port changed to 5001
```

### MongoDB connection error
- Wait a few seconds for MongoDB to be ready
- Check MongoDB logs: `docker-compose logs mongodb`

### Can't deploy to OpenShift
- Verify authentication: `oc whoami`
- Check project: `oc project`
- Check pod status: `oc get pods`

---

## What's Next?

1. ✅ Install Docker Desktop
2. ✅ Run `docker-compose up` locally
3. ✅ Verify everything works
4. ✅ Deploy to OpenShift
5. ✅ Share your app with the world!

