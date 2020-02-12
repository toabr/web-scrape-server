import express from 'express';
import overview from './controllers/channelOverviewController.js';
import { getChannel, updateChannel, saveChannel, deleteChannel } from './controllers/channelController.js';

const router = express.Router();

// get all channels from db
router.get('/', overview);

// pull from db || scrape & save
router.get('/channel/*', getChannel);

// update - new scrape
router.post('/channel/*', updateChannel);

// save
// router.post('/channel', saveChannel);

// delete
router.delete('/channel/*', deleteChannel);






// api route to scrap a video in json
router.get('/video/*', async (req, res) => {

    // check for empty parameter and serve default video
    const id = (req.params[0] != '') ? req.params[0] : 'UGlrF9o9b-Q';
    console.log('### requesting video', id);

    const data = await scrapeVideo(id);
    res.json(data);

});

export default router;