import express from 'express';
require('dotenv').config();

import configViewEngine from './configs/viewEngine';
import initWebRoutes from './routes/web';

const app = express();
const PORT = process.env.PORT || 8080;

// Config view engine
configViewEngine(app);

// Init web routes
initWebRoutes(app);

app.listen(PORT, () => {
    console.log(`Server Backend is running on http://localhost:${PORT}`);
});