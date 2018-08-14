var fs = require('fs');

/* //sync
console.log(fs.readdirSync(__dirname));

//async
function async (err, files) {
    console.log(files);
};
console.log(fs.readdir('.', async)); */

// console.log(fs.readdir(process.cwd()));



fs.readdir(process.cwd(), function (err, files) {
    console.log(''); //blank line
    if (!files.length) {
        return console.log('  \033[31m No files to show!\033[39m\n'); //ASCII color codes
    }
    console.log('  Select which file or directory you want to see\n');

    function file(i) {
        var filename = files[i];

        fs.stat(process.cwd() + '/' + filename, function (err, stat) {
        // fs.stat(__dirname + '/' + filename, function (err, stat) {
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

            i++;
            if (i == files.length) {
                console.log('');
                process.stdout.write('  \033[33mEnter your choice: \033[39m');
                process.stdin.resume();
                process.stdin.setEncoding('utf8');
            } else {
                file(i);
            }
        });
    }

    file(0);
});