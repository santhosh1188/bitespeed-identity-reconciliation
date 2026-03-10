# BiteSpeed Identity Reconciliation

Backend service that identifies and links customer identities based on email and phone number.

## Tech Stack

- Node.js
- TypeScript
- Express
- PostgreSQL
- Sequelize

## API Endpoint

POST /identify

### Request

```json
{
  "email": "string?",
  "phoneNumber": "string?"
}
```

Response
```json
{
  "contact": {
    "primaryContatctId": 1,
    "emails": [
      "example@email.com"
    ],
    "phoneNumbers": [
      "123456"
    ],
    "secondaryContactIds": []
  }
}
```

## Identity Reconciliation Logic

* A customer may have multiple contact records.

* The oldest contact is considered the primary contact.

* New contacts with shared email or phone become secondary contacts.

* If two primary contacts become linked, the newer one is converted to secondary.

**Setup Instructions:**

1. Install dependencies:
**npm install**

2. Configure environment variables:
**Create .env from .env.example.**

3. Run the server:
**npm run dev**

Server runs at:

**http://localhost:3000**

Test API

Example request:

POST /identify
{
  "email": "doc@fluxkart.com",
  "phoneNumber": "999999"
}

## Deployment

The API is deployed on **Render**.

**GitHub Repository**:
https://github.com/santhosh1188/bitespeed-identity-reconciliation

Live endpoint(Render):
(in postman)
POST https://bitespeed-identity-reconciliation-rugi.onrender.com/identify

Author:
Santhosh Kumar Penupotula