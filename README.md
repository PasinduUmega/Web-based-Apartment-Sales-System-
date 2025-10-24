# Apartment Management System

A comprehensive apartment management system built with Spring Boot backend and React frontend. This system provides features for managing apartments, bookings, users, payments, inventory, and feedback.

## 🏗️ Project Structure

```
apartment/
├── backend/          # Spring Boot REST API
├── frontend/         # React frontend application
└── README.md         # This file
```

## 🚀 Features

### Backend (Spring Boot)
- **User Management**: User registration, authentication, and profile management
- **Apartment Management**: CRUD operations for apartment listings
- **Booking System**: Apartment booking and reservation management
- **Payment Processing**: Payment tracking and installment plans
- **Inventory Management**: Property inventory and maintenance tracking
- **Feedback System**: User feedback and review management
- **RESTful API**: Well-structured REST endpoints for all operations

### Frontend (React)
- **Modern UI**: Built with React 18 and Tailwind CSS
- **Responsive Design**: Mobile-first responsive design
- **State Management**: React Query for server state management
- **Form Handling**: React Hook Form for efficient form management
- **UI Components**: Lucide React icons and Framer Motion animations
- **Date Handling**: React DatePicker for date selection
- **Notifications**: React Hot Toast for user notifications

## 🛠️ Technology Stack

### Backend
- **Java 17+**
- **Spring Boot 3.x**
- **Spring Data JPA**
- **Maven** (Build tool)
- **H2 Database** (Development)
- **JUnit 5** (Testing)

### Frontend
- **React 18**
- **TypeScript**
- **Tailwind CSS**
- **React Router DOM**
- **Axios** (HTTP client)
- **React Query** (Data fetching)
- **React Hook Form** (Form management)
- **Framer Motion** (Animations)
- **Lucide React** (Icons)

## 📋 Prerequisites

- **Java 17 or higher**
- **Node.js 16 or higher**
- **npm or yarn**
- **Git**

## 🚀 Getting Started

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Run the Spring Boot application:
   ```bash
   ./mvnw spring-boot:run
   ```
   
   Or on Windows:
   ```bash
   mvnw.cmd spring-boot:run
   ```

3. The backend API will be available at `http://localhost:8080`

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

4. The frontend will be available at `http://localhost:3000`

## 📚 API Endpoints

### User Management
- `GET /api/users` - Get all users
- `POST /api/users` - Create new user
- `GET /api/users/{id}` - Get user by ID
- `PUT /api/users/{id}` - Update user
- `DELETE /api/users/{id}` - Delete user

### Apartment Management
- `GET /api/apartments` - Get all apartments
- `POST /api/apartments` - Create new apartment
- `GET /api/apartments/{id}` - Get apartment by ID
- `PUT /api/apartments/{id}` - Update apartment
- `DELETE /api/apartments/{id}` - Delete apartment

### Booking Management
- `GET /api/bookings` - Get all bookings
- `POST /api/bookings` - Create new booking
- `GET /api/bookings/{id}` - Get booking by ID
- `PUT /api/bookings/{id}` - Update booking
- `DELETE /api/bookings/{id}` - Delete booking

### Payment Management
- `GET /api/payments` - Get all payments
- `POST /api/payments` - Create new payment
- `GET /api/payments/{id}` - Get payment by ID
- `PUT /api/payments/{id}` - Update payment
- `DELETE /api/payments/{id}` - Delete payment

### Inventory Management
- `GET /api/inventory` - Get all inventory items
- `POST /api/inventory` - Create new inventory item
- `GET /api/inventory/{id}` - Get inventory item by ID
- `PUT /api/inventory/{id}` - Update inventory item
- `DELETE /api/inventory/{id}` - Delete inventory item

### Feedback Management
- `GET /api/feedback` - Get all feedback
- `POST /api/feedback` - Create new feedback
- `GET /api/feedback/{id}` - Get feedback by ID
- `PUT /api/feedback/{id}` - Update feedback
- `DELETE /api/feedback/{id}` - Delete feedback

### Installment Plans
- `GET /api/installment-plans` - Get all installment plans
- `POST /api/installment-plans` - Create new installment plan
- `GET /api/installment-plans/{id}` - Get installment plan by ID
- `PUT /api/installment-plans/{id}` - Update installment plan
- `DELETE /api/installment-plans/{id}` - Delete installment plan

## 🧪 Testing

### Backend Testing
```bash
cd backend
./mvnw test
```

### Frontend Testing
```bash
cd frontend
npm test
```

## 📦 Building for Production

### Backend
```bash
cd backend
./mvnw clean package
```

### Frontend
```bash
cd frontend
npm run build
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Authors

- **Your Name** - *Initial work* - [YourGitHub](https://github.com/yourusername)

## 🙏 Acknowledgments

- Spring Boot team for the excellent framework
- React team for the amazing frontend library
- Tailwind CSS for the utility-first CSS framework
- All the open-source contributors who made this project possible
