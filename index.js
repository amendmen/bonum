const tress = require('tress');
const needle = require('needle');
const cheerio = require('cheerio');
const resolve = require('url').resolve;
const fs = require('fs');

const URL = 'https://hotline.ua/sr/?q=';
const results = [];

const q = tress(function (url, callback) {
    needle.get(url, function (err, res) {
        if (err) throw err;

        const $ = cheerio.load(res.body);

        let allLinks = $('a');

        for (key in allLinks) {
            let link = allLinks[key].attribs;
            if (link && link['rel'] === 'nofollow' && link['href'].indexOf('#sales') != -1) {
                results.push(`\nhttps://hotline.ua${link['href']}`)

            }
        }

        //paging        
        // $('a.pages').each(function() {
        //     q.push(resolve(URL, $(this).attr('href')));
        // });

        callback();
    });
}, 10);

q.drain = function () {
    fs.writeFileSync('./data.txt', results);
}

for (let n = 0; n < 26; n++) {

    let chr = String.fromCharCode(97 + n);

    q.push(URL + chr);
}
