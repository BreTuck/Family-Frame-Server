import db from './index';

const user = {
    saltRounds: 10,
    tokenCookieOptions: {
        httpOnly: true,
        expire: 0
    },
    async findNextUserID() {
        const queryText = 'SELECT COUNT(frame_user.user_id) FROM frame_user;';
        try {
            const queryResult = await db.pool.query(queryText);
            const resultValue = queryResult.rows[0]
            if(resultValue) {
                return resultValue.count;
            } else {
                console.error('An Error Occurred. There is not a valid value available.');
            }
        } catch(err) {
            console.error(err);
        }
    },
    async getUserByEmail(userEmail) {
        const queryText = 'SELECT * FROM frame_user WHERE email = ($1);';
        return await db.pool.query(queryText, [ userEmail ]); 
    },
    async getUserByID(userID) {
        const queryText = 'SELECT * FROM frame_user WHERE user_id = ($1);';
        return await db.pool.query(queryText, [ userID ]);
    },
    async createUser(userData, hash) {
        const nextUserID = await this.findNextUserID();
        const queryParams = [ nextUserID, userData.name, userData.email, hash];
        const queryText = 'INSERT INTO frame_user VALUES (($1), ($2), ($3), ($4));';
        const newUser = await db.pool.query(queryText, queryParams);
        if(newUser.rowCount != 0) {
            return this.getUserByID(nextUserID);
        } else {
            return -1;
        }
    },
    async updateUser(userID, newUserData) {
        const queryParams = [ newUserData.name, newUserData.email, userID ];
        const queryText = 'UPDATE frame_user SET name = ($1), email = ($2) WHERE user_id  = ($3);';
        const updatedUser = await db.pool.query(queryText, queryParams);
        if(updatedUser.rowCount != 0) {
            return await this.getUserByID(userID);
        } else {
            return -1;
        }
    },
    async changePassword(userID, newHash) {
        const queryParams = [ newHash, userID ];
        const queryText = 'UPDATE frame_user SET password = ($1) WHERE user_id = ($2);';
        const updatedUser = await db.pool.query(queryText, queryParams);
        if(updatedUser.rowCount != 0) {
            return await this.getUserByID(userID);
        } else {
            return -1;
        }
    }
};

export default user;