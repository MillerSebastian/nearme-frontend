# Backend Endpoints Documentation

## Stores Endpoints

### GET /stores

- **Description:** Get all stores
- **Response:** Array of store objects
- **Example:**

```json
[
  {
    "nit_store": "123456789-0",
    "store_name": "Hardware Store Center",
    "address": "Calle 123 # 45-67, Bogotá",
    "phone_number": "3001234567",
    "email": "info@hardwarecenter.com",
    "id_store_type": 1,
    "opening_hours": "08:00",
    "closing_hours": "18:00",
    "note": ""
  }
]
```

### GET /stores/:nit

- **Description:** Get store by NIT
- **Parameters:** `nit` - Store NIT
- **Response:** Single store object

### POST /stores

- **Description:** Create new store
- **Body:**

```json
{
  "nit_store": "123456789-0",
  "store_name": "Hardware Store Center",
  "address": "Calle 123 # 45-67, Bogotá",
  "phone_number": "3001234567",
  "email": "info@hardwarecenter.com",
  "id_store_type": 1,
  "opening_hours": "08:00",
  "closing_hours": "18:00",
  "note": ""
}
```

### PUT /stores/:nit

- **Description:** Update store
- **Parameters:** `nit` - Store NIT
- **Body:** Same as POST

### DELETE /stores/:nit

- **Description:** Delete store
- **Parameters:** `nit` - Store NIT

### GET /stores/:nit/views

- **Description:** Get store views count
- **Parameters:** `nit` - Store NIT
- **Response:**

```json
{
  "store_nit": "123456789-0",
  "total_views": 15
}
```

### POST /stores/:nit/views

- **Description:** Record a store view
- **Parameters:** `nit` - Store NIT
- **Response:**

```json
{
  "store_nit": "123456789-0",
  "total_views": 16,
  "message": "View recorded successfully"
}
```

### GET /stores/:nit/products

- **Description:** Get products by store with view count
- **Parameters:** `nit` - Store NIT
- **Response:**

```json
{
  "store_nit": "123456789-0",
  "total_views": 15,
  "products": [
    {
      "id_product": 1,
      "product_name": "Hammer",
      "price": 25000,
      "category": "Hardware",
      "id_store": "123456789-0"
    }
  ]
}
```

## Store Types Mapping

| Type Name      | ID  |
| -------------- | --- |
| Hardware Store | 1   |
| Supermarket    | 2   |
| Pharmacy       | 3   |
| Stationery     | 4   |
| Other          | 5   |

## Frontend Integration

The frontend services are now configured to use these endpoints:

- **AuthService:** Uses `/stores` for registration
- **StoresService:** Uses all store endpoints
- **AuthManager:** Uses `/stores` for login and registration

## Error Handling

All endpoints return consistent error responses:

```json
{
  "status": "error",
  "endpoint": "/stores",
  "method": "GET",
  "message": "Error description"
}
```
