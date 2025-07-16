# Event Management API

This is a RESTful API for managing events and user registrations, built using Node.js, Express, PostgreSQL, and Sequelize. It supports creating events, registering users, enforcing event constraints (like capacity and date), and viewing detailed statistics.

---

##  Getting Started

These steps will help you get the project up and running on your local machine.

### 1. Clone the repository

git clone https://github.com/your-username/event-management-api.git
cd event-management-api

### 2. Install dependencies

npm install

### 3. Set up the PostgreSQL database

Open pgAdmin and create a new database named: event_db

### 4. Configure environment variables

Create a .env file in the root directory and add your database credentials.

### 5. Run migrations to create the tables

npx sequelize-cli db:migrate

### 6. Start the server

npm start
The server will start on: http://localhost:3000

## API Overview


| Method | Endpoint               | Description                               |
| ------ | ---------------------- | ----------------------------------------- |
| POST   | `/users`               | Create a new user                         |
| POST   | `/events`              | Create a new event                        |
| GET    | `/events/:id`          | Get full details of an event              |
| POST   | `/events/:id/register` | Register a user for an event              |
| POST   | `/events/:id/cancel`   | Cancel a user’s registration              |
| GET    | `/events/upcoming`     | List all upcoming events (sorted)         |
| GET    | `/events/:id/stats`    | View event stats: registration + capacity |

### Here are some screenshots of requests and responses:

<img width="1738" height="888" alt="Screenshot 2025-07-16 064413" src="https://github.com/user-attachments/assets/567afaf4-943a-431d-b859-64d4b6be3915" />
<img width="1754" height="877" alt="Screenshot 2025-07-16 064507" src="https://github.com/user-attachments/assets/f61df554-9072-4cf7-b54c-d0d8748b7ede" />
<img width="1659" height="866" alt="Screenshot 2025-07-16 064648" src="https://github.com/user-attachments/assets/d8f07cc9-91aa-4405-a75b-3cbabf643af5" />
<img width="1713" height="873" alt="Screenshot 2025-07-16 064540" src="https://github.com/user-attachments/assets/6de809df-6822-4eee-b231-dea929d1ce3a" />



