import userApiService from '../service/userApiService'

const userController = {
    readFunc: async (req, res) => {
        try {
            if (req.query.page && req.query.limit) {
                const page = parseInt(req.query.page);
                const limit = parseInt(req.query.limit);
                const response = await userApiService.getUsersByPagination(page, limit);

                return res.status(response.status).json({
                    message: response.message,
                    data: response.data,
                    pagination: response.pagination
                });
            } else {
                const response = await userApiService.getAllUsers();

                return res.status(response.status).json({
                    message: response.message,
                    data: response.data
                });
            }
        } catch (error) {
            console.error('Error during reading users:', error);
            return res.status(500).send('Internal server error');
        }
    },

    getUserbyId: async (req, res) => {
        try {
            const userId = req.params.id;
            const response = await userApiService.getUserById(userId);

            return res.status(response.status).json({
                message: response.message,
                data: response.data
            });
        } catch (error) {
            console.error('Error during getting user by ID:', error);
            return res.status(500).send('Internal server error');
        }
    },

    createFunc: async (req, res) => {
        const { email, password, username } = req.body;

        await userService.createNewUser(email, password, username, res);

        return res.redirect('/user');
    },

    deleteFunc: async (req, res) => {
        const { userId } = req.params;

        await userService.deleteUser(userId, res);

        return res.redirect('/user');
    },

    updateFunc: async (req, res) => {
        const { email, username, userId } = req.body;

        await userService.updateUser(userId, email, username, res);

        return res.redirect('/user');
    }
};

module.exports = userController;