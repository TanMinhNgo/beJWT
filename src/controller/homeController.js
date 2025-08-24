import userService from '../service/userService';

const homeController = {
    getHomePage: (req, res) => {
        const name = "Minh Tan";
        return res.render('home.ejs', { name });
    },
    
    getUserPage: async (req, res) => {
        const userList = await userService.getUserList();
        
        return res.render('user.ejs', { userList });
    },
    
    getUpdateUserPage: async (req, res) => {
        const { userId } = req.params;

        const user = await userService.getUserById(userId, res);
        let userData;
        if (user && user.length > 0) {
            userData = user[0];
        }
        return res.render('user-update.ejs', { user: userData });
    },

    getCreateNewUser: async (req, res) => {
        const { email, password, username } = req.body;

        await userService.createNewUser(email, password, username, res);

        return res.redirect('/user');
    },

    getDeleteUser: async (req, res) => {
        const { userId } = req.params;

        await userService.deleteUser(userId, res);

        return res.redirect('/user');
    },

    getUpdateUser: async (req, res) => {
        const { email, username, userId } = req.body;

        await userService.updateUser(userId, email, username, res);
        return res.redirect('/user');
    }
};

module.exports = homeController;