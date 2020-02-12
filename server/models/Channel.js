import db from './../db.js';
import scrapeChannel from '../services/scrapeChannel.js';

let Channel = function ({ path, title, category }) {
    this.cid;
    this.path = path;
    this.title = title;
    this.category = category;
    this.videos = [];
    this.errors = [];
    this.cover;
    this.created;
    this.updated;
    this.weight;
}

Channel.prototype.pull = function () {
    return new Promise((resolve, reject) => {
        let sql = `SELECT * FROM channel WHERE path = "${this.path}"`;
        db.query(sql, (err, results) => {
            if (err) reject(err);

            if (results.length) {
                console.log('>> pulled channel', results[0].path);

                // change me please
                const { ...res } = results[0];
                this.cid = res.cid;
                this.title = res.title;
                this.category = res.category;
                this.created = res.created;
                this.updated = res.updated;
                this.weight = res.weight;

                resolve(true);
            } else {
                resolve(false);
            }

        });
    });
}

Channel.prototype.pullVideos = function () {
    return new Promise((resolve, reject) => {
        let sql = `SELECT * FROM video WHERE cid = "${this.cid}"`;
        db.query(sql, (err, results) => {
            if (err) reject(err);

            if (results.length) {
                console.log(`>> pulled ${results.length} videos`);

                this.videos = results;

                resolve(true);
            } else {
                resolve(false);
            }

        });
    });
}

Channel.prototype.scrape = function () {
    return new Promise(async (resolve, reject) => {
        const res = await scrapeChannel(this.path);
        // console.log(res);
        if (res) {
            this.title = res.title;
            this.category = res.category;
            this.cover = res.img;
            this.videos = res.videos;
            resolve(true);
        } else {
            resolve(false);
        }
    });
}

Channel.prototype.save = function () {
    return new Promise(async (resolve, reject) => {

        if (!this.path) reject('no path given');
        if (!this.title) reject('no title given');

        const tmp = {
            path: this.path,
            title: this.title,
            category: this.category,
            created: parseInt((new Date().valueOf() / 1000)),
        }

        const sql = 'INSERT INTO channel SET ?';
        db.query(sql, tmp, (err, results) => {
            console.log('>> save:', this.path);
            if (err) {
                reject(err.sqlMessage);
            } else {
                this.cid = results.insertId;
                this.created = tmp.created;
                resolve(true);
            }
        });
    });
}

Channel.prototype.update = function () {
    return new Promise(async (resolve, reject) => {

        const update = {
            updated: parseInt((new Date().valueOf() / 1000)),
        }

        const sql = `UPDATE channel SET ? WHERE path = "${this.path}"`;
        db.query(sql, update, (err, results) => {
            console.log('>> update:', results.message);
            if (err) {
                reject(err.sqlMessage);
            } else {
                this.updated = update.updated;
                resolve(true);
            } new Date().valueOf()
        });
    });
}


Channel.prototype.delete = function () {
    return new Promise(async (resolve, reject) => {

        const sql = `DELETE FROM channel WHERE path = "${this.path}"`;
        db.query(sql, (err, results) => {
            console.log('>> delete:', results.message);
            if (err) {
                reject(err.sqlMessage);
            } else {
                resolve(true);
            }
        });
    });
}

// get time elapsed since last update
Channel.prototype.getAge = function () {
    if (this.updated) {
        const now = new Date().valueOf() / 1000; // in seconds
        const elasped = Number((now - this.updated) / 60 / 60).toFixed(1); // in houres
        return elasped;
    } else {
        return 0;
    }
}

export default Channel;