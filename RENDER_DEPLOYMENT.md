# Deploying the Backend to Render

This guide provides step-by-step instructions for deploying the Thena Flight Booking backend to Render.

## Prerequisites

- A GitHub account with your backend code in a repository named "backend-app"
- A Render account (sign up at https://render.com if you don't have one)
- A Supabase account for the database (or any PostgreSQL database)

## Step 1: Set Up Your Database

1. Create a Supabase project (or use any PostgreSQL database)
2. Get your PostgreSQL connection string in the format:
   ```
   postgresql://postgres:[YOUR-PASSWORD]@[YOUR-PROJECT-ID].supabase.co:5432/postgres
   ```
3. Run the database schema from `supabase_schema.sql` in your Supabase SQL Editor

## Step 2: Deploy to Render

1. Log in to your Render account
2. Click on "New +" and select "Web Service"
3. Connect your GitHub account if you haven't already
4. Select your "backend-app" repository
5. Configure the web service:

   - **Name**: thena-flight-booking-api (or your preferred name)
   - **Environment**: Node
   - **Region**: Choose the region closest to your users
   - **Branch**: main (or your default branch)
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm run start:prod`
   - **Plan**: Free

6. Add the following environment variables:

   - `DATABASE_URL`: Your PostgreSQL connection string
   - `JWT_SECRET`: A random string for JWT token signing (e.g., generate one at https://www.uuidgenerator.net/)
   - `SMTP_HOST`: Your email service host (e.g., smtp.gmail.com)
   - `SMTP_PORT`: Your email service port (e.g., 587)
   - `SMTP_USER`: Your email address
   - `SMTP_PASS`: Your email password or app password

7. Click "Create Web Service"

## Step 3: Verify Deployment

1. Wait for the deployment to complete (this may take a few minutes)
2. Once deployed, Render will provide you with a URL (e.g., https://thena-flight-booking-api.onrender.com)
3. Test your API by visiting `https://your-render-url/flights`

## Important Notes

- The free tier of Render has some limitations:

  - Your service will sleep after 15 minutes of inactivity
  - Limited bandwidth and compute hours
  - The first request after inactivity may take a few seconds to respond

- For production use, consider upgrading to a paid plan

## Troubleshooting

- If your deployment fails, check the build logs in Render for specific errors
- Ensure your database connection string is correct
- Verify that all required environment variables are set
- Check that your package.json has the correct scripts defined:
  ```json
  "scripts": {
    "build": "nest build",
    "start:prod": "node dist/main"
  }
  ```

## Next Steps

After successfully deploying your backend, update your frontend's `.env` file with the new API URL:

```
API_URL=https://your-render-url
```
