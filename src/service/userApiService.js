import bcrypt from 'bcryptjs';
import db from '../models/index.js';
import { Op } from 'sequelize';

const salt = bcrypt.genSaltSync(10);

const hashedPassword = (userPassword) => {
    const hashedPassword = bcrypt.hashSync(userPassword, salt);
    return hashedPassword;
}

const getAllUsers = async () => {
    try {
        const users = await db.User.findAll({
            attributes: ['id', 'email', 'username', 'phone', 'address', 'sex', 'createdAt', 'updatedAt'], include: {
                model: db.Group,
                attributes: ['id', 'name', 'description']
            },
            order: [['id', 'DESC']]
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

        return { status: 200, message: "Get all users successfully", data: data };
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
        const { count, rows } = await db.User.findAndCountAll({
            attributes: ['id', 'email', 'username', 'phone', 'address', 'sex', 'createdAt', 'updatedAt'],
            include: {
                model: db.Group,
                attributes: ['id', 'name', 'description']
            },
            order: [['id', 'DESC']],
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
                id: user.Group.id || null,
                name: user.Group.name || "Not found",
                description: user.Group.description || "Not found"
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

const createNewUser = async (email, password, username, gender, address, phone, groupId) => {
    try {
        // Check if email or phone already exists
        const checkEmail = await db.User.findOne({ where: { email: email } });
        if (checkEmail && checkEmail.email === email) {
            return { status: 400, message: 'Email already exists' };
        }
        const checkPhone = await db.User.findOne({ where: { phone: phone } });
        if (checkPhone && checkPhone.phone === phone) {
            return { status: 400, message: 'Phone number already exists' };
        }
        const checkPassword = password.length < 6;
        if (checkPassword) {
            return { status: 400, message: 'Password must be at least 6 characters' };
        }
        const checkUser = await db.User.findOne({ where: { username: username } });
        if (checkUser) {
            return { status: 400, message: 'User already exists' };
        }

        const newUser = await db.User.create({
            email: email,
            password: hashedPassword(password),
            username: username,
            sex: gender,
            address: address,
            phone: phone,
            groupId: groupId, // Default group ID
            createdAt: new Date(),
            updatedAt: new Date()
        });

        if (!newUser) {
            return { status: 400, message: "User creation failed" };
        }

        return { status: 201, message: "User created successfully" };
    } catch (error) {
        console.error('Error during creating new user:', error);
        return { status: 500, message: 'Internal server error' };
    }
};

const updateUser = async (id, email, username, gender, address, phone, groupId) => {
    try {
        const checkEmail = await db.User.findOne({ where: { email: email, id: { [Op.ne]: id } } });
        if (checkEmail && checkEmail.email === email) {
            return { status: 400, message: 'Email already exists' };
        }
        const checkPhone = await db.User.findOne({ where: { phone: phone, id: { [Op.ne]: id } } });
        if (checkPhone && checkPhone.phone === phone) {
            return { status: 400, message: 'Phone number already exists' };
        }
        const checkUser = await db.User.findOne({ where: { username: username, id: { [Op.ne]: id } } });
        if (checkUser) {
            return { status: 400, message: 'User already exists' };
        }

        const [updated] = await db.User.update(
            { email: email, username: username, sex: gender, address: address, phone: phone, groupId: groupId, updatedAt: new Date() },
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
