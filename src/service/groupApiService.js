import db from '../models/index.js';

const getGroupList = async () => {
    try {
        const groups = await db.Group.findAll();
        if (!groups) {
            return { status: 404, message: 'No groups found', data: null };
        }
        
        return { status: 200, message: 'Successfully fetched group list', data: groups };
    } catch (error) {
        console.error('Error during getting group list:', error);
        return { status: 500, message: 'Internal server error', data: null };
    }
};

module.exports = {
    getGroupList
};