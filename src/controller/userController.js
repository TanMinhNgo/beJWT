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
        try {
            const { email, password, username, phone, address, gender, groupId } = req.body;

            const response = await userApiService.createNewUser(email, password, username, gender, address, phone, groupId);

            return res.status(response.status).json({
                message: response.message
            });

        } catch (error) {
            console.error('Error during deleting user:', error);
            return res.status(500).send('Internal server error');
        }
    },

    deleteFunc: async (req, res) => {
        try {
            const { id } = req.params;

            const response = await userApiService.deleteUser(id);

            return res.status(response.status).json({
                message: response.message
            });

        } catch (error) {
            console.error('Error during deleting user:', error);
            return res.status(500).send('Internal server error');
        }
    },

    updateFunc: async (req, res) => {
        try {
            const { id } = req.params;
            const { email, username, phone, address, gender, groupId } = req.body;

            const response = await userApiService.updateUser(id, email, username, gender, address, phone, groupId);

            return res.status(response.status).json({
                message: response.message
            });

        } catch (error) {
            console.error('Error during updating user:', error);
            return res.status(500).send('Internal server error');
        }
    }
};

module.exports = userController;