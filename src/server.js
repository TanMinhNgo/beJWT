import express from 'express';
require('dotenv').config();
import bodyParser from 'body-parser';

import configViewEngine from './config/viewEngine';
import initWebRoutes from './routes/web';
import connection from './config/connectDB';

const app = express();
const PORT = process.env.PORT || 8080;

// Add headers before the routes are defined
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", process.env.REACT_URL); // update to match the domain you will make the request from

    res.setHeader("Access-Control-Allow-Headers", "X-Requested-With, Content-Type");

    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");

    res.setHeader("Access-Control-Allow-Credentials", "true");

    next();
});

// Config view engine
configViewEngine(app);

// config body-parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

//test connection DB
connection();

// Init web routes
initWebRoutes(app);

app.listen(PORT, () => {
    console.log(`Server Backend is running on http://localhost:${PORT}`);
});