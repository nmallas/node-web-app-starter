const http = require('http');
const { readFile } = require('fs').promises;
const path = require('path');

const server = http.createServer(async(req, res) => {
    const url = req.url;
    const images = /\/images\//;
    if (images.test(url)) {
        const imageFilePath = './assets' + url;
        console.log(imageFilePath);
        const fileExtension = path.extname(url);
        const imageType = fileExtension.substring(1);
        console.log(imageType);
        try {
            const imageFileContents = await readFile(imageFilePath);
            res.statusCode = 200;
            res.setHeader('Content-Type', `image/${imageType}`);
            res.end(imageFileContents);
            return;
        } catch (e) {
            res.statusCode = 404;
            res.setHeader('Content-Type', 'text/plain')
            res.end("Page Not Found")
        }
        // console.log(imageFileContents);
    } else {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/plain');
        res.end('I have items');
        return;
    }
})

const hostname = '127.0.0.1';
const port = 3000;

server.listen(port, hostname, () => {
    console.log(`Listening on port ${port}...`);
})
