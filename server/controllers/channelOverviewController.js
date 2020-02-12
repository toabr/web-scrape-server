import Channel from './../models/Channel.js';
import db from './../db.js'

const channelOverviewController = async (req, res) => {
    console.log('### overviewController');

    try {
        let allChannel = await pullAllChannel();
        let allVideos = await pullAllVideos();

        const channelList = allChannel.map(channel => {
            channel.videos = allVideos.filter(video => {
                return video.cid === channel.cid;
            });
            return channel;
        });

        console.log(`# ${channelList.length} channels served`);
        res.json(channelList.reverse());

    } catch (err) {
        console.log(err);
        res.statusCode = 500; // Server error
    }
}

const pullAllChannel = function () {
    return new Promise((resolve, reject) => {
        let sql = 'SELECT * FROM channel';
        db.query(sql, (err, results) => {
            if (err) reject(err);
            resolve(results);
        });
    });
}

const pullAllVideos = function () {
    return new Promise((resolve, reject) => {
        let sql = 'SELECT * FROM video';
        db.query(sql, (err, results) => {
            if (err) reject(err);
            resolve(results);
        });
    });
}

export default channelOverviewController;