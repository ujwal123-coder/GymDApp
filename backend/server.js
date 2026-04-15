const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 5000;

// MongoDB Atlas connection
const mongoURI = 'mongodb+srv://ujwalpathak01:Ujwal123@footballapp.zgrym.mongodb.net/gym-db?retryWrites=true&w=majority&appName=FootballApp';

mongoose.connect(mongoURI)
  .then(() => console.log('Connected to MongoDB Atlas'))
  .catch(err => console.log('MongoDB connection error:', err));

// middleware
app.use(cors());
app.use(express.json());

// Member Schema
const memberSchema = new mongoose.Schema({
  memberId: Number,
  name: String,
  email: String,
  phone: String,
  location: String,
  memberType: String,
  plan: String,
  joinDate: Date,
  status: String,
  attendance: Number,
  loyaltyPoints: Number,
  amountPaid: Number,
  createdAt: { type: Date, default: Date.now }
});

const Member = mongoose.model('Member', memberSchema);

// get all members
app.get('/api/members', async (req, res) => {
  try {
    const members = await Member.find();
    res.json(members);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// get single member
app.get('/api/members/:id', async (req, res) => {
  try {
    const member = await Member.findOne({ memberId: req.params.id });
    if (!member) {
      return res.status(404).json({ error: 'Member not found' });
    }
    res.json(member);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// register new member
app.post('/api/members/register', async (req, res) => {
  try {
    const { name, email, phone, location, memberType, plan } = req.body;

    if (!name || !email || !phone) {
      return res.status(400).json({ error: 'Name, email and phone are required' });
    }

    // check duplicate email
    const existing = await Member.findOne({ email });
    if (existing) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    // get next id
    const lastMember = await Member.findOne().sort({ memberId: -1 });
    const newId = (lastMember?.memberId || 1000) + 1;

    const newMember = new Member({
      memberId: newId,
      name,
      email,
      phone,
      location: location || '',
      memberType: memberType || 'regular',
      plan: plan || 'basic',
      joinDate: new Date(),
      status: 'active',
      attendance: 0,
      loyaltyPoints: 0,
      amountPaid: 0
    });

    await newMember.save();
    res.status(201).json({
      message: 'Member registered',
      member: newMember
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// mark attendance
app.post('/api/members/:id/attendance', async (req, res) => {
  try {
    const member = await Member.findOne({ memberId: req.params.id });
    if (!member) {
      return res.status(404).json({ error: 'Member not found' });
    }

    member.attendance += 1;

    // loyalty points
    if (member.memberType === 'premium') {
      member.loyaltyPoints += 10;
    } else {
      member.loyaltyPoints += 5;
    }

    await member.save();
    res.json({
      message: 'Attendance marked',
      attendance: member.attendance,
      loyaltyPoints: member.loyaltyPoints
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// record payment
app.post('/api/members/:id/payment', async (req, res) => {
  try {
    const { amount } = req.body;
    if (!amount) {
      return res.status(400).json({ error: 'Amount is required' });
    }

    const member = await Member.findOne({ memberId: req.params.id });
    if (!member) {
      return res.status(404).json({ error: 'Member not found' });
    }

    member.amountPaid += amount;
    await member.save();

    res.json({
      message: 'Payment recorded',
      totalPaid: member.amountPaid
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// update member status
app.put('/api/members/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    if (!status) {
      return res.status(400).json({ error: 'Status is required' });
    }

    const member = await Member.findOne({ memberId: req.params.id });
    if (!member) {
      return res.status(404).json({ error: 'Member not found' });
    }

    member.status = status;
    await member.save();

    res.json({
      message: 'Status updated',
      status: member.status
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// get stats
app.get('/api/stats', async (req, res) => {
  try {
    const totalMembers = await Member.countDocuments();
    const activeMembers = await Member.countDocuments({ status: 'active' });
    const premiumMembers = await Member.countDocuments({ memberType: 'premium' });
    const regularMembers = await Member.countDocuments({ memberType: 'regular' });

    res.json({ totalMembers, activeMembers, premiumMembers, regularMembers });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is running' });
});

// error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong' });
});

// start server
const server = app.listen(PORT, () => {
  console.log(`\nServer running on http://localhost:${PORT}`);
  console.log('Ready to accept requests\n');
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    const newPort = parseInt(PORT) + 1;
    console.log(`Port ${PORT} is busy, trying port ${newPort}...`);
    app.listen(newPort, () => {
      console.log(`\nServer running on http://localhost:${newPort}`);
      console.log('Ready to accept requests\n');
    });
  } else {
    console.error(err);
  }
});
