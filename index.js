const fs = require("fs");
const openssl = require("openssl-wrapper");
const opensslAsync = require("bluebird").promisify(openssl.exec);

const express = require('express');
const multipart = require('connect-multiparty');
const multipartMiddleware = multipart({ uploadDir: '/tmp' });

let app = express()

app.get('/', function (req, res) {
    res.send('OK');
});

app.post('/verify', multipartMiddleware, function (req, res) {
    if (req.files.sign.path && req.files.content.path) {
        let signedData = fs.readFileSync(req.files.sign.path);
        return opensslAsync('cms.verify', signedData, { content: req.files.content.path, inform: 'PEM', noverify: true })
            .then((data) => {
                removeFiles(req.files);
                return res.json({ "result": "Verification successful" });
            })
            .catch((e) => {
                removeFiles(req.files);
                console.error("catch error", e);
                return res.json({ "result": "Verification failure" });
            });
    }
    removeFiles(req.files);
    res.json({ "result": "Verification failure" });
});

app.listen(8080, function () {
    console.log('Verify server listening on port 8080!');
});

function removeFiles(reqFiles) {
    for (let i = 0; i < Object.keys(reqFiles).length; i++) {
        fs.unlinkSync(reqFiles[Object.keys(reqFiles)[i]].path);
        console.log("remove",reqFiles[Object.keys(reqFiles)[i]].path);
    };
}