var fs = require('fs');
var stdin = process.stdin;
var stdout = process.stdout;

fs.readdir(process.cwd(), function (err, files) {
    console.log(''); //blank line
    if (!files.length) {
        return console.log('  \033[31m No files to show!\033[39m\n'); //ASCII color codes
    }
    console.log('  Select which file or directory you want to see\n');

    var stats = [];

    // called for each file walked in the directory
    function file(i) {
        var filename = files[i];

        fs.stat(process.cwd() + '/' + filename, function (err, stat) {
            // fs.stat(__dirname + '/' + filename, function (err, stat) {
            stats[i] = stat;
            if (err) {
                console.log(err);
                return;
            }
            if (stat && stat.isDirectory()) {
                // console.log(`    ${i}   \\033[36m ${filename}/\\033[39m`);
                console.log('  ' + i + '\033[36m ' + filename + '/\033[39m');
            } else {
                // console.log(`    ${i}   \\033[90m ${filename}\\033[39m`);
                console.log('  ' + i + '\033[90m ' + filename + '\033[39m');
            }

            if (++i == files.length) {
                read();
            } else {
                file(i);
            }
        });
    }

    // read user input when file are shown
    function read() {
        console.log('');
        stdout.write('  \033[33mEnter your choice: \033[39m');
        stdin.resume();
        stdin.setEncoding('utf8');
        stdin.on('data', option);
    }

    // called with the option supplied by the user
    function option(data) {
        var filename = files[Number(data)];
        if (!filename) {
            stdout.write('  \033[33mEnter your choice: \033[39m');
        } else {
            stdin.pause();
            if (stats[Number(data)].isDirectory()) {
                fs.readdir(process.cwd() + '/' + filename, 'utf8', function (err, files) {
                    console.log('');
                    console.log('    (' + file.length + ' files)');
                    files.forEach((file) => {
                        console.log('  -   ' + file);
                    });
                    console.log('');
                });
            } else {
                fs.readFile(process.cwd() + '/' + filename, 'utf8', function (err, data) {
                    console.log('');
                    stdout.write('  \033[90m' + data.replace(/(.*)/g, '     $1') + '\033[39m');
                });
            }
        }
    }

    file(0);
});

