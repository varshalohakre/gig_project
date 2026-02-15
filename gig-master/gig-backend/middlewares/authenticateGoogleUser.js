import jwt from 'jsonwebtoken'
import User from '../Model/userSchema.js'

const authenticateUser = async (req, res, next) => {
    let idToken = req.cookies['login'];

    try {
        const decodedMessage = jwt.verify(idToken, "thisisthesecretkey");
        await User.findOne({
            email: decodedMessage
        });
        next();
    }
    catch (e) {
        res.status(401).send({
            error: e
        })
    }
}

export default authenticateUser