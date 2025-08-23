import express from 'express';
import homeController from '../controller/homeController';

const router = express.Router();

const initWebRoutes = (app) => {
    router.get('/', homeController.getHomePage);
    router.get('/user', homeController.getUserPage);
    router.post('/user/create-user', homeController.createNewUser);

    return app.use('/', router);
}

export default initWebRoutes;