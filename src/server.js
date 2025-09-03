import express from 'express';
require('dotenv').config();
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';

import configViewEngine from './config/viewEngine';
import initApiRoutes from './routes/api';
import initWebRoutes from './routes/web';
import connection from './config/connectDB';
import configCors from './config/cors';

const app = express();
const PORT = process.env.PORT || 8080;

// Add headers before the routes are defined
configCors(app);

// Config view engine
configViewEngine(app);

// config body-parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// config cookie-parser
app.use(cookieParser());

//test connection DB
connection();

// Init api, web routes
initApiRoutes(app);
initWebRoutes(app);

app.use((req, res) => {
    res.status(404).send('404 Not Found');
});
app.listen(PORT, () => {
    console.log(`Server Backend is running on http://localhost:${PORT}`);
});