# 🎉 Event Management Platform

Welcome to the **Event Management Platform** – a comprehensive, MERN stack-powered solution that simplifies event creation, ticket sales, attendee management, and event analytics tracking. Whether you’re organizing a small gathering or a large conference, our platform has everything you need for successful event management!

## 🚀 Features

- **Create & Customize Events**  
  Design events with unique details, descriptions, and images for each event page.

- **Ticket Sales & Management**  
  Sell tickets directly on the platform with built-in options for ticket types, pricing, and quantity controls.

- **Attendee Management**  
  Keep track of attendees, view attendee lists, and manage attendee details effortlessly.

- **Send Invitations**  
  Easily send customized email invitations to guests directly from the platform.

- **Event Analytics**  
  Track key metrics like ticket sales, attendee counts, and other analytics to optimize your events.

## 🌐 Tech Stack

- **Frontend:** React.js with TailwindCSS
- **Backend:** Node.js & Express.js
- **Database:** MongoDB
- **Authentication:** JSON Web Tokens (JWT)
- **Payments:** Integrated payment gateway (e.g., Stripe)

## 📥 Installation & Setup

To get the platform up and running locally, follow these steps:

1. **Clone the Repository**
   ```bash
   git clone https://github.com/nishitsaha52/PlanItgit
   cd PlantIt
   ```

2. **Install Dependencies**
   ```bash
   # Install backend dependencies
   cd server
   npm install

   # Install frontend dependencies
   cd ../client
   npm install
   ```

3. **Set Up Environment Variables**  
   Add environment variables in `.env` for server and client configuration:
   ```plaintext
   SERVER_PORT=5000
   DB_URI=your_mongodb_uri
   JWT_SECRET=your_jwt_secret
   STRIPE_API_KEY=your_stripe_key
   ```

4. **Run the Platform**
   ```bash
   # Start the backend server
   cd server
   npm start

   # Start the frontend app
   cd ../client
   npm start
   ```

5. **Access the Platform**  
   Go to `http://localhost:3000` to explore your Event Management Platform!

## 🔍 Usage

1. **Create Your Event**  
   Add event details, ticket options, and upload media to create an engaging event page.

2. **Manage Attendees**  
   View, add, or remove attendees as your event progresses.

3. **Track Analytics**  
   Get insights into ticket sales, attendees, and more to make data-driven event decisions.

## 🤝 Contributing

We welcome contributions! Here’s how you can help:
1. Fork the repo
2. Create a new branch for your feature: `git checkout -b feature-name`
3. Commit changes: `git commit -m 'Add feature'`
4. Push to the branch: `git push origin feature-name`
5. Open a pull request!

---
