# Products Endpoints Documentation

## Required Fields

Based on the error messages, the following fields are required for products:

- `product_name` (string) - Name of the product
- `price` (number) - Product price
- `category` (string) - Product category
- `id_store` (string) - Store NIT that owns the product
- `product_description` (string) - Product description

## Optional Fields

- `sold_out` (boolean) - Whether the product is out of stock (default: false)

## Endpoints

### POST /products

- **Description:** Create new product
- **Body:**

```json
{
  "product_name": "Professional Hammer",
  "price": 25000,
  "category": "Hardware",
  "id_store": "123456789-0",
  "product_description": "Steel hammer with ergonomic handle",
  "sold_out": false
}
```

### GET /products

- **Description:** Get all products
- **Response:** Array of product objects

### GET /products/:id

- **Description:** Get product by ID
- **Parameters:** `id` - Product ID
- **Response:** Single product object

### PUT /products/:id

- **Description:** Update product
- **Parameters:** `id` - Product ID
- **Body:** Same as POST

### DELETE /products/:id

- **Description:** Delete product
- **Parameters:** `id` - Product ID

## Frontend Integration

The frontend has been updated to include all required fields:

### ExcelUpload Component

- Maps Excel columns to required fields
- Includes `product_description` field
- Handles missing descriptions with empty string

### Dashboard Component

- Form includes `product_description` field
- All product operations include description field
- Updates and creates use complete payload

### ProductsService

- Sends all required fields to backend
- Handles errors consistently
- Uses proper authentication headers

## Error Handling

The backend returns 400 Bad Request when required fields are missing:

```json
{
  "message": "Missing required fields: product_name, price, category, id_store, product_description"
}
```

## Example Product Object

```json
{
  "id_product": 1,
  "product_name": "Professional Hammer",
  "price": 25000,
  "category": "Hardware",
  "id_store": "123456789-0",
  "product_description": "Steel hammer with ergonomic handle",
  "sold_out": false
}
```
