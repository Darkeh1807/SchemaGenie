# SchemaGenie Frontend

SchemaGenie is a web application that helps users design and generate database schemas using AI.

Test App Here: https://schemagenie.vercel.app/

## Features

- Interactive AI-powered database schema generation
- Supports NoSQL schema structures
- User-friendly interface for schema visualization
- Real-time chat-based schema design
- Project-based schema management

## Tech Stack

- **Framework:** React.js (Vite)
- **State Management:** Zustand
- **UI Library:** Tailwind CSS
- **Networking:** Axios
- **Routing:** React Router

## Installation

```sh
# Clone the repository
git clone https://github.com/Darkeh1807/SchemaGenie.git

# Navigate to the project directory
cd SchemaGenie

# Install dependencies
npm install

# Start the development server
npm run dev
```

## Running in Production

```sh
npm run build
npm run preview
```

## API Integration

The frontend interacts with the SchemaGenie backend through the following endpoints:

- `GET /api/chats/:projectId` - Fetches chat history and schema data
- `POST /api/chats` - Sends user input and retrieves AI-generated schema

## Contributing

1. Fork the repository
2. Create a new branch (`feature-name`)
3. Commit your changes
4. Push to the branch and open a PR

## License



