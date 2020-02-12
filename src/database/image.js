import db from './index';

const image = {
    async getAllUserImages(userID) {
        const queryText = 'SELECT * FROM frame_image WHERE owner_id = ($1);';
        return await db.pool.query(queryText, [ userID ]);
    },
    async getImageByID(imageID, userID) {
        const queryParams = [ imageID, userID ]
        const queryText = 'SELECT * FROM frame_image WHERE image_id = ($1) AND owner_id = ($2);';
        return await db.pool.query(queryText, queryParams);
    },
    async updateImage(imageData, imageID, userID) {
        const queryParams = [ imageData.title, imageID, userID ];
        const queryText = 'UPDATE frame_image SET title = ($1) WHERE image_id = ($2) AND owner_id = ($3);';
        const updatedImg = await db.pool.query(queryText, queryParams);
        if(updatedImg.rowCount != 0) {
            return await this.getImageByID(imageID, userID);
        } else {
            return -1;
        }
    },
    async deleteImage(imageID, userID) {
        const queryParams = [ imageID, userID ];
        const queryText = 'DELETE FROM frame_image WHERE image_id = ($1) AND owner_id = ($2);';
        return await db.pool.query(queryText, queryParams); 
    }
};

export default image;