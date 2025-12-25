#  Full Stack Notes Application

A **full stack notes app** built as part of the internship assignment to demonstrate understanding of frontend-backend integration, user authentication, and user-based data handling.

 The app allows users to register, login, and perform **CRUD operations** on their own notes.

---

##  Features

 User Registration & Login  
 JWT Authentication (secure credentials)  
 Create / Edit / Delete Notes  
 View list of user-specific notes  
 Frontend consumes backend APIs  
 Responsive UI  
 No hardcoded data

---

##  Tech Stack

| Frontend | Backend | Database |
|----------|---------|----------|
| React.js | Node.js + Express | MongoDB |

---

##  Project Structure

```

├── backend/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   └── server.js
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   └── App.js
│   └── package.json
│
├── .gitignore
├── README.md
└── package.json

````

---

##  Prerequisites

Make sure you have installed:

✔ Node.js (v14+)  
✔ npm or yarn  
✔ MongoDB (Atlas or local)

---

##  Local Setup (Step-by-Step)

### 1️ Clone the repository

```bash
git clone https://github.com/Ramasaikiran/Full-Stack-Notes-Application-.git
cd Full-Stack-Notes-Application-
````

---

### 2️ Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file inside the `backend` folder:

```
PORT=5000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
```

Run the backend server:

```bash
npm start
```

Your backend will start at:

```
http://localhost:5000
```

---

### 3️ Frontend Setup

Open another terminal:

```bash
cd ../frontend
npm install
npm start
```

Your frontend will run at:

```
http://localhost:3000
```

---

##  API Endpoints

### Auth

| Method | Endpoint             | Description     |
| ------ | -------------------- | --------------- |
| POST   | `/api/auth/register` | Create a user   |
| POST   | `/api/auth/login`    | Login & get JWT |

### Notes (Protected)

| Method | Endpoint         | Description   |
| ------ | ---------------- | ------------- |
| GET    | `/api/notes`     | Get all notes |
| POST   | `/api/notes`     | Create note   |
| PUT    | `/api/notes/:id` | Update note   |
| DELETE | `/api/notes/:id` | Delete note   |

> All notes APIs require JWT token in headers:

```
Authorization: Bearer <token>
```

---

##  Authentication Flow

1. User registers with email & password
2. Backend hashes password, saves user
3. User logs in → receives JWT token
4. Frontend stores JWT (localStorage/cookie)
5. Requests to protected routes include token

---

##  Tips for Deployment

You can deploy:

✔ Backend → Render / Heroku
✔ Frontend → Netlify / Vercel
✔ MongoDB → Atlas

Make sure to set environment variables in your host.

---

##  Future Enhancements

* Add edit profile option
* Add search & filter notes
* Improve UI design
* Add pagination

---

##  Author

**Medam Rama Sai Kiran**
