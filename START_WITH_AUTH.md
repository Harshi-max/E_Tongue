# Starting E-Tongue with Real Authentication

## 🚀 Quick Start

### 1. Install Dependencies

```bash
cd e_tongue/backend
pip install -r requirements.txt
```

**New dependencies:**
- `bcrypt==4.0.1` - Password hashing
- `pyjwt==2.8.0` - JWT token generation
- `python-jose[cryptography]==3.3.0` - JWT support

### 2. Start Backend

```bash
cd e_tongue/backend
python app.py
```

**First run will:**
- Create `users.db` SQLite database
- Initialize user table
- Start API server on `http://localhost:8000`

### 3. Start Frontend

```bash
cd e_tongue/frontend
npm run dev
```

Frontend runs on `http://localhost:3000`

## 🎯 Using Authentication

### Create Account (Signup)

1. Go to `http://localhost:3000`
2. You'll be redirected to `/login`
3. Click **"Sign Up"** tab
4. Fill in:
   - Email (e.g., `user@example.com`)
   - Password (min 6 characters, e.g., `password123`)
   - Name (optional, e.g., `John Doe`)
5. Click **"Create Account"**
6. You'll be automatically logged in and redirected to dashboard

### Login

1. Go to `http://localhost:3000/login`
2. Fill in:
   - Email (your registered email)
   - Password (your password)
3. Click **"Sign In"**
4. You'll be redirected to dashboard

### Logout

- Click **"Logout"** button in sidebar
- Token will be cleared
- You'll be redirected to login page

## 🔐 Security Features

✅ **Password Hashing** - bcrypt with salt  
✅ **JWT Tokens** - Secure token-based auth  
✅ **Token Verification** - Every request verified  
✅ **Protected Routes** - Automatic redirect if not authenticated  
✅ **SQL Injection Protection** - Parameterized queries  

## 📝 Features

- **Signup/Signin Tabs** - Easy to switch between modes
- **Form Validation** - Email format, password length
- **Error Handling** - Clear error messages
- **Toast Notifications** - Success/error feedback
- **Auto-redirect** - Automatic navigation after auth
- **Token Management** - Secure storage and cleanup

## 🧪 Test Users

Create a test account:
- **Email:** `test@example.com`
- **Password:** `test123`
- **Name:** `Test User`

Try logging in with these credentials after signup!

---

**Authentication system is production-ready!** ✅

