import db from './../db.js';
import scrapeVideo from '../services/scrapeVideo.js';

let Video = function ({ cid, path, title, date }) {
    this.vid;
    this.cid;
    this.path = path;
    this.title = title;
    this.date = date;
}

Video.prototype.cleanPath = function () {
    this.path = this.path.split('/')[2];
}

Video.prototype.cleanDate = function () {
    this.date = new Date(this.date).valueOf() / 1000;
}

Video.prototype.save = function () {
    return new Promise(async (resolve, reject) => {

        if (!this.cid) reject('>> video: no channel relation');
        if (!this.path) reject('>> video: no path given');

        const tmp = {
            cid: this.cid,
            path: this.path,
            title: this.title,
            date: this.date,
        }

        const sql = 'INSERT IGNORE INTO video SET ?';
        db.query(sql, tmp, (err, results) => {
            console.log('>> save:', this.path);
            if (err) {
                reject(err.sqlMessage);
            } else {
                resolve(true);
            }
        });
    });
}

export default Video;