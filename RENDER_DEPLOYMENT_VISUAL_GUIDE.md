# Visual Guide: Deploying to Render

This guide provides visual step-by-step instructions for deploying your NestJS backend to Render.

## Step 1: Create a Render Account

1. Go to [Render.com](https://render.com) and sign up for an account
2. Verify your email address

## Step 2: Connect Your GitHub Repository

1. From the Render dashboard, click on "New +" in the top right corner
2. Select "Web Service"
3. Connect your GitHub account if you haven't already
4. Find and select your "backend-app" repository

## Step 3: Configure Your Web Service

Configure your service with the following settings:

- **Name**: thena-flight-booking-api
- **Environment**: Node
- **Region**: Choose the closest to your users
- **Branch**: main (or your default branch)
- **Build Command**: `npm install && npm run build`
- **Start Command**: `npm run start:prod`
- **Plan**: Free

![Render Configuration](https://i.imgur.com/example1.png)

## Step 4: Add Environment Variables

Scroll down to the "Environment" section and add the following variables:

- `DATABASE_URL`: Your PostgreSQL connection string
- `JWT_SECRET`: A random string for JWT token signing
- `SMTP_HOST`: Your email service host
- `SMTP_PORT`: Your email service port
- `SMTP_USER`: Your email address
- `SMTP_PASS`: Your email password or app password

![Environment Variables](https://i.imgur.com/example2.png)

## Step 5: Create Web Service

Click the "Create Web Service" button at the bottom of the page.

## Step 6: Monitor Deployment

Render will now build and deploy your application. You can monitor the progress in the "Events" tab.

![Deployment Progress](https://i.imgur.com/example3.png)

## Step 7: Get Your Deployment URL

Once deployment is complete, Render will provide you with a URL for your service (e.g., https://thena-flight-booking-api.onrender.com).

Copy this URL as you'll need it for your frontend configuration.

## Step 8: Test Your API

Visit your deployment URL in a browser to verify that your API is working:

- `https://your-render-url/flights` should return flight data

## Step 9: Update Your Frontend

Update your frontend's `.env` file with the new API URL:

```
API_URL=https://your-render-url
```

## Troubleshooting

If your deployment fails:

1. Check the build logs in the "Events" tab
2. Verify your environment variables
3. Ensure your package.json has the correct scripts
4. Check that your database is accessible from Render
