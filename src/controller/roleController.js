import roleApiService from '../service/roleApiService.js';

const roleController = {
    readRoleFunc: async (req, res) => {
        try {
            if (!req.query.page || !req.query.limit) {
                const response = await roleApiService.getAllRoles();

                if (!response) {
                    return res.status(404).json({ message: 'Roles not found', data: null });
                }

                return res.status(response.status).json({
                    message: response.message,
                    data: response.data
                });
            } else {
                const page = parseInt(req.query.page);
                const limit = parseInt(req.query.limit);
                const response = await roleApiService.getRolesByPagination(page, limit);

                if (!response) {
                    return res.status(404).json({ message: 'Roles not found', data: null });
                }

                return res.status(response.status).json({
                    message: response.message,
                    data: response.data,
                    pagination: response.pagination
                });
            }
        } catch (error) {
            console.error('Error in readRoleFunc:', error);
            return res.status(500).json({ message: 'Internal server error', data: null });
        }
    },

    getRolebyId: async (req, res) => {
        try {
            const roleId = req.params.id;
            const response = await roleApiService.getRoleById(roleId);

            if (!response) {
                return res.status(404).json({ message: 'Role not found', data: null });
            }

            return res.status(response.status).json({
                message: response.message,
                data: response.data
            });
        } catch (error) {
            console.error('Error in getRolebyId:', error);
            return res.status(500).json({ message: 'Internal server error', data: null });
        }
    },

    createRoleFunc: async (req, res) => {
        try {
            const { data } = req.body;
            if (!data) {
                return res.status(400).json({ message: 'Missing required fields: url and description' });
            }
            const response = await roleApiService.createNewRoles(data);
            return res.status(response.status).json({
                message: response.message
            });
        } catch (error) {
            console.error('Error in createRoleFunc:', error);
            return res.status(500).json({ message: 'Internal server error' });
        }
    },

    updateRoleFunc: async (req, res) => {
        try {
            const roleId = req.params.id;
            const { url, description } = req.body;
            if (!url || !description) {
                return res.status(400).json({ message: 'Missing required fields: url and description' });
            }
            const response = await roleApiService.updateRole(roleId, url, description);
            return res.status(response.status).json({
                message: response.message
            });
        } catch (error) {
            console.error('Error in updateRoleFunc:', error);
            return res.status(500).json({ message: 'Internal server error' });
        }
    },

    deleteRoleFunc: async (req, res) => {
        try {
            const roleId = req.params.id;
            const response = await roleApiService.deleteRole(roleId);
            return res.status(response.status).json({
                message: response.message
            });
        } catch (error) {
            console.error('Error in deleteRoleFunc:', error);
            return res.status(500).json({ message: 'Internal server error' });
        }
    },

    getRoleByGroup: async (req, res) => {
        try {
            const groupId = req.params.id;
            const response = await roleApiService.getRoleByGroupId(groupId);

            if (!response) {
                return res.status(404).json({ message: 'Roles not found for this group', data: null });
            }

            return res.status(response.status).json({
                message: response.message,
                data: response.data
            });
        } catch (error) {
            console.error('Error in getRoleByGroup:', error);
            return res.status(500).json({ message: 'Internal server error', data: null });
        }
    },

    assignRoleToGroup: async (req, res) => {
        try {
            const { data } = req.body;
            const response = await roleApiService.assignRoleToGroup(data);
            return res.status(response.status).json({
                message: response.message
            });
        } catch (error) {
            console.error('Error in assignRoleToGroup:', error);
            return res.status(500).json({ message: 'Internal server error' });
        }
    }

};


module.exports = roleController;