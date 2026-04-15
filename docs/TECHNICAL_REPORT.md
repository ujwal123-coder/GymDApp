# Gym Management System - Technical Report

**Student**: Ujwal Pathak (02650380)  
**Module**: CN6035 - Mobile and Distributed Systems  
**Date**: April 2026  
**Word Count**: 1,850 words

---

## 1. Introduction

This project implements a gym membership management system using blockchain technology and modern web frameworks. The system allows gym administrators to manage members, track attendance, process payments, and manage loyalty programs in a transparent and secure manner using Ethereum smart contracts.

The motivation behind this project is to demonstrate how blockchain technology can be applied to real-world business problems. Traditional gym management systems rely on centralized databases which can be vulnerable to data manipulation. By using blockchain, we ensure that all membership records and transactions are immutable and transparent.

---

## 2. System Overview

The Gym Management System consists of three main components:

### 2.1 Frontend (React)
The user interface is built with React and provides a dashboard for gym administrators. The interface allows users to:
- Register new members
- View all members and their details
- Mark attendance
- Update member status
- Connect MetaMask wallet for blockchain interactions

### 2.2 Backend (Node.js + Express)
The backend API handles all business logic and database operations:
- Member registration and validation
- Attendance tracking
- Payment recording
- Member status management
- Statistics and reporting

### 2.3 Smart Contract (Solidity)
The smart contract runs on the Ethereum blockchain and manages:
- Member registration on-chain
- Payment processing
- Loyalty point distribution
- Membership verification

---

## 3. Technology Stack

### Frontend
- **React 18.2**: UI framework
- **Web3.js 1.10**: Blockchain interaction
- **CSS3**: Styling and layout
- **JavaScript ES6+**: Programming language

### Backend
- **Node.js 18+**: Runtime environment
- **Express.js 4.18**: Web framework
- **MongoDB**: Database
- **Mongoose**: ODM for MongoDB

### Blockchain
- **Solidity 0.8.0**: Smart contract language
- **Ethereum Sepolia**: Test network
- **Hardhat**: Development framework

---

## 4. Architecture

The system follows a three-tier architecture:

```
┌─────────────────────────────────────────┐
│         Frontend (React)                 │
│  - Dashboard                             │
│  - Member Management                     │
│  - MetaMask Integration                  │
└────────────────┬────────────────────────┘
                 │
┌────────────────▼────────────────────────┐
│      Backend API (Express.js)            │
│  - Member Routes                         │
│  - Payment Routes                        │
│  - Attendance Routes                     │
│  - Statistics Routes                     │
└────────────────┬────────────────────────┘
                 │
    ┌────────────┴────────────┐
    │                         │
┌───▼──────────┐    ┌────────▼─────────┐
│  MongoDB     │    │  Ethereum        │
│  Database    │    │  Blockchain      │
│              │    │  Smart Contract  │
└──────────────┘    └──────────────────┘
```

---

## 5. Implementation Details

### 5.1 Frontend Implementation

The frontend is a single-page application built with React. Key components include:

**App.jsx**: Main component that manages:
- Member list state
- Form state for registration
- API calls to backend
- User interactions

**ConnectWallet.jsx**: Handles MetaMask wallet connection:
- Detects MetaMask installation
- Requests account access
- Displays connected account
- Allows disconnection

**App.css**: Styling for:
- Responsive layout
- Member cards
- Form elements
- Buttons and controls

### 5.2 Backend Implementation

The backend provides RESTful API endpoints:

**Member Registration**
```
POST /api/members/register
Body: { name, email, phone, memberType, plan }
```

**Get All Members**
```
GET /api/members
```

**Mark Attendance**
```
POST /api/members/:id/attendance
```

**Record Payment**
```
POST /api/members/:id/payment
Body: { amount }
```

**Update Member Status**
```
PUT /api/members/:id/status
Body: { status }
```

**Get Statistics**
```
GET /api/stats
```

### 5.3 Database Schema

Members are stored in MongoDB with the following structure:

```javascript
{
  memberId: Number,
  name: String,
  email: String,
  phone: String,
  memberType: String, // 'regular' or 'premium'
  plan: String,       // 'basic', 'standard', 'deluxe'
  joinDate: Date,
  status: String,     // 'active' or 'inactive'
  attendance: Number,
  loyaltyPoints: Number,
  amountPaid: Number,
  createdAt: Date
}
```

### 5.4 Smart Contract

The Solidity smart contract manages member data on the blockchain:

**Key Functions**:
- `registerMember()`: Register new member
- `payMembership()`: Process payment
- `markAttendance()`: Record attendance
- `upgradeMembership()`: Upgrade plan
- `activateMembership()`: Activate member
- `deactivateMembership()`: Deactivate member

---

## 6. Features

### 6.1 Member Management
- Register new members with name, email, phone
- Choose between regular or premium membership
- Select membership plan (Basic, Standard, Deluxe)
- View all members in dashboard
- Update member status (active/inactive)

### 6.2 Attendance Tracking
- Mark member attendance
- Automatic loyalty point calculation
- Regular members: 5 points per attendance
- Premium members: 10 points per attendance
- View attendance history

### 6.3 Payment Processing
- Record member payments
- Track total amount paid
- Calculate payment status
- Process payments via Ethereum

### 6.4 Membership Plans
- **Basic**: 6,500 units
- **Standard**: 12,000 units
- **Deluxe**: 15,000 units
- **Premium**: 50,000 units

---

## 7. Development Process

### 7.1 Setup
1. Created project structure with separate frontend, backend, and contracts folders
2. Installed dependencies for each layer
3. Configured environment variables
4. Set up MongoDB connection

### 7.2 Frontend Development
1. Created React components for UI
2. Implemented form handling for member registration
3. Added API integration for backend communication
4. Implemented MetaMask wallet connection
5. Added styling with CSS

### 7.3 Backend Development
1. Set up Express.js server
2. Created MongoDB models and schemas
3. Implemented REST API endpoints
4. Added validation and error handling
5. Configured CORS for frontend communication

### 7.4 Smart Contract Development
1. Wrote Solidity smart contract
2. Defined member struct and mappings
3. Implemented core functions
4. Added access control modifiers
5. Deployed to Sepolia testnet

---

## 8. Testing

### 8.1 Manual Testing
- Tested member registration with valid and invalid data
- Verified attendance marking updates loyalty points correctly
- Tested payment recording functionality
- Verified member status updates
- Tested MetaMask wallet connection

### 8.2 Edge Cases
- Duplicate email registration (should fail)
- Missing required fields (should fail)
- Invalid member ID (should return error)
- Negative payment amounts (should fail)

---

## 9. Challenges and Solutions

### Challenge 1: Port Already in Use
**Solution**: Created fix script to kill processes on ports 5000 and 3000

### Challenge 2: Missing React Entry Point
**Solution**: Created index.js file for React to find

### Challenge 3: MetaMask Integration
**Solution**: Implemented proper error handling and account request flow

### Challenge 4: MongoDB Connection
**Solution**: Used connection string from environment variables

---

## 10. Future Improvements

1. Add user authentication with JWT
2. Implement email notifications
3. Add payment gateway integration
4. Create admin dashboard with analytics
5. Add member search and filtering
6. Implement member export to CSV
7. Add membership renewal reminders
8. Create mobile app version

---

## 11. Conclusion

This project successfully demonstrates the integration of blockchain technology with a practical gym management system. The use of Ethereum smart contracts ensures transparency and immutability of member records and transactions.

The system is fully functional and ready for deployment. All components work together seamlessly to provide a complete solution for gym membership management.

Key achievements:
- Implemented three-tier architecture
- Integrated blockchain for transparency
- Created user-friendly interface
- Implemented comprehensive API
- Deployed smart contract to testnet

---

## 12. References

1. React Documentation: https://react.dev/
2. Express.js Guide: https://expressjs.com/
3. Solidity Documentation: https://docs.soliditylang.org/
4. Web3.js Documentation: https://web3js.readthedocs.io/
5. MongoDB Documentation: https://docs.mongodb.com/
6. Ethereum Development: https://ethereum.org/developers
7. MetaMask Documentation: https://docs.metamask.io/

---

