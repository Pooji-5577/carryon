# CarryOn Delivery App

A full-stack production-ready Customer Delivery Mobile App similar to Lalamove, Porter, and Uber Delivery.

## 🚀 Features

### Customer App (React Native / Expo)
- **Authentication**: OTP-based phone authentication
- **Home & Booking**: Interactive map with pickup/drop selection
- **Vehicle Selection**: Choose from Bike, Car, Van, or Truck
- **Price Estimation**: Real-time fare calculation with promo codes
- **Driver Matching**: Animated driver search with real-time assignment
- **Live Tracking**: Real-time driver tracking on map with ETA
- **In-App Chat**: Message your driver during delivery
- **Payment Integration**: Razorpay & Stripe support
- **Order History**: View past and active orders
- **Ratings & Reviews**: Rate drivers after delivery
- **Profile Management**: Edit profile, saved addresses, payment methods
- **Help & Support**: FAQ, support tickets

### Backend (Node.js / Express)
- **RESTful API**: Well-structured API endpoints
- **PostgreSQL Database**: Prisma ORM with comprehensive schema
- **Real-time Communication**: Socket.IO for live tracking & chat
- **Authentication**: JWT-based authentication with OTP
- **Payment Gateways**: Razorpay & Stripe integration
- **SMS Service**: Twilio for OTP delivery

## 📁 Project Structure

```
delivery-app/
├── App.tsx                  # Main app entry point
├── package.json             # Frontend dependencies
├── app.json                 # Expo configuration
├── src/
│   ├── components/          # Reusable UI components
│   │   └── common/          # Button, Input, Header, Card, etc.
│   ├── screens/             # App screens
│   │   ├── auth/            # Splash, Onboarding, Login, OTP
│   │   ├── home/            # Home, Location Search
│   │   ├── booking/         # Vehicle Selection, Price, Driver Matching, Tracking
│   │   ├── chat/            # In-app chat
│   │   ├── orders/          # Order History, Rating
│   │   ├── profile/         # Profile, Edit Profile, Addresses, Payments
│   │   └── help/            # Help, FAQ, Support Tickets
│   ├── navigation/          # React Navigation setup
│   ├── context/             # React Context providers
│   │   ├── AuthContext      # Authentication state
│   │   ├── LocationContext  # Location/GPS state
│   │   ├── BookingContext   # Booking flow state
│   │   └── SocketContext    # WebSocket connection
│   ├── services/            # API & external services
│   │   ├── api.ts           # Axios API service
│   │   ├── socket.ts        # Socket.IO client
│   │   ├── maps.ts          # Google Maps service
│   │   └── payment.ts       # Payment service
│   ├── types/               # TypeScript type definitions
│   └── utils/               # Utility functions
│       ├── constants.ts     # Colors, fonts, sizes
│       ├── helpers.ts       # Utility functions
│       └── storage.ts       # AsyncStorage wrapper
│
└── backend/
    ├── package.json         # Backend dependencies
    ├── tsconfig.json        # TypeScript config
    ├── prisma/
    │   └── schema.prisma    # Database schema
    └── src/
        ├── index.ts         # Express server entry
        ├── middleware/      # Auth, error handlers
        ├── routes/          # API routes
        │   ├── auth         # OTP authentication
        │   ├── users        # User profile
        │   ├── orders       # Order management
        │   ├── drivers      # Driver operations
        │   ├── payments     # Payment processing
        │   ├── chat         # Chat messages
        │   ├── support      # Support tickets
        │   ├── addresses    # Saved addresses
        │   └── promo        # Promo codes
        ├── socket/          # Socket.IO handlers
        └── utils/           # Logger, JWT, OTP, fare calculator
```

## 🛠️ Setup Instructions

### Prerequisites
- Node.js >= 18.0.0
- PostgreSQL database
- Expo CLI (`npm install -g expo-cli`)
- Android Studio / Xcode for mobile development

### Frontend Setup

```bash
# Navigate to project
cd delivery-app

# Install dependencies
npm install

# Start Expo development server
npx expo start
```

### Backend Setup

```bash
# Navigate to backend
cd delivery-app/backend

# Install dependencies
npm install

# Copy environment file
cp .env.example .env
# Edit .env with your credentials

# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma migrate dev

# Seed database (optional)
npm run db:seed

# Start development server
npm run dev
```

## 🔧 Environment Variables

### Frontend (.env)
```
API_URL=http://localhost:5000/api
SOCKET_URL=http://localhost:5000
GOOGLE_MAPS_API_KEY=your-google-maps-key
RAZORPAY_KEY_ID=your-razorpay-key
STRIPE_PUBLISHABLE_KEY=your-stripe-key
```

### Backend (.env)
```
PORT=5000
DATABASE_URL=postgresql://user:pass@localhost:5432/carryon
JWT_SECRET=your-jwt-secret
TWILIO_ACCOUNT_SID=your-twilio-sid
TWILIO_AUTH_TOKEN=your-twilio-token
RAZORPAY_KEY_ID=your-razorpay-key
RAZORPAY_KEY_SECRET=your-razorpay-secret
STRIPE_SECRET_KEY=your-stripe-secret
GOOGLE_MAPS_API_KEY=your-maps-key
```

## 📱 Running the App

### iOS
```bash
npx expo run:ios
```

### Android
```bash
npx expo run:android
```

### Web (limited support)
```bash
npx expo start --web
```

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/send-otp` - Send OTP
- `POST /api/auth/verify-otp` - Verify OTP and login

### Orders
- `POST /api/orders/estimate` - Get fare estimate
- `POST /api/orders` - Create order
- `GET /api/orders` - Get user orders
- `GET /api/orders/:id` - Get order details
- `POST /api/orders/:id/cancel` - Cancel order
- `POST /api/orders/:id/rate` - Rate order

### Payments
- `POST /api/payments/razorpay/create-order` - Create Razorpay order
- `POST /api/payments/razorpay/verify` - Verify payment
- `POST /api/payments/stripe/create-intent` - Create Stripe payment

### Support
- `GET /api/support/tickets` - Get support tickets
- `POST /api/support/tickets` - Create ticket
- `POST /api/support/tickets/:id/reply` - Reply to ticket

## 🔄 Real-time Events (Socket.IO)

### Client → Server
- `joinOrder` - Join order room for tracking
- `leaveOrder` - Leave order room
- `joinChat` - Join chat room
- `sendMessage` - Send chat message

### Server → Client
- `driverAssigned` - Driver assigned to order
- `driverLocation` - Driver location update
- `orderStatusUpdate` - Order status changed
- `newMessage` - New chat message

## 🎨 UI Components

- **Button** - Primary, secondary, outline variants
- **Input** - Text input with icons and validation
- **Header** - Navigation header with back button
- **Card** - Content container with shadow
- **Avatar** - User/driver profile image
- **Loading** - Loading spinner with text
- **EmptyState** - Empty state with icon and action
- **BottomSheet** - Modal bottom sheet
- **Rating** - Star rating component

## 📦 Key Dependencies

### Frontend
- React Native + Expo SDK 50
- React Navigation 6
- React Native Maps
- Socket.IO Client
- Axios
- React Native Paper
- AsyncStorage

### Backend
- Express.js
- Prisma ORM
- Socket.IO
- JWT Authentication
- Twilio (SMS)
- Razorpay & Stripe

## 🚀 Deployment

### Frontend
```bash
# Build for production
eas build --platform all

# Submit to stores
eas submit
```

### Backend
Deploy to any Node.js hosting:
- Heroku
- Railway
- AWS EC2
- Google Cloud Run
- DigitalOcean App Platform

## 📄 License

MIT License - feel free to use for personal or commercial projects.
