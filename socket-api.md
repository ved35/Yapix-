# Backend Socket API Documentation

## Base Configuration
- **Socket URL**: `https://echomeet-3wyb.onrender.com`
- **Transport**: WebSocket only
- **Authentication**: JWT token required for all events

---

## 1. User List Event

### Frontend → Backend: `user-list`
**What Frontend Sends:**
```json
{
  "token": "jwt_token_here"
}
```

### Backend → Frontend: `receiver-user-list`
**What Backend Should Send:**
```json
{
  "data": [
    {
      "id": "user_123",
      "fullName": "John Doe",
      "avatar": "/uploads/avatar.jpg",
      "isOnline": true,
      "lastSeen": "2024-01-16T10:30:00.000Z"
    }
  ]
}
```

---

## 2. User Status Event

### Frontend → Backend: `status`
**What Frontend Sends:**
```json
{
  "token": "jwt_token_here"
}
```

### Backend → Frontend: `status`
**What Backend Should Send:**
```json
{
  "status": true
}
```

---

## 3. Get Messages Event

### Frontend → Backend: `get-message`
**What Frontend Sends:**
```json
{
  "token": "jwt_token_here",
  "userId": "target_user_id",
  "limit": 20,
  "page": 1
}
```

### Backend → Frontend: `get-message`
**What Backend Should Send:**
```json
{
  "chatId": "chat_room_id",
  "data": {
    "array": [
      {
        "id": "msg_123",
        "message": "Hello, how are you?",
        "createdAt": "2024-01-16T10:30:00.000Z",
        "userId": {
          "id": "user_123",
          "fullName": "John Doe"
        },
        "attachment": null,
        "messageId": null,
        "is_read": 0
      }
    ]
  }
}
```

---

## 4. Send Message Event

### Frontend → Backend: `message`
**What Frontend Sends:**
```json
{
  "token": "jwt_token_here",
  "userid": "target_user_id",
  "message": "Hello, how are you?",
  "messageId": null,
  "attachment": null
}
```

**OR with reply:**
```json
{
  "token": "jwt_token_here",
  "userid": "target_user_id",
  "message": "This is a reply",
  "messageId": "msg_123",
  "attachment": null
}
```

**OR with attachment:**
```json
{
  "token": "jwt_token_here",
  "userid": "target_user_id",
  "message": "Check this out!",
  "messageId": null,
  "attachment": {
    "url": "/uploads/image.jpg",
    "type": "image/jpeg",
    "filename": "photo.jpg"
  }
}
```

### Backend → Frontend: `receive-message`
**What Backend Should Send:**
```json
{
  "data": {
    "chatId": "chat_room_id",
    "id": "msg_124",
    "message": "Hello, how are you?",
    "createdAt": "2024-01-16T10:35:00.000Z",
    "userId": {
      "id": "user_123",
      "fullName": "John Doe"
    },
    "attachment": null,
    "messageId": null,
    "is_read": 0
  }
}
```

---

## 5. Typing Indicator Event

### Frontend → Backend: `typing-start`
**What Frontend Sends:**
```json
{
  "token": "jwt_token_here",
  "userid": "target_user_id",
  "chatId": "chat_room_id"
}
```

### Frontend → Backend: `typing-stop`
**What Frontend Sends:**
```json
{
  "token": "jwt_token_here",
  "userid": "target_user_id",
  "chatId": "chat_room_id"
}
```

### Backend → Frontend: `typing-indicator`
**What Backend Should Send:**
```json
{
  "chatId": "chat_room_id",
  "userId": "user_123",
  "fullName": "John Doe",
  "isTyping": true
}
```

---

## 6. Connection Events

### Frontend → Backend: `connect`
**What Frontend Sends:** Nothing (automatic)

### Backend → Frontend: `connect_error`
**What Backend Should Send:**
```json
{
  "error": "Authentication failed"
}
```

### Backend → Frontend: `disconnected`
**What Backend Should Send:**
```json
{
  "reason": "User disconnected"
}
```

---

## Data Types Reference

### Message Object
```typescript
{
  id: string;           // Unique message ID
  message: string;      // Message content
  createdAt: string;    // ISO timestamp
  userId: {
    id: string;         // Sender user ID
    fullName: string;   // Sender full name
  };
  attachment?: {        // Optional file attachment
    url: string;        // File URL
    type: string;       // MIME type
    filename: string;   // Original filename
  };
  messageId?: {         // Optional reply to message
    id: string;
    message: string;
    attachment?: {
      url: string;
      type: string;
      filename: string;
    };
  };
  is_read: number;      // 0 = unread, 1 = read
}
```

### User Object
```typescript
{
  id: string;           // User ID
  fullName: string;     // User full name
  avatar?: string;      // Avatar URL
  isOnline?: boolean;   // Online status
  lastSeen?: string;    // Last seen timestamp
}
```

---

## Implementation Notes

1. **Authentication**: Validate JWT token for all events
2. **Error Handling**: Send appropriate error messages for invalid requests
3. **Real-time**: Broadcast messages to all connected users in the chat
4. **Typing Indicator**: Broadcast typing status to all users in the chat
5. **Message Ordering**: Ensure messages are delivered in chronological order
6. **File Uploads**: Handle file uploads before sending message with attachment
7. **Read Receipts**: Update message read status when recipient views message 