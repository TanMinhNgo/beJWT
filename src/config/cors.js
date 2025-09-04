require('dotenv').config();

const configCors = (app) => {
    app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", process.env.REACT_URL); // update to match the domain you will make the request from

    res.setHeader("Access-Control-Allow-Headers", "Authorization, X-Requested-With, Content-Type");

    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");

    res.setHeader("Access-Control-Allow-Credentials", "true");

    if(req.method === "OPTIONS") {
        return res.sendStatus(200);
    }

    next();
});
}

export default configCors;