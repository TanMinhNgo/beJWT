import bcrypt from 'bcryptjs';
import db from '../models/index.js';
import { Op } from 'sequelize';

const salt = bcrypt.genSaltSync(10);

const hashedPassword = (userPassword) => {
    const hashedPassword = bcrypt.hashSync(userPassword, salt);
    return hashedPassword;
}

const checkPassword = (inputPassword, hashPassword) => {
    return bcrypt.compareSync(inputPassword, hashPassword); // true or false
}

const createNewUser = async (email, password, username, gender, phone, address) => {
    const hashPassword = hashedPassword(password);

    // check validation input
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

    // Create new user
    try {
        await db.User.create({
            email: email,
            password: hashPassword,
            username: username,
            sex: gender,
            phone: phone,
            address: address,
            groupId: 1, // Default group ID
            createdAt: new Date(),
            updatedAt: new Date()
        });
        return { status: 201, message: 'User created successfully' };
    } catch (error) {
        console.error('Error inserting user:', error);
        return { status: 500, message: 'Internal server error' };
    }
};

const handleUserLogin = async (emailOrPhone, password) => {
    try {
        const user = await db.User.findOne({
            where: {
                [Op.or]: [
                    { email: emailOrPhone },
                    { phone: emailOrPhone }
                ]
            }
        });

        if (user) {
            const isValidPassword = checkPassword(password, user.password);
            if (isValidPassword) {
                const data = {
                    user: await db.User.findByPk(user.id, {
                        attributes: ['id', 'email', 'username', 'phone', 'address', 'sex', 'createdAt', 'updatedAt'], include: {
                            model: db.Group,
                            attributes: ['id', 'name', 'description']
                        }
                    }),
                    // accessToken: generateAccessToken(user)
                }
                return { status: 200, message: 'Login successful', data: data };
            }
        }

        return { status: 400, message: 'Email/Phone or password is incorrect' };
    } catch (error) {
        console.error('Error during login:', error);
        return { status: 500, message: 'Internal server error' };
    }
};

module.exports = {
    createNewUser,
    handleUserLogin
}