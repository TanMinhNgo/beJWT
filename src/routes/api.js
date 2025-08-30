import express from 'express';
import apiController from '../controller/apiController';
import userController from '../controller/userController';

const router = express.Router();

const initApiRoutes = (app) => {
    //rest api
    router.get('/test-api', apiController.testApi);
    router.post('/register', apiController.handleRegister);
    router.post('/login', apiController.handleLogin);

    // user api
    router.get('/user/read', userController.readFunc);
    router.post('/user/create', userController.createFunc);
    router.put('/user/update/:id', userController.updateFunc);
    router.delete('/user/delete/:id', userController.deleteFunc);
    router.get('/user/:id', userController.getUserbyId);

    return app.use('/api/v1', router);
}

export default initApiRoutes;