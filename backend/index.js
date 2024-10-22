
const seedPriorities = require('./seeder/seedPriorities');require('dotenv').config();
const cors = require('cors')

// Swagger
const swaggerUI = require('swagger-ui-express')
const YAML = require('yamljs')
const swaggerDocument = YAML.load('./swagger.yaml')

const express = require('express');
const app = express();

//connectDB
const connectDB = require('./db/connect')

//routes
const authRoutes = require('./routes/auth');
const todosRoutes = require('./routes/todos');
const prioritiesRoutes = require('./routes/priorities');

//errorhandler
const errorHandler = require('./middlewares/errorHandler');

app.use(express.json())

app.use(cors())

app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocument))

app.use('/api/auth', authRoutes);
app.use('/api/todos', todosRoutes);
app.use('/api/priorities', prioritiesRoutes);

// Error handling middleware
app.use(errorHandler);

// Environment variable check
const checkEnvVariables = () => {
    if (!process.env.MONGO_URI) {
        throw new Error('MONGO_URI is not set');
    }
};

const PORT = process.env.PORT || 3000;

const start = async () => {
    try {
        checkEnvVariables();
        await connectDB(process.env.MONGO_URI);
        await seedPriorities();
        console.log('Database connected and seeded!');
        
        app.listen(PORT, () =>
            console.log(`Server is listening on port ${PORT}...`)
        );
    } catch (error) {
        console.log(error);
    }
};

start();