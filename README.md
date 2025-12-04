# DeliveryApp Webhook – Node.js + Express

A simple Node.js + Express server that accepts order webhooks, validates an API key, calculates total shipment weight, assigns a courier, and simulates saving the order to a database.

---

## Install

```bash
git clone git@github.com:harshyh03/DeliveryApp.git .
cd deliveryapp-test
npm install
```

## Configuration (env)

```bash
API_KEY=DELIVERYAPP_SECUR
PORT=3000
```

## Start the Server

```bash
npm start
```

## Endpoints & Examples

```bash
curl -X POST http://localhost:3000/webhook/order \
  -H "Content-Type: application/json" \
  -H "x-delivery-key: DELIVERYAPP_SECUR" \
  -d '{
    "id": 1234,
    "email": "candidate@deliveryapp.com",
    "created_at": "2025-12-01T10:00:00Z",
    "line_items": [
      { "grams": 1500, "quantity": 1 },
      { "grams": 500, "quantity": 2 }
    ]
  }'

```

## Example Success Response

```bash
{
  "message": "Order processed successfully",
  "processed_order": {
    "id": 1234,
    "customer_email": "candidate@deliveryapp.com",
    "total_weight": 2500,
    "courier": "DPD",
    "timestamp": "2025-12-01T10:00:00.000Z"
  },
  "data": {
    "success": true,
    "db_id": 452
  }
}
```

## Thankyou for reading this.
