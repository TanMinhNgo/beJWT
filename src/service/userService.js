import bcrypt from 'bcryptjs';
import db from '../models/index.js';

const salt = bcrypt.genSaltSync(10);

const hashedPassword = (userPassword) => {
    const hashedPassword = bcrypt.hashSync(userPassword, salt);
    return hashedPassword;
}

const createNewUser = async (email, password, username, res) => {
    const hashPassword = hashedPassword(password);

    try {
        await db.User.create({
            email: email,
            password: hashPassword,
            username: username,
            createdAt: new Date(),
            updatedAt: new Date()
        });
    } catch (error) {
        console.error('Error inserting user:', error);
        return res.status(500).send('Error creating user');
    }
};


const getUserList = async () => {
    try {
        const users = await db.User.findAll({
            include: [
                {
                    model: db.Group
                }
            ],
            raw: true,
            nest: true
        });
        return users;
    } catch (error) {
        console.error('Error fetching user list:', error);
        throw error;
    }
};

const deleteUser = async (userId, res) => {
    try {
        await db.User.destroy({
            where: { id: userId }
        });
    } catch (error) {
        console.error('Error deleting user:', error);
        return res.status(500).send('Error deleting user');
    }
};

const getUserById = async (userId, res) => {
    try {
        const user = await db.User.findOne({
            where: { id: userId }
        });
        return user;
    } catch (error) {
        console.error('Error fetching user by ID:', error);
        return res.status(500).send('Error fetching user');
    }
};

const updateUser = async (userId, email, username, res) => {
    try {
        await db.User.update(
            { email: email, username: username, updatedAt: new Date() },
            { where: { id: userId } }
        );
    } catch (error) {
        console.error('Error updating user:', error);
        return res.status(500).send('Error updating user');
    }
};

module.exports = {
    createNewUser,
    getUserList,
    deleteUser,
    getUserById,
    updateUser
}