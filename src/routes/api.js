import express from 'express';
import apiController from '../controller/apiController';

const router = express.Router();

const initApiRoutes = (app) => {

    // User routes
    // router.get('/', homeController.getHomePage);
    // router.get('/user', homeController.getUserPage);
    // router.post('/user/create-user', homeController.getCreateNewUser);
    // router.post('/user/delete-user/:userId', homeController.getDeleteUser);
    // router.post('/user/update-user-page/:userId', homeController.getUpdateUserPage);
    // router.post('/user/update-user', homeController.getUpdateUser);

    //rest api
    router.get('/test-api', apiController.testApi);
    router.post('/register', apiController.handleRegister);

    return app.use('/api/v1', router);
}

export default initApiRoutes;