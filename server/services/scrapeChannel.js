import rp from 'request-promise';
import $ from 'cheerio';

const scrapeChannel = id => {

    const url = `${process.env.SERVICE_URL}/channel/${id}`;

    return rp(url, (err, response, body) => {
        console.log('>> scrape channel', url);
        console.log('>> status', response.statusCode)
        console.log('>>', response.headers['content-type'])
    })
        .then(html => {
            // scrape channel infos
            let channel = {
                title: $('#channel-title', html).text(),
                path: $('.name > a', html)[0].attribs.href,
                img: $('img[alt="channel image"]', html)[0].attribs['data-src'],
                category: $('.channel-about-list td > a', html).text(),
                owner: {
                    title: $('.owner > a', html).first().text(),
                    path: $('.owner > a', html)[0].attribs.href,
                }
            }

            // scrape channel videos
            let $channelUploads = $('.channel-videos-container', html);
            let videos = Array.from($channelUploads.map((i, el) => {
                // console.log(el);
                let $link = $('.channel-videos-title > a', el);
                let $img = $('.channel-videos-image > img', el);

                return {
                    id: i,
                    title: $link.text().trim(),
                    path: $link[0].attribs.href,
                    date: $('.channel-videos-details', el).first().text().trim(),
                    info: $('.channel-videos-text', el).first().text().trim(),
                    img: $img[0].attribs['data-src']
                }
            }));

            return { ...channel, videos }
        })
        .catch(err => console.log('>> fetching error'));
}

export default scrapeChannel;