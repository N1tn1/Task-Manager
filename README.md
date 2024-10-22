# Task Manager

Welcome to the Task Manager! This application helps you manage your tasks efficiently with a clean and user-friendly interface.

## Features

- **Add Tasks**: Easily add new tasks to your todo list.
- **Remove Tasks**: Remove tasks when they're no longer needed.
- **Toggle Completion**: Mark tasks as completed to keep track of your progress.
- **Dynamic Sorting**: Automatically sorts tasks by creation time.
- **Responsive Design**: The app is designed to be mobile-friendly and adapts to different screen sizes.

## Technologies Used

- **FrontEnd**: React (Vite)
- **BackEnd**: Node.js with Express
- **Routing**: React Router for navigation between pages
- **Styling**: CSS
- **Database**: MongoDB

## Getting Started

### Prerequisites

- Node.js installed on your machine.
- MongoDB (local or cloud instance)
- Git (optional, for cloning the repository)
### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/username/reponame.git

2. Navigate to the project directory

   `cd task-manager`

3. Install the backend dependencies:
   
   `cd backend`
   `npm install`

4. Set up environment variables: Create a .env file in the backend directory and add your environment variables:

   - JWT_SECRET=your_jwt_secret
   - MONGODB_URI=your_mongodb_connection_string

6. Run the backend server:

   `node index.js`

7. Install the frontend dependencies: Open a new terminal, navigate to the frontend directory, and run:

   `cd frontend`
   `npm install`

8. Run the frontend application:

   `npm run dev`

## Usage

- Open your browser and navigate to http://localhost:5173
- You can register a new user or sign in with existing credentials to start using the app.

## TroubleShooting
- If you encounter any issues, make sure all dependencies are installed correctly and that your MongoDB server is running.
- Check the console for error messages for more details.

## Contributing

 Contributions are welcome! If you'd like to contribute to the project, please follow these steps:

1. Fork the repository.
2. Create a new branch `git checkout -b feature/new-feature`
3. Make your changes.
4. Commit your changes `git commit -m 'Add new feature`
5. Push to the branch `git push origin feature/new-feature`
6. Create a new Pull Request.

## License

   This project is licensed under the [MIT License](https://opensource.org/licenses/MIT). See the LICENSE file for details.

## Acknowledgments

- Inspired by various task management applications.