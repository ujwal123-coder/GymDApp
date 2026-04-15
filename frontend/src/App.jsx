import React, { useState, useEffect } from 'react';
import './App.css';
import ConnectWallet from './components/ConnectWallet';

function App() {
  const [account, setAccount] = useState(null);
  const [connected, setConnected] = useState(false);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showForm, setShowForm] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    location: '',
    memberType: 'regular',
    plan: 'basic'
  });

  // Fetch members from API
  const fetchMembers = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5001/api/members');
      const data = await response.json();
      setMembers(data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch members');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleRegisterMember = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5001/api/members/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error('Failed to register member');
      }

      alert('Member registered successfully!');
      
      setFormData({
        name: '',
        email: '',
        phone: '',
        location: '',
        memberType: 'regular',
        plan: 'basic'
      });
      setShowForm(false);
      fetchMembers();
    } catch (err) {
      setError(err.message);
      alert('Error: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAttendance = async (memberId) => {
    try {
      const response = await fetch(`http://localhost:5001/api/members/${memberId}/attendance`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to mark attendance');
      }

      alert('Attendance marked!');
      fetchMembers();
    } catch (err) {
      alert('Error: ' + err.message);
    }
  };

  const handleUpdateStatus = async (memberId, newStatus) => {
    try {
      const response = await fetch(`http://localhost:5001/api/members/${memberId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (!response.ok) {
        throw new Error('Failed to update status');
      }

      alert('Status updated!');
      fetchMembers();
    } catch (err) {
      alert('Error: ' + err.message);
    }
  };

  // Calculate stats
  const stats = {
    total: members.length,
    active: members.filter(m => m.status === 'active').length,
    premium: members.filter(m => m.memberType === 'premium').length,
    attendance: members.reduce((sum, m) => sum + (m.attendance || 0), 0)
  };

  // Filter members
  const filteredMembers = members.filter(m => {
    const typeMatch = filterType === 'all' || m.memberType === filterType;
    const statusMatch = filterStatus === 'all' || m.status === filterStatus;
    return typeMatch && statusMatch;
  });

  return (
    <div className="app">
      <header className="header">
        <div className="header-left">
          <div className="logo">G</div>
          <h1>Gym Member Management</h1>
          <p className="subtitle">Athletic Command Center</p>
        </div>
        <div className="header-right">
          <button className="btn-add-member" onClick={() => setShowForm(true)}>
            ➕ Add Member
          </button>
        </div>
      </header>

      <main className="main-content">
        {/* Stats Bar */}
        <div className="stats-bar">
          <div className="stat-card">
            <div className="stat-label">TOTAL MEMBERS</div>
            <div className="stat-value">{stats.total}</div>
            <div className="stat-icon">👥</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">ACTIVE MEMBERS</div>
            <div className="stat-value">{stats.active}</div>
            <div className="stat-icon">✓</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">PREMIUM MEMBERS</div>
            <div className="stat-value">{stats.premium}</div>
            <div className="stat-icon">⭐</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">TOTAL ATTENDANCE</div>
            <div className="stat-value">{stats.attendance}</div>
            <div className="stat-icon">📊</div>
          </div>
        </div>

        {/* Filters */}
        <div className="filters-section">
          <div className="filter-group">
            <span className="filter-label">Type:</span>
            <button 
              className={`filter-btn ${filterType === 'all' ? 'active' : ''}`}
              onClick={() => setFilterType('all')}
            >
              All
            </button>
            <button 
              className={`filter-btn ${filterType === 'regular' ? 'active' : ''}`}
              onClick={() => setFilterType('regular')}
            >
              Regular
            </button>
            <button 
              className={`filter-btn ${filterType === 'premium' ? 'active' : ''}`}
              onClick={() => setFilterType('premium')}
            >
              Premium
            </button>
          </div>

          <div className="filter-group">
            <span className="filter-label">Status:</span>
            <button 
              className={`filter-btn ${filterStatus === 'all' ? 'active' : ''}`}
              onClick={() => setFilterStatus('all')}
            >
              All
            </button>
            <button 
              className={`filter-btn ${filterStatus === 'active' ? 'active' : ''}`}
              onClick={() => setFilterStatus('active')}
            >
              Active
            </button>
            <button 
              className={`filter-btn ${filterStatus === 'inactive' ? 'active' : ''}`}
              onClick={() => setFilterStatus('inactive')}
            >
              Inactive
            </button>
          </div>
        </div>

        {/* Registration Form */}
        {showForm && (
          <div className="form-overlay">
            <div className="form-container">
              <h2>Register New Member</h2>
              <form onSubmit={handleRegisterMember}>
                <input
                  type="text"
                  name="name"
                  placeholder="Full Name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
                <input
                  type="tel"
                  name="phone"
                  placeholder="Phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                />
                <input
                  type="text"
                  name="location"
                  placeholder="Location"
                  value={formData.location}
                  onChange={handleInputChange}
                />
                <select name="memberType" value={formData.memberType} onChange={handleInputChange}>
                  <option value="regular">Regular Member</option>
                  <option value="premium">Premium Member</option>
                </select>
                <select name="plan" value={formData.plan} onChange={handleInputChange}>
                  <option value="basic">Basic Plan</option>
                  <option value="standard">Standard Plan</option>
                  <option value="deluxe">Deluxe Plan</option>
                </select>
                <button type="submit" className="btn-submit">Register</button>
                <button type="button" className="btn-cancel" onClick={() => setShowForm(false)}>Cancel</button>
              </form>
            </div>
          </div>
        )}

        {/* Members Grid */}
        <div className="members-grid">
          {filteredMembers.map(member => (
            <div key={member._id} className="member-card">
              <div className="card-header">
                <h3>{member.name}</h3>
                <span className={`badge ${member.memberType}`}>
                  {member.memberType.charAt(0).toUpperCase() + member.memberType.slice(1)}
                </span>
              </div>

              <div className="card-id">ID: {member.memberId}</div>

              <div className="card-info">
                <p>📧 {member.email}</p>
                <p>📱 {member.phone}</p>
                <p>📍 {member.location || 'N/A'}</p>
              </div>

              <div className="card-stats">
                <div className="stat">
                  <span>Attendance</span>
                  <strong>{member.attendance || 0}</strong>
                </div>
                <div className="stat">
                  <span>Loyalty</span>
                  <strong>{member.loyaltyPoints || 0}</strong>
                </div>
                <div className="stat">
                  <span>Status</span>
                  <strong className={member.status === 'active' ? 'active' : 'inactive'}>
                    {member.status.charAt(0).toUpperCase() + member.status.slice(1)}
                  </strong>
                </div>
              </div>

              <div className="card-details">
                <p><strong>Plan:</strong> {member.plan}</p>
                {member.memberType === 'premium' && (
                  <p><strong>Payment:</strong> {member.amountPaid || 0}/50000</p>
                )}
              </div>

              <div className="card-actions">
                <button 
                  className="btn-action mark-attendance"
                  onClick={() => handleMarkAttendance(member.memberId)}
                >
                  ✓ Mark Attendance
                </button>
                {member.status === 'active' ? (
                  <button 
                    className="btn-action deactivate"
                    onClick={() => handleUpdateStatus(member.memberId, 'inactive')}
                  >
                    ✕ Deactivate
                  </button>
                ) : (
                  <button 
                    className="btn-action activate"
                    onClick={() => handleUpdateStatus(member.memberId, 'active')}
                  >
                    ✓ Activate
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {filteredMembers.length === 0 && (
          <div className="no-members">
            <p>No members found</p>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
