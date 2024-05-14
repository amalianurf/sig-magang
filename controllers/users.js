const UserModel = require('../models').User;
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.auth = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await UserModel.findOne({ where: { email } });
        if (!user) {
            return res.status(400).json({ message: 'Email atau password salah!' });
        }
    
        const isPasswordValid = bcrypt.compareSync(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: 'Email atau password salah!' });
        }

        var token = 'Bearer ' + jwt.sign({
            id: user.id
        }, process.env.JWT_KEY, {
            expiresIn: 86400
        });

        res.status(200).json({
            accessToken: token,
            message: 'Login berhasil!'
        });
    } catch (error) {
        console.error('Error logging:', error);
        res.status(500).json({ message: 'Error logging' });
    }
};