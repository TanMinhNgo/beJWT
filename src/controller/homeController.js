const homeController = {
    getHomePage: (req, res) => {
        const name = "Minh Tan";
        return res.render('home.ejs', { name });
    },
    getAboutPage: (req, res) => {
        return res.render('user.ejs');
    }
}

module.exports = homeController;