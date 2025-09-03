import express from 'express';
import apiController from '../controller/apiController';
import userController from '../controller/userController';
import groupController from '../controller/groupController';
import { checkUserJWT, checkUserPermission } from '../middleware/JWTAction';

const router = express.Router();

const testMiddleware = (req, res, next) => {
    console.log('Test middleware');
    next();
}

const initApiRoutes = (app) => {
    //rest api
    router.get('/test-api', apiController.testApi);
    router.post('/register', apiController.handleRegister);
    router.post('/login', apiController.handleLogin);

    // user api
    router.get('/user/read', checkUserJWT, checkUserPermission, userController.readFunc);
    router.post('/user/create', checkUserJWT, checkUserPermission, userController.createFunc);
    router.put('/user/update/:id', checkUserJWT, checkUserPermission, userController.updateFunc);
    router.delete('/user/delete/:id', checkUserJWT, checkUserPermission, userController.deleteFunc);
    router.get('/user/:id', checkUserJWT, checkUserPermission, userController.getUserbyId);

    // group api
    router.get('/group/read', groupController.readFunc);

    return app.use('/api/v1', router);
}

export default initApiRoutes;