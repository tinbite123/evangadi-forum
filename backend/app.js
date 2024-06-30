require('dotenv').config()
const express = require('express');
const app = express();

// security package middleware
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');

// authentication middleware 
const authMiddleware = require('./middleware/authMiddleware');
const notFoundMiddleware = require('./middleware/notFound');



// router middleware
const userRoute = require('./routes/userRoute');
const questionRoute = require('./routes/questionRoute');
const answerRoutes = require('./routes/answerRoute');

// security middleware
app.use(cors());
app.use(rateLimit({
    windowMs: 15 * 60 * 1000, // 5 minutes
    max: 100 // limit each IP to 100 requests per windowMs
}));
app.use(helmet());

// db connection
const dbConnection = require('./db/dbConfig');

app.use(express.json())
app.use(express.urlencoded({ extended: true }));
// routes
app.use("/api/users", userRoute);
app.use("/api/questions", authMiddleware,questionRoute);
app.use("/api/answers", authMiddleware,answerRoutes);

app.get('/', (req, res) => {
    res.status(200).sendFile(__dirname + '/index.html');
})

// error handlers
app.use(notFoundMiddleware);

const port = process.env.PORT || 4400

const start = async () => {
    try {
        await dbConnection.execute('select "connected"')
        console.log(`connect to DB`);
        app.listen(port, () => {
            console.log(`Server listening on port ${port} ...`);
        });
    } catch (error) {
        console.log(error.message);
    }
}

start()
