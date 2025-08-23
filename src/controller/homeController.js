import mysql from 'mysql2';

const connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: '123456',
    database: 'jwt'
})

const homeController = {
    getHomePage: (req, res) => {
        const name = "Minh Tan";
        return res.render('home.ejs', { name });
    },

    getUserPage: (req, res) => {
        return res.render('user.ejs');
    },

    createNewUser: (req, res) => {
        const { email, password, username } = req.body;

        connection.query('INSERT INTO users (email, password, username) VALUES (?, ?, ?)', [email, password, username], (error, results) => {
            if (error) {
                console.error('Error inserting user:', error);
                return res.status(500).send('Error creating user');
            }

            return res.redirect('/user');
        });
    }

}

module.exports = homeController;