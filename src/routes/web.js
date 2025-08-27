import express from 'express';
import homeController from '../controller/homeController';
import apiController from '../controller/apiController';

const router = express.Router();

const initWebRoutes = (app) => {
    router.get('/', homeController.getHomePage);
    router.get('/user', homeController.getUserPage);
    router.post('/user/create-user', homeController.getCreateNewUser);
    router.post('/user/delete-user/:userId', homeController.getDeleteUser);
    router.post('/user/update-user-page/:userId', homeController.getUpdateUserPage);
    router.post('/user/update-user', homeController.getUpdateUser);

    //rest api
    router.get('/api/test-api', apiController.testApi);

    return app.use('/', router);
}

export default initWebRoutes;