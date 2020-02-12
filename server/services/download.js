import { createWriteStream } from 'fs';
import request from 'request';
import path from 'path';

const download = (uri, filename, callback) => {
    request.head(uri, function (err, res, body) {
        console.log('download', uri);
        console.log('content-type:', res.headers['content-type']);
        console.log('content-length:', res.headers['content-length']);

        const downloadPath = path.resolve(`./static/files/${filename}.jpg`);

        request(uri).pipe(createWriteStream(downloadPath)).on('close', callback);
    });
};

export default download;