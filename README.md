# Apartment Management System - Frontend

A modern, responsive React frontend for the Apartment Management System with full CRUD operations, role-based access control, and beautiful animations.

## Features

### 🏠 Core Functionality
- **User Management**: Complete user CRUD with role-based access (Admin, User, Seller, Agent)
- **Apartment Management**: Create, read, update, delete apartment listings
- **Inventory Management**: Track apartment inventory and stock levels
- **Booking System**: Manage apartment bookings and reservations
- **Feedback System**: User reviews and ratings for apartments
- **Payment Management**: Handle payments and transactions
- **Installment Plans**: Create and manage payment installment plans
- **Apartment Listing**: Browse and search available apartments

### 🎨 UI/UX Features
- **Modern Design**: Clean, professional interface with Tailwind CSS
- **Responsive Layout**: Works perfectly on desktop, tablet, and mobile
- **Smooth Animations**: Framer Motion animations for enhanced user experience
- **Interactive Components**: Hover effects, loading states, and micro-interactions
- **Form Validation**: Real-time form validation with error messages
- **Modal Dialogs**: Beautiful modal components for forms and confirmations

### 🔐 Authentication & Authorization
- **Role-Based Access**: Different views and permissions for Admin, User, Seller, Agent
- **Protected Routes**: Secure navigation based on user roles
- **Login/Register**: Secure authentication with form validation
- **User Profile**: Complete profile management with edit capabilities

### 📱 Responsive Design
- **Mobile-First**: Optimized for mobile devices
- **Tablet Support**: Great experience on tablets
- **Desktop Enhanced**: Full-featured desktop experience
- **Touch-Friendly**: Touch-optimized interactions

## Technology Stack

- **React 18**: Latest React with hooks and modern patterns
- **React Router**: Client-side routing
- **Tailwind CSS**: Utility-first CSS framework
- **Framer Motion**: Animation library
- **React Hook Form**: Form handling and validation
- **React Query**: Data fetching and caching
- **Axios**: HTTP client
- **Lucide React**: Beautiful icons
- **React Hot Toast**: Toast notifications

## Getting Started

### Prerequisites
- Node.js 16+ 
- npm or yarn
- Backend API running on port 8080

### Installation

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Start Development Server**
   ```bash
   npm start
   ```

3. **Build for Production**
   ```bash
   npm run build
   ```

### Environment Variables

Create a `.env` file in the root directory:

```env
REACT_APP_API_URL=http://localhost:8080/api
```

## Project Structure

```
frontend/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── Layout/
│   │   │   ├── Layout.js
│   │   │   ├── Header.js
│   │   │   └── Sidebar.js
│   │   ├── Modal/
│   │   │   └── Modal.js
│   │   ├── LoadingSpinner/
│   │   │   └── LoadingSpinner.js
│   │   └── ProtectedRoute/
│   │       └── ProtectedRoute.js
│   ├── contexts/
│   │   └── AuthContext.js
│   ├── services/
│   │   └── api.js
│   ├── pages/
│   │   ├── Auth/
│   │   │   ├── Login.js
│   │   │   └── Register.js
│   │   ├── Dashboard/
│   │   │   └── Dashboard.js
│   │   ├── UserManagement/
│   │   │   └── UserManagement.js
│   │   ├── ApartmentManagement/
│   │   │   └── ApartmentManagement.js
│   │   ├── InventoryManagement/
│   │   │   └── InventoryManagement.js
│   │   ├── BookingManagement/
│   │   │   └── BookingManagement.js
│   │   ├── FeedbackManagement/
│   │   │   └── FeedbackManagement.js
│   │   ├── PaymentManagement/
│   │   │   └── PaymentManagement.js
│   │   ├── InstallmentPlanManagement/
│   │   │   └── InstallmentPlanManagement.js
│   │   ├── ApartmentListing/
│   │   │   └── ApartmentListing.js
│   │   └── UserProfile/
│   │       └── UserProfile.js
│   ├── App.js
│   ├── index.js
│   └── index.css
├── package.json
├── tailwind.config.js
├── postcss.config.js
└── README.md
```

## Features by Role

### 👑 Admin
- Full access to all features
- User management
- Apartment management
- Inventory management
- View all bookings, feedbacks, payments
- System administration

### 🏠 Seller
- Apartment management
- Inventory management
- View bookings for their apartments
- View feedbacks for their apartments

### 🤝 Agent
- Browse apartment listings
- Help users find apartments
- View available inventory

### 👤 User
- Browse apartment listings
- Book apartments
- Leave feedback and reviews
- Make payments
- Apply for installment plans
- Manage profile

## Key Components

### Layout System
- **Header**: Navigation, user info, notifications
- **Sidebar**: Role-based navigation menu
- **Main Content**: Page content with animations

### Form Components
- **Modal**: Reusable modal for forms
- **Form Validation**: Real-time validation
- **Loading States**: Beautiful loading indicators

### Data Management
- **React Query**: Efficient data fetching and caching
- **Optimistic Updates**: Immediate UI updates
- **Error Handling**: Comprehensive error management

## Styling

### Tailwind CSS Classes
- **Custom Components**: Pre-built component classes
- **Responsive Design**: Mobile-first approach
- **Dark Mode Ready**: Prepared for dark mode implementation
- **Custom Animations**: Smooth transitions and effects

### Color Scheme
- **Primary**: Blue tones for main actions
- **Secondary**: Gray tones for secondary elements
- **Success**: Green for positive actions
- **Warning**: Yellow for warnings
- **Error**: Red for errors and destructive actions

## API Integration

### Endpoints
- **Authentication**: Login, register, profile
- **Users**: CRUD operations
- **Apartments**: CRUD operations
- **Inventory**: CRUD operations
- **Bookings**: CRUD operations
- **Feedbacks**: CRUD operations
- **Payments**: CRUD operations
- **Installment Plans**: CRUD operations

### Error Handling
- **Network Errors**: Automatic retry and fallback
- **Validation Errors**: Form-level error display
- **Authentication Errors**: Automatic logout on 401

## Performance Optimizations

- **Code Splitting**: Lazy loading of components
- **Memoization**: React.memo for expensive components
- **Query Caching**: React Query for efficient data management
- **Image Optimization**: Lazy loading and optimization
- **Bundle Analysis**: Optimized bundle size

## Browser Support

- **Chrome**: Latest 2 versions
- **Firefox**: Latest 2 versions
- **Safari**: Latest 2 versions
- **Edge**: Latest 2 versions

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions, please contact the development team.
