const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
var https = require('https')

var ipp = require('ipp');
var PDFDocument = require('pdfkit');
var concat = require("concat-stream");


// Create an express app
const app = express();

app.use(bodyParser.json({limit: '50mb',extended: true }));
app.use(bodyParser.urlencoded({limit: '50mb',extended: true }));

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "http://localhost:3000"); // update to match the domain you will make the request from
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.post('/printPDF', function(req,rsp) {
    let pdf = req.body.file;
    var bitmap = new Buffer(pdf, 'base64');

    var printer = ipp.Printer("http://localhost:631/printers/EPSON_AL-M300");
    var msg = {
        'operation-attributes-tag': {
            'requesting-user-name': 'FixjeiPhone magazijn',
            'job-name': 'Test Printjob',
            'document-format': 'application/pdf',
        },
        data: bitmap,
    };
    printer.execute("Print-Job", msg, function(err, res){
        console.log(res);
    });

    rsp.sendStatus(200);
});

app.post('/printViaLocalPDF', function(req,rsp) {
    let pdf = req.body.file;
    var bitmap = new Buffer(pdf, 'base64');

    var printer = ipp.Printer("http://localhost:631/printers/EPSON_EPSON_XP-15000_Series");
    var msg = {
        'operation-attributes-tag': {
            'requesting-user-name': 'FixjeiPhone magazijn',
            'job-name': 'Test Printjob',
            'document-format': 'application/pdf',
        },
        data: bitmap,
    };
    printer.execute("Print-Job", msg, function(err, res){
        console.log(res);
    });

    rsp.sendStatus(200);
});

function base64_decode(base64str, file) {
    // create buffer object from base64 encoded string, it is important to tell the constructor that the string is base64 encoded
    var bitmap = new Buffer(base64str, 'base64');
    // write buffer to file
    fs.writeFileSync(file, bitmap);

    console.log('******** File created from base64 encoded string ********');
}

app.listen(3000, function () {
  console.log('Example app listening on port 3000! Go to https://localhost:3000/')
})
