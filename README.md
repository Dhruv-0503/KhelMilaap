# KhelMilaap

KhelMilaap is a dynamic and interactive full-stack web application designed to bridge the gap between sports enthusiasts, players, and coaches. It provides a centralized platform for users to connect, form communities, chat in real-time, and discover sporting events and coaching opportunities.

## ✨ Features

-   **User Authentication**: Secure user registration and login system using JWT tokens.
-   **Profile Management**: Users can create and manage their profiles, showcasing their skills, sports, and achievements.
-   **Social Connectivity**: Follow and unfollow other users to build a network of sports connections.
-   **Real-time Chat**:
    -   One-on-one private messaging with other users and coach.
    -   Group chats within communities.
    -   Real-time updates.
-   **Community Hub**: Create and join communities based on specific sports or interests.
-   **Interactive Dashboard**: A personalized dashboard showing user stats, including a unique count of friends (followers and following), posts, and upcoming events.
-   **Player & Coach Discovery**: Easily search for and connect with players and coaches.

## 🚀 Tech Stack

### Frontend

-   **Framework**: React (with Vite for a fast development experience)
-   **Styling**: TailwindCSS
-   **Animations**: Framer Motion
-   **Routing**: React Router
-   **State Management**: React Hooks
-   **API Communication**: Axios
-   **Real-time Communication**: Socket.io-client

### Backend

-   **Framework**: Node.js & Express.js
-   **Database**: MongoDB with Mongoose ODM
-   **Authentication**: JSON Web Tokens (JWT) & bcrypt for password hashing
-   **Real-time Communication**: Socket.io
-   **File Storage**: Multer for handling file uploads

## 🛠️ Installation and Setup

To get a local copy up and running, follow these simple steps.

### Prerequisites

-   Node.js (v14 or higher)
-   npm (v6 or higher)
-   MongoDB (local instance or a cloud-based service like MongoDB Atlas)

### Backend Setup

1.  Navigate to the `Backend` directory:
    ```sh
    cd Backend
    ```
2.  Install the required dependencies:
    ```sh
    npm install
    ```
3.  Create a `.env` file in the `Backend` directory and add the following environment variables:
    ```
    MONGO_URI=your_mongodb_connection_string
    JWT_SECRET=your_jwt_secret_key
    ```
4.  Start the backend server:
    ```sh
    npm start
    ```
    The server will be running on `http://localhost:5000`.

### Frontend Setup

1.  Open a new terminal and navigate to the `Client` directory:
    ```sh
    cd Client
    ```
2.  Install the required dependencies:
    ```sh
    npm install
    ```
3.  Start the frontend development server:
    ```sh
    npm run dev
    ```
    The application will be accessible at `http://localhost:5173` (or another port if 5173 is busy).

---

Thank you for checking out KhelMilaap! 
