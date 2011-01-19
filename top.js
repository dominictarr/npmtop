var npm = require('npm');
var Hash = require('traverse/hash');
var sprintf = require('sprintf').sprintf;

var limit = process.argv[2] || 15;
npm.load({ outfd : null }, function () {
    npm.commands.list(['latest'], function (err, pkgs) {
        var authors = {};
        var total = Hash(pkgs).length;
        Hash(pkgs).forEach(function (pkg) {
            var user = pkg.words[0].slice(1);
            authors[user] = (authors[user] || 0) + 1;
        });
        
        console.log('rank   percent   packages   author');
        console.log('----   -------   --------   ------');
        
        Object.keys(authors)
            .sort(function (a,b) {
                return authors[b] - authors[a]
            })
            .slice(0, limit)
            .forEach(function (name, rank) {
                var percent = (authors[name] / total) * 100;
                console.log(sprintf(
                    '# %2d    %.2f %%    %4d      %s',
                    rank + 1, percent, authors[name], name
                ));
            })
        ;
    });
})

