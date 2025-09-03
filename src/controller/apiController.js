import loginRegisterService from '../service/loginRegisterService';

const apiController = {
    testApi: (req, res) => {
        return res.status(200).json({
            message: "Hello from test API"
        });
    },

    handleRegister: async (req, res) => {
        try {
            const { email, password, username, gender, phone, address } = req.body;
            if (!email || !password || !username || !gender || !phone || !address) {
                return res.status(400).json({
                    message: "All fields are required"
                });
            }

            const response = await loginRegisterService.createNewUser(email, password, username, gender, phone, address);

            return res.status(response.status).json({
                message: response.message
            });
        } catch (err) {
            console.error("Error occurred during registration:", err);
            return res.status(500).json({
                message: "Internal server error"
            });
        }
    },

    handleLogin: async (req, res) => {
        try {
            const emailOrPhone = req.body.email || req.body.phone;
            const password = req.body.password;
            if (!emailOrPhone || !password) {
                return res.status(400).json({
                    message: "Email/Phone and password are required"
                });
            }
            
            const response = await loginRegisterService.handleUserLogin(emailOrPhone, password);

            if (response.data?.accessToken) {
                res.cookie("jwt", response.data.accessToken, {
                    httpOnly: true,
                    maxAge: 60 * 60 * 1000 // 1 hour
                });
            }

            return res.status(response.status).json({
                message: response.message,
                data: response.data
            });
        } catch (err) {
            console.error("Error occurred during login:", err);
            return res.status(500).json({
                message: "Internal server error"
            });
        }
    }
}

module.exports = apiController;
