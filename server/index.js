const http = require('http');
const { readFile } = require('fs').promises;
const path = require('path');
const { Item } = require("../models");

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
    } else if(url === "/items/new") {
        let content = await readFile("./views/add-item.html");
        res.statusCode = 200;
        res.setHeader('Content-type', 'text/html');
        res.write(content);
        res.end();
    } else if(url === "/items" && req.method === "POST") {
        let body = '';
        for await (let chunk of req) {
            body += chunk;
        }
        let spaced = body.replace(/\+/g, ' ');
        let decoded = decodeURIComponent(spaced);
        let items = decoded.split('&');
        let keyValues = items.map(item => item.split('='));
        let obj = {createdAt: new Date(), updatedAt: new Date(), imageName: null}
        for(let i=0; i<keyValues.length; i++) {
            let [key, value] = keyValues[i];
            obj[key] = value;
        }
        // const newItem = new Item();
        // newItem.dataValues = obj;
        // console.log(newItem);
        // let insert = await Item.upsert('Items', obj);
        res.setHeader('Content-type', 'text/html');
        // res.write();
        res.end();
    }else {
        let items = await Item.findAll();
        let numItems = items.length;
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/html');
        res.end(`<div><a href="/items/new">Add a new item</a></div>
        <h1>I have ${numItems} items</h1>`);
        return;
    }
})

const hostname = '127.0.0.1';
const port = 3000;

server.listen(port, hostname, () => {
    console.log(`Listening on port ${port}...`);
})
