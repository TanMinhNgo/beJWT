import bcrypt from 'bcryptjs';
import db from '../models/index.js';

const salt = bcrypt.genSaltSync(10);

const hashedPassword = (userPassword) => {
    const hashedPassword = bcrypt.hashSync(userPassword, salt);
    return hashedPassword;
}

const createNewUser = async (email, password, username, gender, phone, address, res) => {
    const hashPassword = hashedPassword(password);

    // check validation input
    const checkEmail = await db.User.findOne({ where: { email: email } });
    if (checkEmail && checkEmail.email === email) {
        return res.status(400).send('Email already exists');
    }
    const checkPhone = await db.User.findOne({ where: { phone: phone } });
    if (checkPhone && checkPhone.phone === phone) {
        return res.status(400).send('Phone number already exists');
    }
    const checkPassword = password.length < 6;
    if (checkPassword) {
        return res.status(400).send('Password must be at least 6 characters');
    }
    const checkUser = await db.User.findOne({ where: { username: username } });
    if (checkUser) {
        return res.status(400).send('User already exists');
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
        return res.status(201).send('User created successfully');
    } catch (error) {
        console.error('Error inserting user:', error);
        return res.status(500).send('Error creating user');
    }
};

module.exports = {
    createNewUser
}