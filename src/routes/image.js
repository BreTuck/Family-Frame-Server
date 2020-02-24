import Router from 'express';
import auth from '../common';

const router = Router();

// app.get('/', (req, res) => {
    //   const targetPath = path.join(__dirname, '../../../gg/pp/BreAunna_2020-01-04_IMG_0596.JPG');
    //   console.log(targetPath);
    //   res.sendFile(targetPath);
    //     // res.sendFile(__dirname + '/public/Me.png');
    // });

router.get('/all', auth.authenticate, async (req, res) => {
    const allUserImages = await req.context.database.image.getAllUserImages(res.locals.user.user_id);
    if(allUserImages.rowCount != 0) {
        res.status(200).send({ success: true, images: allUserImages.rows });
    } else {
        console.error('A Database Error Occurred. The image data could not be obtained for this user.');
        res.status(200).send(false);
    }
});

// Returns the image data (title, file URL, sender) associated with the image ID provided
router.get('/:ID', auth.authenticate, async (req, res) => {
    const imageID = req.params.ID;
    const requestedImg = await req.context.database.image.getImageByID(imageID, res.locals.user.user_id);
    if(requestedImg.rowCount != 0) {
        res.status(200).send(requestedImg.rows[0]);
    } else {
        console.error('A Database Error Occurred. The image data could not be obtained for this user.');
        res.status(200).send(false);
    }
});

router.put('/update/:ID', auth.authenticate, async (req, res) => {
    const imageID = req.params.ID;
    const updatedImg = await req.context.database.image.updateImage(req.body, imageID, res.locals.user.user_id);
    console.log(updatedImg);
    if(updatedImg != -1) {
        res.status(200).send({ success: true, images: updatedImg.rows[0] });
    } else {
        console.error('A Database Error Occurred. The image data could not be updated for this user.');
        res.status(200).send({ success: false, images: {} });
    }
});

router.delete('/delete/:ID', auth.authenticate, async (req, res) => {
    const imageID = req.params.ID;
    const confirmDelete = req.context.database.image.deleteImage(imageID, res.locals.user.user_id);
    if(confirmDelete.rowCount == 1) {
        res.status(200).send(true);
    } else {
        console.error('A Database Error Occurred. The image data could not be deleted for this user.');
        res.status(200).send(false);
    }
});

export default router;