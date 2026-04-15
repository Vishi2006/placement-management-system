# Placement Management System (PMS)

A full-stack web application for managing student placements, job listings, applications, and interviews.

## Features

- **Student Portal**: Browse jobs, apply, track applications, manage interviews
- **Admin Dashboard**: Manage companies, jobs, applications, and interview schedules
- **Secure Authentication**: JWT-based auth with role-based access control
- **Admin Account**: Static admin user with secure password management
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Dark Mode**: Built-in dark theme support

## Tech Stack

- **Frontend**: React + Vite + Tailwind CSS
- **Backend**: Node.js + Express
- **Database**: MongoDB
- **Authentication**: JWT + Bcrypt

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- MongoDB (local or cloud)

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd pms
   ```

2. **Install dependencies**
   ```bash
   npm install
   npm install --prefix backend
   npm install --prefix frontend
   ```

3. **Configure environment variables**

   Create `.env` file in `backend` directory:
   ```env
   PORT=5000
   MONGO_URL=mongodb+srv://username:password@cluster.mongodb.net
   JWT_SECRET=your_jwt_secret_key
   JWT_EXPIRE=7d
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   ```

## Development

### Start Both Frontend & Backend
```bash
npm run dev
```

### Start Individual Servers
```bash
npm run dev:backend    # Backend only
npm run dev:frontend   # Frontend only
```

## Admin Credentials

The admin user is automatically created on first startup:

- **Email**: `admin@pms.com`
- **Password**: `AdminPMS@123`

⚠️ **IMPORTANT**: Change the password immediately after first login via the admin dashboard.

## Production Deployment

### Build Frontend
```bash
npm run build
```

### Start Server
```bash
npm start
```

The application will:
1. Automatically initialize the admin user if it doesn't exist
2. Connect to MongoDB
3. Serve the frontend from `frontend/dist`
4. Start the backend API on the configured PORT

## Project Structure

```
pms/
├── backend/
│   ├── config/          # Database & Cloudinary config
│   ├── controllers/      # Business logic
│   ├── middleware/       # Auth & error handling
│   ├── models/          # MongoDB schemas
│   ├── routes/          # API endpoints
│   ├── scripts/         # Utility scripts
│   ├── uploads/         # File uploads
│   ├── utils/           # Helper functions
│   └── server.js        # Express app
├── frontend/
│   ├── src/
│   │   ├── components/  # Reusable components
│   │   ├── pages/       # Page components
│   │   ├── services/    # API services
│   │   ├── context/     # React context
│   │   ├── hooks/       # Custom hooks
│   │   └── App.jsx      # Main app component
│   └── index.html       # HTML entry point
└── package.json         # Root scripts
```

## API Endpoints

### Authentication
- `POST /api/auth/login` - Login
- `POST /api/auth/register` - Register (students only)
- `POST /api/auth/change-password` - Change password (authenticated)

### Admin
- `GET /api/admin/profile` - Get admin profile
- `GET /api/admin/stats` - Get system statistics
- `GET /api/admin/users` - Get all users

### Students
- `GET /api/jobs` - Get all jobs
- `POST /api/applications` - Apply for job
- `GET /api/interviews` - Get interviews

### Companies
- `GET /api/companies` - Get all companies
- `POST /api/companies` - Create company (admin)

### Jobs
- `GET /api/jobs` - Get all jobs
- `POST /api/jobs` - Create job (admin)

## Environment Variables

| Variable | Description |
|----------|-------------|
| `PORT` | Server port (default: 5000) |
| `MONGO_URL` | MongoDB connection string |
| `JWT_SECRET` | Secret key for JWT tokens |
| `JWT_EXPIRE` | Token expiration time |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary account name |
| `CLOUDINARY_API_KEY` | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret |

## Troubleshooting

### Admin User Not Created
The admin user is automatically created on first server startup. If it doesn't appear:
1. Check backend logs for initialization message
2. Verify MongoDB connection in `.env`
3. Ensure `admin@pms.com` doesn't already exist in database

### Login Issues
- Verify email and password match exactly (case-sensitive)
- Check network tab in browser DevTools
- Ensure backend server is running on correct port

### Password Change Fails
- Verify you're logged in (check token in localStorage)
- Old password must be correct
- New password must be 6+ characters

## Support

For issues or questions:
1. Check the logs in terminal
2. Verify all environment variables are set
3. Ensure MongoDB is accessible
4. Check browser console (F12) for frontend errors

## License

ISC

## Contributing

Pull requests are welcome. For major changes, please open an issue first.
