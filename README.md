# Hifurdez Back-end

This is a sample JavaScript project that demonstrates how to build a RESTful API using Node.js and Express.js.

## Installation

To install the project, clone the repository and install the dependencies:

```
npm install
```

## Usage

To start the server, run the following command:

```
npm start
```

The server will start listening on port 3000.

## API Endpoints

The following API endpoints are available:

The AUTH endpoints include:
- POST `/auth/sign-in`: signs in a user
- POST `/auth/sign-up`: signs up a user

The PRODUCT endpoints include:
- GET `/product-random-by-spring`: retrieves a random product for spring
- GET `/product-random-by-summer`: retrieves a random product for summer
- GET `/product-random-by-autumn`: retrieves a random product for autumn
- GET `/product-random-by-winter`: retrieves a random product for winter
- GET `/all-product`: retrieves a list of all products
- GET `/product-random`: retrieves 8 random products
- POST `/product-by-id`: retrieves details of a product with a given ID

The ADMIN endpoints include:
- GET `/admin/users`: retrieves a list of admin users
- POST `/admin/users/detail`: retrieves details of an admin user with a given ID
- PUT `/admin/users/change-status`: changes the status of an admin user with a given ID
- GET `/admin/products`: retrieves a list of products
- POST `/admin/products/detail`: retrieves details of a product with a given ID
- PUT `/admin/products/change-status`: changes the status of a product with a given ID
- PUT `/admin/products/update-info`: updates the information of a product with a given ID
- PUT `/admin/products/add-new`: adds a new product
- GET `/admin/order/sale`: retrieves a list of sale orders
- PUT `/admin/order/sale/status`: updates the status of a sale order with a given ID
- POST `/admin/order/sale/detail`: retrieves details of a sale order with a given ID
- GET `/admin/order/purchase`: retrieves a list of purchase orders
- PUT `/admin/order/purchase/status`: updates the status of a purchase order with a given ID
- POST `/admin/order/purchase/detail`: retrieves details of a purchase order with a given ID
- GET `/admin/3pls`: retrieves a list of third-party logistics providers
- POST `/admin/3pls/detail`: retrieves details of a third-party logistics provider with a given ID
- PUT `/admin/3pls/change-status`: changes the status of a third-party logistics provider with a given ID
- GET `/admin/3plse`: retrieves a list of third-party logistics provider employees
- POST `/admin/3plse/detail`: retrieves details of a third-party logistics provider employee with a given ID
- PUT `/admin/3plse/change-status`: changes the status of a third-party logistics provider employee with a given ID
- GET `/admin/warehouse`: retrieves a list of warehouses
- POST `/admin/warehouse/detail`: retrieves details of a warehouse with a given ID
- PUT `/admin/warehouse/change-status`: changes the status of a warehouse with a given ID

The USER endpoints include:
- POST `/user/get-info`: retrieves information of a user with a given ID
- POST `/user/confirm-password`: confirms the password of a user with a given ID
- PUT `/user/change-info`: changes the information of a user with a given ID
- POST `/user/order`: retrieves a list of sale orders for a user with a given ID
- POST `/user/order/detail`: retrieves details of a sale order with a given ID for a user

The OTHERS endpoints include:
- POST `/search`: searches for a string in the navbar
- POST `/cart/insert`: inserts a product into a user's cart
- POST `/cart/update`: updates a product in a user's cart
- POST `/cart/get`: retrieves a user's cart
- POST `/cart/checkout`: checks out a user's cart
- POST `/cart/payup`: pays for a user's cart.

## Configuration

The following environment variables can be used to configure the application:

- `PORT` - The port number that the server should listen on (default is 3000)
- `DATABASE_URL` - The database url to link to database
## Contributing

Contributions are welcome! To contribute, fork the repository and create a pull request.

## License

This project is licensed under the MIT License.

## Dependencies

The following dependencies are used in this project:

- express
- body-parser
- dotenv

## Dev Dependencies

The following dev dependencies are used in this project:

- nodemon

