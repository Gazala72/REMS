# Render Deployment Guide for REMS Backend

Follow these steps to deploy your backend to Render.

## 1. Prepare your GitHub Repository
- Create a new repository on GitHub.
- Push the contents of the `backend/` folder to that repository (or the entire project if you prefer, but you'll need to specify the root directory in Render).

## 2. Create a Web Service on Render
- Log in to [Render.com](https://render.com).
- Click **New +** and select **Web Service**.
- Connect your GitHub account and select the repository you just created.

## 3. Configuration in Render
- **Name:** `rems-backend` (or your choice)
- **Environment:** `Node`
- **Region:** Choose the one closest to you (e.g., Singapore or Mumbai if available).
- **Branch:** `main`
- **Root Directory:** `./backend` (If you pushed the entire project. If you only pushed the backend folder contents, leave it blank).
- **Build Command:** `npm install && npm run build`
- **Start Command:** `npm start`

## 4. Environment Variables
In the **Environment** tab on Render, add the following variables:
- `MONGODB_URI`: `mongodb://REMS:789644@ac-ujditbg-shard-00-00.varzt5w.mongodb.net:27017,ac-ujditbg-shard-00-01.varzt5w.mongodb.net:27017,ac-ujditbg-shard-00-02.varzt5w.mongodb.net:27017/rems?ssl=true&replicaSet=atlas-13qaa3-shard-0&authSource=admin&retryWrites=true&w=majority`
- `JWT_SECRET`: `your_secure_random_secret_here`
- `PORT`: `5000` (Optional, Render assigns one automatically if not set, but 5000 is fine).

## 5. Deployment
- Click **Create Web Service**.
- Wait for the build and deployment to complete. Render will provide you with a URL (e.g., `https://rems-backend.onrender.com`).

## 6. Update Frontend
- Once your backend is live, update the `apiUrl` in `frontend/src/environments/environment.prod.ts` with your new Render URL:
```typescript
export const environment = {
  production: true,
  apiUrl: 'https://your-rems-backend.onrender.com/api',
  imageUrl: 'https://your-rems-backend.onrender.com'
};
```
- Rebuild your frontend and deploy it (e.g., to Vercel).
