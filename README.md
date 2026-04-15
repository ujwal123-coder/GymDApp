# Gym Management System

**Blockchain-Based Gym Membership Management System with Ethereum Integration**

![Status](https://img.shields.io/badge/Status-Production%20Ready-brightgreen)
![License](https://img.shields.io/badge/License-MIT-blue)
![Solidity](https://img.shields.io/badge/Solidity-0.8.0-blue)
![React](https://img.shields.io/badge/React-18.2-blue)
![Node.js](https://img.shields.io/badge/Node.js-18+-green)

---

## Overview

A complete gym membership management system built with modern web technologies and Ethereum blockchain integration. The system allows gym administrators to manage member registrations, track attendance, process payments, and manage loyalty programs transparently using smart contracts.

---

## Features

### Member Management
- Register regular and premium members
- Manage member profiles and details
- Activate/deactivate memberships
- Track membership status

### Attendance & Loyalty
- Mark member attendance
- Automatic loyalty point calculation
- Loyalty point tracking
- Reward system for members

### Payment Processing
- Process membership payments via Ethereum
- Automatic payment recording
- Discount calculation for full payments
- Transaction history tracking

### Membership Plans
- **Basic**: 6,500 units
- **Standard**: 12,000 units
- **Deluxe**: 15,000 units
- **Premium**: 50,000 units

### Admin Functions
- Member management dashboard
- Payment verification
- Attendance tracking
- System statistics and analytics

---

## Technology Stack

### Frontend
- React 18.2
- Web3.js 1.10
- Tailwind CSS 3.3
- React Router

### Backend
- Node.js 18+
- Express.js 4.18
- MongoDB
- JWT Authentication

### Blockchain
- Solidity 0.8.0
- Ethereum Sepolia Testnet
- Hardhat Framework
- Smart Contracts

### Development Tools
- VS Code
- ESLint
- Prettier
- Git

---

## Project Structure

```
GymDApp/
├── contracts/              # Smart Contracts
│   ├── GymMembership.sol
│   ├── hardhat.config.js
│   └── scripts/deploy.js
├── backend/                # Node.js Backend
│   ├── server.js
│   ├── package.json
│   └── .env.example
├── frontend/               # React Frontend
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── .env.example
├── docs/                   # Documentation
│   └── TECHNICAL_REPORT.md
└── .vscode/               # VS Code Config
```

---

## Installation

### Prerequisites
- Node.js v18 or higher
- npm v9 or higher
- MetaMask browser extension
- Git

### Setup Steps

1. **Clone or extract project**
```bash
cd GymDApp
```

2. **Install dependencies**
```bash
npm run install:all
```

3. **Configure environment variables**
```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

4. **Update .env files with your values**
- Add Infura API key
- Add contract address (after deployment)
- Configure MongoDB URI

5. **Deploy smart contract**
```bash
npm run deploy:contracts
```

6. **Start development servers**
```bash
npm run dev
```

---

## Usage

### Starting the Application

```bash
# Start all servers
npm run dev

# Or start individually
npm run dev:backend    # Backend on port 5000
npm run dev:frontend   # Frontend on port 3000
```

### Accessing the Application

1. Open browser: http://localhost:3000
2. Connect MetaMask wallet
3. Switch to Sepolia testnet
4. Get test ETH from faucet
5. Start using the system

---

## API Endpoints

### Members
- `POST /api/members/register` - Register new member
- `GET /api/members` - Get all members
- `GET /api/members/:memberId` - Get member details
- `PUT /api/members/:memberId/status` - Update member status

### Payments
- `POST /api/members/:memberId/payment` - Record payment
- `GET /api/members/:memberId/payments` - Get payment history

### Attendance
- `POST /api/members/:memberId/attendance` - Mark attendance
- `GET /api/members/:memberId/attendance` - Get attendance history

### System
- `GET /api/stats` - Get system statistics
- `GET /api/web3/status` - Check blockchain connection

---

## Smart Contract Functions

### Member Registration
```solidity
function registerMember(
    string memory _name,
    string memory _email,
    uint256 _plan,
    string memory _personalTrainer
) public returns (uint256)
```

### Payment Processing
```solidity
function payMembership(uint256 _memberId, uint256 _amount) 
public payable validMemberId(_memberId)
```

### Attendance Tracking
```solidity
function markAttendance(uint256 _memberId) 
public onlyOwner validMemberId(_memberId)
```

---

## Testing

### Manual Testing
1. Register members with different plans
2. Process payments via MetaMask
3. Mark attendance and verify loyalty points
4. Upgrade member plans
5. Verify blockchain transactions on Etherscan

### Test Scenarios
- Member registration validation
- Payment processing
- Attendance tracking
- Loyalty point calculation
- Membership upgrades
- Error handling

---

## Deployment

### Local Deployment
```bash
npm run dev
```

### Production Build
```bash
npm run build
```

### Smart Contract Deployment
```bash
npm run deploy:contracts
```

---

## Configuration

### Backend (.env)
```env
PORT=5000
NODE_ENV=development
ETHEREUM_RPC_URL=https://sepolia.infura.io/v3/YOUR_KEY
ETHEREUM_NETWORK=Sepolia
CONTRACT_ADDRESS=0x...
MONGODB_URI=mongodb://...
JWT_SECRET=your_secret
```

### Frontend (.env)
```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_CONTRACT_ADDRESS=0x...
REACT_APP_ETHEREUM_NETWORK=sepolia
```

---

## Troubleshooting

### Port Already in Use
```bash
# Kill process on port 5000
lsof -ti:5000 | xargs kill -9

# Kill process on port 3000
lsof -ti:3000 | xargs kill -9
```

### MetaMask Connection Issues
1. Refresh the page
2. Check MetaMask is installed
3. Verify you're on Sepolia testnet
4. Check browser console for errors

### Smart Contract Deployment Failed
1. Verify Infura API key
2. Check wallet has test ETH
3. Verify network is Sepolia
4. Check contract address format

---

## Documentation

- `TECHNICAL_REPORT.md` - Detailed technical documentation
- `DEPLOYMENT_GUIDE.md` - Setup and deployment guide
- `SETUP_MACOS.md` - macOS specific setup
- `PROJECT_STRUCTURE.md` - Project file structure

---

## License

MIT License - See LICENSE file for details

---

## Support

For issues or questions:
1. Check documentation files
2. Review console logs
3. Check Etherscan for transaction status
4. Verify environment configuration

---

**Version**: 1.0.0  
**Last Updated**: April 2026  
**Author**: Ujwal Pathak (02650380)  
**Module**: CN6035 - Mobile and Distributed Systems
