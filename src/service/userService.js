import mysql from 'mysql2/promise';
import bcrypt from 'bcryptjs';
import Bluebird from 'bluebird';

const salt = bcrypt.genSaltSync(10);



const hashedPassword = (userPassword) => {
    const hashedPassword = bcrypt.hashSync(userPassword, salt);
    return hashedPassword;
}

const createNewUser = async (email, password, username, res) => {
    const hashPassword = hashedPassword(password);
    const connection = await mysql.createConnection({
        host: 'localhost',
        port: 3306,
        user: 'root',
        password: '123456',
        database: 'jwt',
        Promise: Bluebird
    });

    try {
        await connection.execute('INSERT INTO users (email, password, username) VALUES (?, ?, ?)', [email, hashPassword, username]);
    } catch (error) {
        console.error('Error inserting user:', error);
        return res.status(500).send('Error creating user');
    }
};


const getUserList = async () => {
    const connection = await mysql.createConnection({
        host: 'localhost',
        port: 3306,
        user: 'root',
        password: '123456',
        database: 'jwt',
        Promise: Bluebird
    });

    try {
        const [users] = await connection.execute('SELECT * FROM users');
        return users;
    } catch (error) {
        console.error('Error fetching user list:', error);
        throw error;
    }
};

const deleteUser = async (userId, res) => {
    const connection = await mysql.createConnection({
        host: 'localhost',
        port: 3306,
        user: 'root',
        password: '123456',
        database: 'jwt',
        Promise: Bluebird
    });

    try {
        await connection.execute('DELETE FROM users WHERE id = ?', [userId]);
    } catch (error) {
        console.error('Error deleting user:', error);
        return res.status(500).send('Error deleting user');
    }
};

const getUserById = async (userId, res) => {
    const connection = await mysql.createConnection({
        host: 'localhost',
        port: 3306,
        user: 'root',
        password: '123456',
        database: 'jwt',
        Promise: Bluebird
    });

    try {
        const [user] = await connection.execute('SELECT * FROM users WHERE id = ?', [userId]);
        return user;
    } catch (error) {
        console.error('Error fetching user by ID:', error);
        return res.status(500).send('Error fetching user');
    }
};

const updateUser = async (userId, email, username, res) => {
    const connection = await mysql.createConnection({
        host: 'localhost',
        port: 3306,
        user: 'root',
        password: '123456',
        database: 'jwt',
        Promise: Bluebird
    });

    try {
        await connection.execute('UPDATE users SET email = ?, username = ? WHERE id = ?', [email, username, userId]);
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