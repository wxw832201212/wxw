
# Contact Management System

## Overview
The Contact Management System is a web-based app for efficient contact management. It enables adding, editing, searching, and deleting contact info in an organized way. It's a single-page application with a backend API, offering a user-friendly interface and reliable data handling.

## Features
- **Add Contact**: Add new contacts with name, phone number, email.
- **Edit Contact**: Easily update existing contact details.
- **Search Contacts**: Search by name to find specific records.
- **Delete Contact**: Remove unwanted contacts.
- **Special Interest**: Option to mark contacts with special interest.

## Project Structure
- **Frontend**: Built with HTML, CSS, JavaScript for the user interface.
- **Backend**: A RESTful API using Express.js to handle requests and route data.
- **Database**: MySQL for secure data storage.

## Technologies Used
- **Frontend**: HTML, CSS, JavaScript.
- **Backend**: Node.js, Express.js.
- **Database**: MySQL.
- **Other Tools**: Axios, CORS.

## Setup Instructions

### Prerequisites
- Node.js and npm installed.
- MySQL installed and running.

### Database Setup
1. Create a MySQL database named `contacts_app`.
2. Create a `contacts` table in it with the provided SQL command.
3. Update database connection settings in `server.js`.

### Installing Dependencies
1. Clone the repository.
2. Navigate to the project directory.
3. Install backend dependencies.

### Running the Application
1. Start the backend server.
2. Open `index.html` in the browser.

### API Endpoints
- **GET /api/contacts**: Get all contacts.
- **POST /api/contacts**: Add a new contact.
- **PUT /api/contacts/:id**: Update a contact by ID.
- **DELETE /api/contacts/:id**: Delete a contact by ID.
- **GET /api/contacts/search?name=**: Search contacts by name.

### Frontend Usage
1. Add Contact: Fill form and click "Add Contact".
2. Edit Contact: Click "Edit" button, modify and save.
3. Search Contact: Use the search bar.
4. Delete Contact: Click "Delete" next to a contact.

## Testing and Debugging
- Frontend: Check form validation and search functionality.
- Backend: Ensure API endpoints return correct responses.
- Debugging: Use console logs and error messages.

## Future Improvements
- User Authentication.
- Pagination and Filters.
- Cloud Deployment.



