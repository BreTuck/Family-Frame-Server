import Router from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import auth from '../common';

const router = Router();

router.get('/all', (req, res) => {
    req.context.database.user.getUserByID(0).then(res => {
        console.log(res);
    }).catch((err) => {
        console.error(err);
    });
});
// User SignUp
router.post('/signup', async (req, res) => {
    try {
        const userExists = await req.context.database.user.getUserByEmail(req.body.email);
        if(userExists.rowCount != 0) {
            console.error('User Already Exists');
            res.status(200).send(false);
        } else {
            const hash = await bcrypt.hash(req.body.password, req.context.database.user.saltRounds);
            if(hash) {
                try {
                    const userCreated  = await req.context.database.user.createUser(req.body, hash);
                    if(userCreated.rowCount === 1) {
                        jwt.sign({ userID: userCreated.rows[0].user_id }, process.env.JWT_SECRET, function(err, token) {
                            if(err) {
                                console.error(err);
                                res.status(200).send(false);
                            } else {
                                res.cookie('userVerificationToken', token, req.context.database.user.tokenCookieOptions).status(200).send({ success: true, token: token, user: userCreated.rows[0] });
                            }
                        });
                    } else {
                        console.error('A Database Error Occurred. The new user was not successfully created.');
                        res.status(200).send(false);
                    }
                } catch(err) {
                    console.error(err);
                    res.status(200).send(false);
                }
            } else {
                console.error('An Error Occurred. The bcrypt hash value did not generate properly.');
                res.status(200).send(false);
            }
        }
    } catch(err) {
        console.error(err);
        res.status(200).send(false);
    }
});
// User SignIn
router.post('/signin', async (req, res) => {
    // Check that user exists
    try {
        const userExists = await req.context.database.user.getUserByEmail(req.body.email);
        if(userExists.rowCount != 0) {
            const isUser = await bcrypt.compare(req.body.password, userExists.rows[0].password);
            if(isUser) {
                jwt.sign({ userID: userExists.rows[0].user_id }, process.env.JWT_SECRET, function(err, token) {
                    if(err) {
                        console.error(err);
                        res.status(200).send({ success: false });
                    } else {
                        res.cookie('userVerificationToken', token, req.context.database.user.tokenCookieOptions).status(200).send({ success: true, token: token, user: userExists.rows[0] });
                    }
                });
            } else {
                console.error('The user credentials provided were incorrect. Please try again.');
                res.status(200).send(false);
            }
        } else {
            console.error('This user does not exists. Please try again.');
            res.status(200).send(false);
        }
    } catch(err) {
        console.error(err);
        res.status(200).send(false);
    }
});
// User SignOut
router.get('/signout', auth.authenticate, (req, res) => {
    res.clearCookie('userVerificationToken').status(200).send(true);
});
// Get user data (DOES NOT GET DATA FROM DATABASE)
router.get('/get', auth.authenticate, (req, res) => {
    res.status(200).send({ success: true, user: res.locals.user });
});
// Update user data by ID
router.post('/update', auth.authenticate, async (req, res) => {
    const userUpdated = await req.context.database.user.updateUser(res.locals.user.user_id, req.body);
    if(userUpdated != -1) {
        res.locals.user = {
            user_id: userUpdated.rows[0].user_id,
            name: userUpdated.rows[0].name,
            email: userUpdated.rows[0].email
        };
        res.status(200).send(true);
    } else {
        console.error('A Database Error Occurred. The user data was unable to be updated in the database.')
        res.status(200).send(false);
    }
});
// Change Password
router.post('/change', auth.authenticate, async (req, res) => {
    const hash = await bcrypt.hash(req.body.password, req.context.database.user.saltRounds);
    const userUpdated = await req.context.database.user.changePassword(res.locals.user.user_id, hash);
    if(userUpdated != -1) {
        res.locals.user = {
            user_id: userUpdated.rows[0].user_id,
            name: userUpdated.rows[0].name,
            email: userUpdated.rows[0].email
        };
        res.status(200).send(true);
    } else {
        console.error('A Database Error Occurred. The user data was unable to be updated in the database.');
        res.status(200).send(false);
    }
});
export default router;
