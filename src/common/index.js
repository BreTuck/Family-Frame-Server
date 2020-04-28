import 'dotenv/config';
import jwt from 'jsonwebtoken';

const auth = {
    async authenticate(req, res, next) {
        let currentUserToken = req.headers.authorization;
        if(currentUserToken === undefined) currentUserToken = req.cookies.userVerificationToken;
        if(currentUserToken) {
            const tokenPayload = jwt.verify(currentUserToken, process.env.JWT_SECRET);
            if(tokenPayload) {
                try {
                    const userData = await req.context.database.user.getUserByID(tokenPayload.userID);
                    if(userData.rowCount != 0) {
                        res.locals.user = {
                            user_id: userData.rows[0].user_id,
                            name: userData.rows[0].name,
                            email: userData.rows[0].email
                        };
                        next();
                    } else {
                        console.error('A Database Error Occurred. The user could not be retrieved from the database.');
                        res.status(200).send(false);
                    }
                } catch(err) {
                    console.error(err);
                    res.status(200).send(false);
                }
            } else {
                console.error('An Error Occurred. The user token could not be verified.');
                res.status(200).send(false);
            }
        } else {
            console.error('An Error Occurred. The user token could not be obtained.');
            res.status(200).send(false);
        } 
    }
}

export default auth;