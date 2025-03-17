# Thena Flight Booking API

A robust, scalable backend API for the Thena Flight Booking platform built with NestJS, TypeORM, and PostgreSQL.

![NestJS](https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=nestjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)

## 🌟 Features

- **Complete Flight Management**: Search, filter, and book flights with ease
- **User Authentication**: Secure JWT-based authentication system
- **Booking System**: End-to-end booking flow with passenger information
- **Email Notifications**: Automated booking confirmations and updates
- **Data Persistence**: PostgreSQL database with TypeORM integration
- **Automatic Migrations**: Built-in data migrations and seeding

## 📋 API Endpoints

### Authentication

- `POST /auth/register` - Register a new user
- `POST /auth/login` - Authenticate a user and receive JWT token
- `GET /auth/profile` - Get current user profile

### Flights

- `GET /flights` - List all available flights
- `GET /flights/:id` - Get details for a specific flight
- `GET /flights/search` - Search flights with filters
- `POST /flights` - Create a new flight (admin)
- `PUT /flights/:id` - Update flight details (admin)

### Bookings

- `GET /bookings` - List user's bookings
- `GET /bookings/:id` - Get details for a specific booking
- `POST /bookings` - Create a new booking
- `PATCH /bookings/:id/status` - Update booking status

### Passengers

- `GET /passengers` - List passengers
- `POST /passengers` - Add a passenger
- `GET /passengers/:id` - Get passenger details

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- PostgreSQL database (or Supabase account)

### Environment Setup

Create a `.env` file in the root directory with the following variables:

```
DATABASE_URL=postgresql://postgres:password@localhost:5432/flight_booking
JWT_SECRET=your-secret-key-here
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=your-email@example.com
SMTP_PASS=your-email-password
PORT=3000
```

### Installation

```bash
# Install dependencies
npm install

# Run in development mode
npm run start:dev

# Build for production
npm run build

# Run in production mode
npm run start:prod
```

## 📊 Database Setup

The application will automatically create the necessary database tables and seed initial data when you start the server.

### Database Migrations

The application includes automatic migrations that run on startup:

1. **Flight Duration Migration**: Updates flights with calculated duration values
2. **Booking Reference Migration**: Generates booking references for existing bookings
3. **Data Seeder**: Populates the database with sample data if it's empty

## 🌐 Deployment

### Deploying to Render (Free Tier)

This repository includes configuration for easy deployment to Render:

1. Fork or clone this repository to your GitHub account
2. Sign up for a [Render account](https://render.com)
3. Create a new Web Service and connect your GitHub repository
4. Use the following settings:
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm run start:prod`
5. Add the required environment variables
6. Deploy!

For detailed deployment instructions, see [RENDER_DEPLOYMENT.md](RENDER_DEPLOYMENT.md) or the visual guide in [RENDER_DEPLOYMENT_VISUAL_GUIDE.md](RENDER_DEPLOYMENT_VISUAL_GUIDE.md).

### Alternative Deployment Options

- **Railway**: Similar to Render with a free tier
- **Heroku**: Requires a credit card for free tier
- **AWS Elastic Beanstalk**: More complex but highly scalable

## 🧪 Testing

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov
```

## 📝 API Documentation

When running in development mode, API documentation is available at:

```
http://localhost:3000/api
```

## 🔧 Configuration Options

### Email Service

The application uses Nodemailer for sending emails. Configure the following environment variables:

```
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=your-email@example.com
SMTP_PASS=your-email-password
```

For Gmail, you may need to use an app password instead of your regular password.

### JWT Authentication

Configure JWT settings with:

```
JWT_SECRET=your-secret-key-here
JWT_EXPIRATION=1d
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgements

- [NestJS](https://nestjs.com/) - The framework used
- [TypeORM](https://typeorm.io/) - ORM for database interactions
- [PostgreSQL](https://www.postgresql.org/) - Database
- [Supabase](https://supabase.com/) - Database hosting and more
- [Render](https://render.com/) - Deployment platform
