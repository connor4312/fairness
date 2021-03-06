var finder = require('findit')
    prompt = require('prompt'),
    async  = require('async'),
    reader = require('line-reader')
    fs     = require('fs');

prompt.get([{
    name: 'total',
    description: 'Amount you were supposed to be paid',
    required: true
}, {
    name: 'paid',
    description: 'Amount you were actually paid',
    required: true
}, {
    name: 'path',
    description: 'Path of the project',
    required: true
}], function(err, results) {
    var percent = 1 - parseInt(results.paid) / parseInt(results.total);

    fixIt(results.path, percent, function () {
        console.log('Complete!');
    });
});

function fixIt(path, percent, cb) {
    var find  = finder(path),
        done  = false;

    var queue = async.queue(function (file, callback) {
        console.log('Fixing ' + file);

        var out = '';
        reader.eachLine(file, function (line, last) {
            if (Math.random() > percent) {
                out += line + "\n";
            }
        }).then(function () {
            fs.writeFileSync(file, out);
            callback();
        });
    });

    queue.drain = function () {
        if (done) {
            console.log('Done!');
        }
    }

    find.on('file', function (file) {
        queue.push(file);
    });

    find.on('end', function () {
        done = true;
    });
}
