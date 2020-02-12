import rp from 'request-promise';
import $ from 'cheerio';

const scrapeVideo = id => {

    const url = `${process.env.SERVICE_URL}/video/${id}`;

    return rp(url)
        .then(html => {
            //success!
            console.log('# scraping video', url);
            let $video = $('video', html);
            let source = $('source', $video)[0].attribs.src;
            // console.log($video);

            return {
                ratio: $video[0].attribs.ratio,
                poster: $video[0].attribs.poster,
                source: source
            };
        })
        .catch(err => {
            //handle error
            console.log(err);

        });
}

export default scrapeVideo;