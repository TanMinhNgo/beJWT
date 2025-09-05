import db from '../models/index.js';

const getAllRoles = async () => {
    try {
        const roles = await db.Role.findAll({
            attributes: ['id', 'url', 'description', 'createdAt', 'updatedAt'],
            order: [['id', 'DESC']]
        });
        if (!roles) {
            return { status: 404, message: "No roles found", data: [] };
        }

        const data = roles.map(role => ({
            id: role.id,
            url: role.url,
            description: role.description,
            createdAt: role.createdAt,
            updatedAt: role.updatedAt
        }));

        return { status: 200, message: "Get all roles successfully", data: data };
    } catch (error) {
        console.error('Error during getting all roles:', error);
        return { status: 500, message: 'Internal server error', data: null };
    }
};

const getRoleById = async (roleId) => {
    try {
        const role = await db.Role.findByPk(roleId, {
            attributes: ['id', 'url', 'description', 'createdAt', 'updatedAt']
        });
        if (!role) {
            return { status: 404, message: "Role not found", data: null };
        }

        return { status: 200, message: "Get role successfully", data: role };
    } catch (error) {
        console.error('Error during getting role by ID:', error);
        return { status: 500, message: 'Internal server error', data: null };
    }
};

const getRolesByPagination = async (page, limit) => {
    try {
        const { count, rows } = await db.Role.findAndCountAll({
            attributes: ['id', 'url', 'description', 'createdAt', 'updatedAt'],
            order: [['id', 'DESC']],
            limit: limit,
            offset: (page - 1) * limit
        });

        if (!rows) {
            return { status: 404, message: "No users found", data: [] };
        }

        const data = rows.map(role => ({
            id: role.id,
            url: role.url,
            description: role.description,
            createdAt: role.createdAt,
            updatedAt: role.updatedAt
        }));

        const paginationInfo = {
            totalPages: Math.ceil(count / limit),
            totalRows: count
        };

        return {
            status: 200,
            message: "Get roles by pagination successfully",
            data: data,
            pagination: paginationInfo
        };
    } catch (error) {
        console.error('Error during getting roles by pagination:', error);
        return { status: 500, message: 'Internal server error', data: null };
    }
};

const createNewRoles = async (data) => {
    try {
        let currentRoles = await db.Role.findAll({
            attributes: ['url', 'description']
        });

        const results = data.filter(({ url: url1 }) => !currentRoles.some(({ url: url2 }) => url2 === url1));

        if (results.length === 0) {
            return { status: 400, message: 'All roles already exist' };
        }

        const response = await db.Role.bulkCreate(results);

        if (!response) {
            return { status: 400, message: 'Failed to create new roles' };
        }

        return { status: 201, message: `${results.length} roles created successfully` };

    } catch (error) {
        console.error('Error during creating new roles:', error);
        return { status: 500, message: 'Internal server error' };
    }
};

const updateRole = async (id, url, description) => {
    try {
        const [updated] = await db.Role.update(
            { url: url, description: description, updatedAt: new Date() },
            { where: { id } }
        );
        if (!updated) {
            return { status: 404, message: "Role not found" };
        }

        return { status: 200, message: "Role updated successfully" };
    } catch (error) {
        console.error('Error during updating role:', error);
        return { status: 500, message: 'Internal server error' };
    }
};

const deleteRole = async (id) => {
    try {
        const deleted = await db.Role.destroy({ where: { id } });
        if (!deleted) {
            return { status: 404, message: "Role not found" };
        }

        return { status: 200, message: "Role deleted successfully" };
    } catch (error) {
        console.error('Error during deleting role:', error);
        return { status: 500, message: 'Internal server error' };
    }
};

const getRoleByGroupId = async (groupId) => {
    try {
        const response = await db.Group.findByPk(groupId, {
            where: { id: groupId },
            attributes: ['id', 'name', 'description'],
            include: [
                {
                    model: db.Role, attributes: ['id', 'url', 'description'], through: { attributes: [] }
                }
            ]
        });

        if (!response) {
            return { status: 404, message: 'Group not found', data: null };
        }

        return { status: 200, message: 'Get roles by group successfully', data: response };
    } catch (error) {
        console.error('Error during getting roles by group:', error);
        return { status: 500, message: 'Internal server error', data: null };
    }
};

const assignRoleToGroup = async (data) => {
    try {
        const deleteRoleByGroupId = await db.Group_Role.destroy({ where: { groupId: data.groupId } });

        if (deleteRoleByGroupId === null) {
            return { status: 400, message: 'Failed to clear existing roles for the group' };
        }

        const response = await db.Group_Role.bulkCreate(data.groupRoles);
        if (!response) {
            return { status: 400, message: 'Failed to assign roles to group' };
        }
        return { status: 200, message: 'Roles assigned to group successfully' };
    } catch (error) {
        console.error('Error during assigning roles to group:', error);
        return { status: 500, message: 'Internal server error' };
    }
};

module.exports = {
    getAllRoles,
    getRoleById,
    getRolesByPagination,
    createNewRoles,
    updateRole,
    deleteRole,
    getRoleByGroupId,
    assignRoleToGroup
};