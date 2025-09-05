import express from 'express';
import apiController from '../controller/apiController';
import userController from '../controller/userController';
import roleController from '../controller/roleController';
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
    router.post('/logout', apiController.handleLogout);

    // user api
    router.get('/user/read', checkUserJWT, checkUserPermission, userController.readFunc);
    router.post('/user/create', checkUserJWT, checkUserPermission, userController.createFunc);
    router.put('/user/update/:id', checkUserJWT, checkUserPermission, userController.updateFunc);
    router.delete('/user/delete/:id', checkUserJWT, checkUserPermission, userController.deleteFunc);
    router.get('/user/:id', checkUserJWT, checkUserPermission, userController.getUserbyId);

    // role api
    router.get('/role/read', roleController.readRoleFunc);
    router.post('/role/create', roleController.createRoleFunc);
    router.put('/role/update/:id', roleController.updateRoleFunc);
    router.delete('/role/delete/:id', roleController.deleteRoleFunc);
    router.get('/role/:id', roleController.getRolebyId);
    router.get('/role/by-group/:id', roleController.getRoleByGroup);
    router.post('/role/assign-to-group', roleController.assignRoleToGroup);

    // group api
    router.get('/group/read', groupController.readFunc);

    return app.use('/api/v1', router);
}

export default initApiRoutes;