import groupApiService from '../service/groupApiService'

const groupController = {
    readFunc: async (req, res) => {
        try {
            const response = await groupApiService.getGroupList();
            return res.status(response.status).json({
                message: response.message,
                data: response.data
            });
        } catch (error) {
            console.error('Error during reading groups:', error);
            return res.status(500).send('Internal server error');
        }
    },
};

module.exports = groupController;