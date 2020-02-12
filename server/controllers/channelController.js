import Channel from './../models/Channel.js';
import Video from './../models/Video.js';
import download from './../services/download.js';

export const getChannel = async (req, res) => {
    console.log('### channelController - get');
    let channel = new Channel({ path: req.params[0] });

    try {
        // first see if it exists in the db
        if (await channel.pull()) {
            console.log(`# served ${channel.path} from db`);
            // pull videos
            await channel.pullVideos();
            res.json(channel);

            // not in db - go and scrape it
        } else if (await channel.scrape()) {
            console.log(`# scraped ${channel.path} & ${channel.videos.length} videos`);

            // download channel cover
            download(channel.cover, channel.path, () => {
                console.log(`downloaded ${channel.path}.jpg`);
            });

            // save channel to db
            console.log(`# channel will be saved ...`);
            await channel.save();

            // save videos to db
            console.log(`# videos will be saved ...`);
            for (let i = 0; i < channel.videos.length; i++) {
                const video = new Video(channel.videos[i]);
                video.cid = channel.cid;
                video.cleanPath();
                video.cleanDate();
                await video.save();
                // console.log(video);
                if (i > 3) break; // 5 videos
            }
            res.statusCode = 201; // 201 Created
            res.json(channel);

        } else {
            // channel does not exist
            console.log(`# channel ${channel.path} does not exists`);
            res.statusCode = 202; // 204 No Content
            res.json({});
        }

    } catch (err) {
        console.log(err);
        res.statusCode = 500; // Server error
        res();
    }
}

export const updateChannel = async (req, res) => {
    console.log('### channelController - update');
    let channel = new Channel({ path: req.params[0] });

    try {
        // first see if it exists in the db
        if (await channel.pull()) {
            await channel.scrape();
            await channel.update();

            // save videos to db
            console.log(`# videos will be saved ...`);
            for (let i = 0; i < channel.videos.length; i++) {
                const video = new Video(channel.videos[i]);
                video.cid = channel.cid;
                video.cleanPath();
                video.cleanDate();
                await video.save();
                if (i > 3) break; // 5 videos
            }

            res.statusCode = 201;
            res.json(channel);
        } else {
            // channel not in db
            console.log(`# channel ${channel.path} not in db`);
            res.statusCode = 202;
            res.json({});
        }

    } catch (err) {
        console.log(err);
        res.statusCode = 500; // Server error
        res();
    }
}

export const saveChannel = async (req, res) => {
    console.log('### channelController - save');
    let channel = new Channel({ ...req.body });

    // try {
    //     // first test if it not already exists in the db
    //     if (!await channel.pull()) {
    //         await channel.save();
    //         console.log(`# channel ${channel.path} saved`);
    //         res.statusCode = 201; // 201 Created
    //         res.json(channel);
    //     } else {
    //         // channel exists - update
    //         await channel.update();
    //         console.log(`# channel ${channel.path} updated`);
    //         res.statusCode = 202; // 202 Accepted
    //         res.json(channel);
    //     }
    // } catch (err) {
    //     console.log(`# channel not saved`, err);
    //     res.statusCode = 400; // 400 Bad Request
    //     res.json({});
    // }
}

export const deleteChannel = async (req, res) => {
    console.log('### channelController - delete');
    let channel = new Channel({ path: req.params[0] });

    try {
        // first test if it already exists in the db
        if (await channel.pull()) {
            // delete channel
            await channel.delete()
            console.log(`# channel ${channel.path} deleted`);
            res.statusCode = 201; // 202 Accepted
            res.json(channel);
        } else {
            // channel not in db
            console.log(`# channel ${channel.path} not in db`);
            res.statusCode = 202; // 204 No Content
            res.json(channel);
        }
    } catch (err) {
        console.log(`# channel ${channel.path} not deleted`, err);
        res.statusCode = 400; // 400 Bad Request
        res.json({});
    }
}