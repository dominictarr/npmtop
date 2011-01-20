var npm = require('npm');
var Hash = require('traverse/hash');
var sprintf = require('sprintf').sprintf;

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
        
        var sorted = Object.keys(authors)
            .sort(function (a,b) {
                return authors[b] - authors[a] || (a.toLowerCase() < b.toLowerCase() ? -1 : 1)
            })
        ;
        
        var limit = process.argv[2] || 15;
        var start = 0;
        
        if (!limit.toString().match(/^\d+$/)) {
            var who = process.argv[2];
            start = sorted.indexOf(who);
            limit = 1;
        }
        
        var fairRank = 1;
        var lastVal = -1;
        sorted
            .slice(start, start + limit)
            .forEach(function (name, rank) {
                var percent = (authors[name] / total) * 100;

                if(authors[name] == lastVal)
                  rank = fairRank;

                console.log(sprintf(
                    '# %2d    %.2f %%    %4d      %s',
                   rank + start + 1 , percent, authors[name], name
                ));

               lastVal = authors[name];
               fairRank = rank;
            })
        ;
    });
});
