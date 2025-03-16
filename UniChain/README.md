{{ ... }}

# Student API Documentation

## Endpoints

### 1. Register a Student

- **POST** `/api/students/register`
- **Request Body**:
  ```json
  {
    "name": "John Doe",
    "email": "john.doe@example.com",
    "telegramId": "@johndoe",
    "universityId": "12345",
    "department": "Computer Science",
    "Batch": "2023",
    "university": "Example University",
    "password": "securepassword123"
  }
  ```
- **Sample Response**:
  ```json
  {
    "id": 1,
    "name": "John Doe",
    "email": "john.doe@example.com",
    "telegramId": "@johndoe",
    "universityId": "12345",
    "department": "Computer Science",
    "Batch": "2023",
    "university": "Example University",
    "walletAddress": "ABC123...",
    "createdAt": "2025-03-07T16:00:00.000Z"
  }
  ```

### 2. Get Student by ID

- **GET** `/api/students/:id`
- **Sample Response**:
  ```json
  {
    "id": 1,
    "name": "John Doe",
    "email": "john.doe@example.com",
    "telegramId": "@johndoe",
    "universityId": "12345",
    "department": "Computer Science",
    "Batch": "2023",
    "university": "Example University",
    "walletAddress": "ABC123...",
    "createdAt": "2025-03-07T16:00:00.000Z"
  }
  ```

### 3. Update Student

- **PUT** `/api/students/:id`
- **Request Body**:
  ```json
  {
    "name": "John Smith",
    "email": "john.smith@example.com"
  }
  ```
- **Sample Response**:
  ```json
  {
    "id": 1,
    "name": "John Smith",
    "email": "john.smith@example.com",
    "telegramId": "@johndoe",
    "universityId": "12345",
    "department": "Computer Science",
    "Batch": "2023",
    "university": "Example University",
    "walletAddress": "ABC123...",
    "createdAt": "2025-03-07T16:00:00.000Z"
  }
  ```

### 4. Delete Student

- **DELETE** `/api/students/:id`
- **Sample Response**:
  ```json
  {
    "message": "Student deleted successfully"
  }
  ```

### 5. Get All Students

- **GET** `/api/students`
- **Sample Response**:
  ```json
  [
    {
      "id": 1,
      "name": "John Doe",
      "email": "john.doe@example.com",
      "telegramId": "@johndoe",
      "universityId": "12345",
      "department": "Computer Science",
      "Batch": "2023",
      "university": "Example University",
      "walletAddress": "ABC123...",
      "createdAt": "2025-03-07T16:00:00.000Z"
    }
  ]
  ```

### 6. Login

- **POST** `/api/auth/login`
- **Request Body**:
  ```json
  {
    "email": "student@example.com",
    "password": "securepassword123"
  }
  ```
- **Sample Response**:
  ```json
  {
    "id": 1,
    "name": "John Doe",
    "email": "student@example.com",
    "telegramId": "@johndoe",
    "universityId": "12345",
    "department": "Computer Science",
    "Batch": "2023",
    "university": "Example University",
    "walletAddress": "ABC123...",
    "createdAt": "2025-03-07T16:00:00.000Z"
  }
  ```

## Student Registration and NFT Minting

### Student Registration

The system allows for student degree registration with the following details:

- Personal Information
- Academic Details
- Institution Information
- Verification and Security

### NFT Minting

Degrees can be minted as NFTs on the Solana blockchain using the following endpoint:

`POST /mint/:universityId`

**Parameters:**

- `universityId`: Unique identifier for the university

**Response:**

```json
{
  "success": boolean,
  "nftAddress": string
}
```

### Prerequisites

1. Solana Testnet Wallet
2. Metaplex SDK
3. Prisma ORM

### Setup

1. Install dependencies: `npm install`
2. Set up environment variables
3. Run the application: `npm start`

## University API Endpoints

### Create University

`POST /api/universities`

**Request Body:**

```json
{
  "name": "University Name",
  "email": "email@university.edu",
  "walletAddress": "0x...",
  "seedPhrase": "encrypted-seed-phrase",
  "location": "City, Country",
  "password": "securepassword"
}
```

### Get University

`GET /api/universities/:id`

### Update University

`PUT /api/universities/:id`

**Request Body:**

```json
{
  "name": "Updated University Name",
  "email": "updated@university.edu",
  "walletAddress": "0x...",
  "seedPhrase": "updated-encrypted-seed-phrase",
  "location": "Updated City, Country",
  "password": "updatedpassword"
}
```

### Delete University

`DELETE /api/universities/:id`

## Testing the API

### Example cURL Commands

1. **Register a Student**:

   ```bash
   curl -X POST http://localhost:3000/api/students \
   -H "Content-Type: application/json" \
   -d '{
     "name": "John Doe",
     "email": "john.doe@example.com",
     "telegramId": "@johndoe",
     "universityId": "12345",
     "department": "Computer Science",
     "Batch": "2023",
     "university": "Example University",
     "password": "securepassword123"
   }'
   ```

2. **Get Student by ID**:

   ```bash
   curl -X GET http://localhost:3000/api/students/1
   ```

3. **Update Student**:

   ```bash
   curl -X PUT http://localhost:3000/api/students/1 \
   -H "Content-Type: application/json" \
   -d '{
     "name": "John Smith",
     "email": "john.smith@example.com"
   }'
   ```

4. **Delete Student**:

   ```bash
   curl -X DELETE http://localhost:3000/api/students/1
   ```

5. **Get All Students**:

   ```bash
   curl -X GET http://localhost:3000/api/students
   ```

6. **Login**:
   ```bash
   curl -X POST http://localhost:3000/api/auth/login \
   -H "Content-Type: application/json" \
   -d '{
     "email": "student@example.com",
     "password": "securepassword123"
   }'




### 🗓️ **1. Book a Session**

**Endpoint:**
```http
POST /sessions
```

**Request Body:**
```json
{
  "studentId": 1,
  "counselorId": "counselor-id-uuid",
  "dateTime": "2025-03-20T10:00:00Z",
  "paymentTx": "payment-transaction-id"
}
```

**Response:**
```json
{
  "id": "session-uuid",
  "studentId": 1,
  "counselorId": "counselor-id-uuid",
  "dateTime": "2025-03-20T10:00:00Z",
  "status": "PENDING",
  "paymentTx": "payment-transaction-id",
  "createdAt": "2025-03-14T14:00:00Z",
  "updatedAt": "2025-03-14T14:00:00Z"
}
```

---

### 🕒 **2. Get Counselor Availability**

**Endpoint:**
```http
GET /counselors/:counselorId/availability
```

**Response:**
```json
{
  "availability": {
    "monday": ["09:00", "10:00", "11:00"],
    "tuesday": ["14:00", "15:00"],
    "wednesday": ["09:00", "10:00"]
  }
}
```

---

### ✅ **3. Update Session Status**

**Endpoint:**
```http
PUT /sessions/status
```

**Request Body:**
```json
{
  "sessionId": "session-uuid",
  "status": "COMPLETED"
}
```

**Response:**
```json
{
  "id": "session-uuid",
  "studentId": 1,
  "counselorId": "counselor-id-uuid",
  "dateTime": "2025-03-20T10:00:00Z",
  "status": "COMPLETED",
  "paymentTx": "payment-transaction-id",
  "createdAt": "2025-03-14T14:00:00Z",
  "updatedAt": "2025-03-14T14:15:00Z"
}
```

