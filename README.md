# TEN Health - Healthcare Management System

A full-stack healthcare management system built with React.js frontend and Node.js/Express backend with MongoDB database.

## Features

### For Patients:
- User registration and authentication
- Book appointments with doctors
- View appointment history
- Fill medical history forms
- Dashboard with appointment management

### For Doctors:
- Doctor registration and authentication
- View all patient appointments
- Update appointment status and diagnosis
- Manage patient consultations
- Professional dashboard

## Tech Stack

### Frontend:
- React.js 19.1.1
- React Router DOM for navigation
- Tailwind CSS for styling
- Lucide React for icons
- Vite for build tool

### Backend:
- Node.js with Express.js
- MongoDB with Mongoose ODM
- JWT for authentication
- bcryptjs for password hashing
- CORS for cross-origin requests

## Setup Instructions

### Prerequisites:
- Node.js (v16 or higher)
- MongoDB (local installation or MongoDB Atlas)
- Git

### Backend Setup:

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Environment variables are already configured in `.env` file:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/ten-healthcare
JWT_SECRET=your-super-secret-jwt-key-change-in-production-2024
NODE_ENV=development
```

4. Start MongoDB service (if using local MongoDB)

5. Start the backend server:
```bash
npm run dev
```

The backend will run on `http://localhost:5000`

### Frontend Setup:

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:5173`

## Usage

### Getting Started:

1. Open your browser and go to `http://localhost:5173`
2. You'll see the MediCare Portal home page
3. Choose to register/login as either a Doctor or Patient

### For Patients:
1. Register/Login as a patient
2. Access your dashboard to view appointments
3. Click "Book Appointment" to schedule new consultations
4. Fill medical history forms as needed

### For Doctors:
1. Register/Login as a doctor
2. Access your dashboard to view all patient appointments
3. Update appointment status, diagnosis, and prescriptions
4. Manage patient consultations

## API Endpoints

### Authentication:
- `POST /api/auth/doctor/signup` - Doctor registration
- `POST /api/auth/doctor/login` - Doctor login
- `POST /api/auth/patient/signup` - Patient registration
- `POST /api/auth/patient/login` - Patient login

### Appointments:
- `GET /api/auth/appointments` - Get patient's appointments
- `POST /api/auth/appointments` - Create new appointment
- `PUT /api/auth/appointments/:id` - Update appointment
- `DELETE /api/auth/appointments/:id` - Delete appointment
- `GET /api/auth/appointments/all` - Get all appointments (doctors only)
- `PUT /api/auth/appointments/doctor/:id` - Update appointment by doctor

### Medical History:
- `GET /api/auth/medical-history` - Get patient's medical history
- `POST /api/auth/medical-history` - Create medical history
- `GET /api/auth/medical-history/:id` - Get specific medical history
- `PUT /api/auth/medical-history/:id` - Update medical history

## Database Schema

### User Model:
- name, email, password, role (doctor/patient), createdAt

### Appointment Model:
- patient (ref to User), date, time, doctor, specialty, description, status, prescription, diagnosis, contact, createdAt

### Medical History Model:
- patient (ref to User), personal info, medical details, consent, timestamps

## Security Features:
- JWT token-based authentication
- Password hashing with bcryptjs
- Protected routes with middleware
- Role-based access control
- Input validation and sanitization

## Development

### Backend Development:
```bash
cd backend
npm run dev  # Uses nodemon for auto-restart
```

### Frontend Development:
```bash
cd frontend
npm run dev  # Uses Vite dev server with hot reload
```

## Production Deployment

### Backend:
1. Set production environment variables
2. Use `npm start` instead of `npm run dev`
3. Configure MongoDB Atlas for production database

### Frontend:
1. Build the production bundle: `npm run build`
2. Serve the `dist` folder using a web server

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the ISC License.

## Support

For support or questions, please contact the development team.