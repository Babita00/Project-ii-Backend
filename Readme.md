# esyGhar: Online Flat Rental App

Welcome to esyGhar, an online flat rental application built using Node.js. esyGhar aims to simplify the process of finding and renting flats by connecting renters with property owners seamlessly.

## Table of Contents

- [Features](#features)
- [Technology Stack](#technology-stack)
- [Installation](#installation)
- [Usage](#usage)
- [API Documentation](#api-documentation)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

## Features

- **User Authentication**: Secure login and registration for both renters and property owners.
- **Property Listings**: Owners can list their properties with details and images.
- **Search Functionality**: Renters can search for properties based on various criteria such as location, price, and size.
- **Booking System**: Renters can book properties and schedule visits.
- **Admin Panel**: Manage users, properties, and bookings.

## Technology Stack

- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Authentication**: JWT (JSON Web Tokens)
- **Storage**: Cloudinary for image storage
- **Payment Gateway**: Khalti,esewa,Imepay
- **Frontend**: Flutter

# Project Structure
The following is the structure of the project:
EasyGhar/
├── .vscode/
├── public/
├── src/
│   ├── controllers/
│   │   ├── addProperty.controller.js
│   │   ├── bookProperty.controller.js
│   │   ├── fetchProperty.controller.js
│   │   ├── forgotPassword.controller.js
│   │   ├── location.controller.js
│   │   ├── nearestlocationRecommendation.controller.js
│   │   ├── parseAndValidateLocation.controller.js
│   │   ├── payment.controller.js
│   │   ├── searchProperty.controller.js
│   │   ├── updateProperty.controller.js
│   │   ├── user.changePassword.js
│   │   ├── user.controller.js
│   │   ├── user.login.controller.js
│   │   └── user.logout.controller.js
│   ├── db/
│   │   └── dataBaseConnect.js
│   ├── middleware/
│   │   ├── jwtauth.middleware.js
│   │   └── multer.middleware.js
│   ├── models/
│   │   ├── Booking.models.js
│   │   ├── Property.models.js
│   │   ├── payment.models.js
│   │   └── user.models.js
│   ├── payment/
│   │   └── khalti.js
│   ├── routes/
│   │   ├── property.routes.js
│   │   └── user.router.js
│   ├── utils/
│   │   ├── apiError.js
│   │   ├── apiResponse.js
│   │   ├── asyncHandler.js
│   │   ├── cloudinary.js
│   │   └── sendEmail.js
│   ├── app.js
│   ├── constants.js
│   └── index.js
├── .gitignore
├── .prettierignore
├── .prettierrc
├── README.md
├── package-lock.json
└── package.json

## Installation

### Prerequisites

Make sure you have the following installed on your system:

- Node.js
- MongoDB

### Steps

1. **Clone the repository**

   ```bash
   git clone https://github.com/Babita00/esyGhar.git
   cd esyGhar
   ```
