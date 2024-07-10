# ECommerceAPI

The ECommerceAPI offers a comprehensive set of features for managing users and products, handling carts and orders, and enabling search functionalities.

Install the dependencies:
express 
mongoose 
dotenv 
cors 
bcrypt 
jsonwebtoken

npm install express mongoose dotenv cors bcrypt jsonwebtoken




Configure environment variables in a .env file:
PORT=4000
MONGODB_STRING="mongodb+srv://[user]@cluster0.bx1hmxp.mongodb.net/ECommerceAPI?retryWrites=true&w=majority&appName=Cluster0"
JWT_SECRET_KEY="ECommerceAPI"


## Features

--USER RESOURCES--

User Registration
User Authentication
Set user as admin (Admin only)
Retrieve User Details
Update Password


--PRODUCT RESOURCES--

Create Product(Admin only)
Retrieve all products (Admin only)
Retrieve all active products
Retrieve single product
Update Product information (Admin only)
Archive Product (Admin only)
Activate Product (Admin only)


--CART RESOURCES--

Get User's Cart
Add to Cart
 -Subtotal for each item
 -Total price for all items
Change product quantities
Remove a product from cart
Clear Cart


--ORDER RESOURCES--

Non-admin User checkout (Create Order)
Retrieve authenticated user's orders
Retrieve all orders (Admin only)



## Search Functionalities

Add search for products by their names
Add search for products by price range


