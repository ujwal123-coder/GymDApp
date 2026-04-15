# Gym Management System - Website Preview

## How Your Website Looks

### 1. Header Section
```
┌─────────────────────────────────────────────────────────────┐
│  Gym Management System          [Connect Wallet Button]     │
└─────────────────────────────────────────────────────────────┘
```

The header has:
- **Title**: "Gym Management System" on the left
- **Wallet Button**: "Connect Wallet" on the right (turns into wallet address when connected)

---

### 2. Main Dashboard

#### Control Buttons
```
┌──────────────────────────────────────────────────────────────┐
│  [Add New Member]  [Refresh]                                 │
└──────────────────────────────────────────────────────────────┘
```

---

### 3. Registration Form (When "Add New Member" is clicked)

```
┌──────────────────────────────────────────────────────────────┐
│  Register New Member                                         │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  Name:                                                       │
│  [_________________________________]                        │
│                                                              │
│  Email:                                                      │
│  [_________________________________]                        │
│                                                              │
│  Phone:                                                      │
│  [_________________________________]                        │
│                                                              │
│  Member Type:                                                │
│  [Regular ▼]                                                 │
│                                                              │
│  Plan:                                                       │
│  [Basic ▼]                                                   │
│                                                              │
│  [Register Member]                                           │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

---

### 4. Members List

Each member appears as a card:

```
┌─────────────────────────────────────────────────────────────┐
│  John Doe                                    [ACTIVE]        │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Email: john@example.com                                   │
│  Phone: 1234567890                                         │
│  Type: regular                                             │
│  Plan: basic                                               │
│  Attendance: 5                                             │
│  Loyalty Points: 25                                        │
│  Amount Paid: 6500                                         │
│                                                             │
│  [Mark Attendance]  [Deactivate]                           │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

### 5. Color Scheme

- **Header Background**: Dark gray (#2c3e50)
- **Header Text**: White
- **Button Colors**:
  - Primary (Add Member): Blue (#3498db)
  - Success (Register): Green (#27ae60)
  - Danger (Deactivate): Red (#e74c3c)
  - Secondary (Refresh): Gray (#95a5a6)
- **Card Background**: Light gray (#fafafa)
- **Status Badge**:
  - Active: Green
  - Inactive: Red

---

### 6. Responsive Design

**On Desktop**:
- Multiple member cards in a grid (3 columns)
- Full form width

**On Tablet**:
- 2 columns of member cards
- Form takes full width

**On Mobile**:
- 1 column of member cards
- Stacked buttons
- Full-width form

---

### 7. User Interactions

#### Connecting Wallet
1. User clicks "Connect Wallet"
2. MetaMask popup appears
3. User approves connection
4. Button changes to show wallet address (e.g., "0x1234...5678")
5. User can now interact with blockchain features

#### Adding a Member
1. Click "Add New Member"
2. Form appears
3. Fill in details
4. Click "Register Member"
5. Success message appears
6. Form closes
7. New member appears in list

#### Marking Attendance
1. Click "Mark Attendance" on member card
2. Attendance count increases
3. Loyalty points automatically increase
4. List refreshes

#### Deactivating/Activating
1. Click "Deactivate" button
2. Status changes to "INACTIVE" (red badge)
3. Button changes to "Activate"
4. Can reactivate anytime

---

### 8. Data Display

Each member card shows:
- **Name** (large, bold)
- **Status** (badge: ACTIVE/INACTIVE)
- **Email** (contact info)
- **Phone** (contact info)
- **Member Type** (regular/premium)
- **Plan** (basic/standard/deluxe)
- **Attendance** (number of visits)
- **Loyalty Points** (calculated automatically)
- **Amount Paid** (total payment)

---

### 9. Features in Action

**Example Workflow:**

1. **Start**: User opens website
2. **Connect**: Clicks "Connect Wallet" → MetaMask connects
3. **Register**: Clicks "Add New Member" → Fills form → Registers John Doe
4. **View**: John Doe appears in members list with status "ACTIVE"
5. **Track**: Click "Mark Attendance" → Attendance becomes 1, Loyalty Points become 5
6. **Manage**: Click "Mark Attendance" again → Attendance becomes 2, Loyalty Points become 10

---

### 10. Mobile View Example

```
┌─────────────────────────────────────┐
│ Gym Management System               │
│              [Connect]              │
├─────────────────────────────────────┤
│                                     │
│  [Add New Member]                   │
│  [Refresh]                          │
│                                     │
│  ┌─────────────────────────────────┐│
│  │ John Doe        [ACTIVE]        ││
│  ├─────────────────────────────────┤│
│  │ Email: john@example.com         ││
│  │ Phone: 1234567890               ││
│  │ Type: regular                   ││
│  │ Attendance: 5                   ││
│  │ Loyalty Points: 25              ││
│  │                                 ││
│  │ [Mark Attendance]               ││
│  │ [Deactivate]                    ││
│  └─────────────────────────────────┘│
│                                     │
│  ┌─────────────────────────────────┐│
│  │ Jane Smith      [ACTIVE]        ││
│  │ ...                             ││
│  └─────────────────────────────────┘│
│                                     │
└─────────────────────────────────────┘
```