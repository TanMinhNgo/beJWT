import db from "../models/index.js";

const getAllUsers = async () => {
    try {
        const users = await db.User.findAll({
            attributes: ['id', 'email', 'username', 'phone', 'address', 'sex', 'createdAt', 'updatedAt'], include: {
                model: db.Group,
                attributes: ['id', 'name', 'description']
            }
        });
        if (!users) {
            return { status: 404, message: "No users found", data: [] };
        }

        const data = users.map(user => ({
            id: user.id,
            email: user.email,
            username: user.username,
            phone: user.phone,
            address: user.address,
            gender: user.sex,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
            group: {
                id: user.Group.id,
                name: user.Group.name,
                description: user.Group.description
            }
        }));

        return {status: 200, message: "Get all users successfully", data: data};
    } catch (error) {
        console.error('Error during getting all users:', error);
        return { status: 500, message: 'Internal server error', data: null };
    }
};

const getUserById = async (userId) => {
    try {
        const user = await db.User.findByPk(userId, {
            attributes: ['id', 'email', 'username', 'phone', 'address', 'sex', 'createdAt', 'updatedAt'], include: {
                model: db.Group,
                attributes: ['id', 'name', 'description']
            }
        });
        if (!user) {
            return { status: 404, message: "User not found", data: null };
        }

        const data = {
            id: user.id,
            email: user.email,
            username: user.username,
            phone: user.phone,
            address: user.address,
            gender: user.sex,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
            group: {
                id: user.Group.id,
                name: user.Group.name,
                description: user.Group.description
            }
        };

        return { status: 200, message: "Get user successfully", data: data };
    } catch (error) {
        console.error('Error during getting user by ID:', error);
        return { status: 500, message: 'Internal server error', data: null };
    }
};

const getUsersByPagination = async (page, limit) => {
    try {
        const {count, rows} = await db.User.findAndCountAll({
            attributes: ['id', 'email', 'username', 'phone', 'address', 'sex', 'createdAt', 'updatedAt'],
            include: {
                model: db.Group,
                attributes: ['id', 'name', 'description']
            },
            limit: limit,
            offset: (page - 1) * limit
        });

        if (!rows) {
            return { status: 404, message: "No users found", data: [] };
        }

        const data = rows.map(user => ({
            id: user.id,
            email: user.email,
            username: user.username,
            phone: user.phone,
            address: user.address,
            gender: user.sex,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
            group: {
                id: user.Group.id,
                name: user.Group.name,
                description: user.Group.description
            },
        }));

        const paginationInfo = {
            totalPages: Math.ceil(count / limit),
            totalRows: count
        };

        return {
            status: 200,
            message: "Get users by pagination successfully",
            data: data,
            pagination: paginationInfo
        };
    } catch (error) {
        console.error('Error during getting users by pagination:', error);
        return { status: 500, message: 'Internal server error', data: null };
    }
};

const createNewUser = async (email, password, username, gender, address, phone) => {
    try {
        const newUser = await db.User.create({
            email: email,
            password: password,
            username: username,
            sex: gender,
            address: address,
            phone: phone,
            createdAt: new Date(),
            updatedAt: new Date()
        });

        if (!newUser) {
            return { status: 400, message: "User creation failed" };
        }

        return { status: 201, message: "User created successfully" };
    } catch (error) {
        console.error('Error during creating new user:', error);
        return { status: 500, message: 'Internal server error'};
    }
};

const updateUser = async (id, email, username, gender, address, phone) => {
    try {
        const [updated] = await db.User.update(
            { email: email, username: username, sex: gender, address: address, phone: phone, updatedAt: new Date() },
            { where: { id } }
        );
        if (!updated) {
            return { status: 404, message: "User not found" };
        }

        return { status: 200, message: "User updated successfully" };
    } catch (error) {
        console.error('Error during updating user:', error);
        return { status: 500, message: 'Internal server error' };
    }
};

const deleteUser = async (id) => {
    try {
        const deleted = await db.User.destroy({ where: { id } });
        if (!deleted) {
            return { status: 404, message: "User not found" };
        }

        return { status: 200, message: "User deleted successfully" };
    } catch (error) {
        console.error('Error during deleting user:', error);
        return { status: 500, message: 'Internal server error' };
    }
}

module.exports = {
    getAllUsers,
    getUserById,
    getUsersByPagination,
    createNewUser,
    updateUser,
    deleteUser
};
