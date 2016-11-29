

//var arr = 'https://s1.2mdn.net/5038406/1459939808910/453_HigherEdCampaign_A2_0216-14.svg'.match(/(\d+x\d+)/);
//console.log(arr);return;

/*
var sqlite3 = require('C:\\Program Files\\nodejs\\node_modules\\sqlite3\\sqlite3.js').verbose();
var db = new sqlite3.Database('D:\\SavvyWebCrawler\\ExportFiles\\1.db');
db.serialize(function() {
  db.run("CREATE TABLE url (code INT, url TEXT)");
});
db.each("SELECT *  FROM url", function(err, row) {
    console.log(row.code + ": " + row.url);
  });
db.close();
return;
*/
var fs = require('fs');

var concat = Array.prototype.concat;

var getUrlsP = function(code) {

	var Promises = [];
	//var urls = [];

	var path = 'D:\\SavvyWebCrawler\\ExportFiles\\';

	for (var i = 20160727; i <= 20160728; i++) {
		
		var files = fs.readdirSync(path + i + '\\');

		files.forEach(file =>  {
			var fullPath = path + i + '\\' + file;
			var stat = fs.lstatSync(fullPath);

			if (stat.isDirectory())
				return;

			var lineReader = require('readline').createInterface({
				input: fs.createReadStream(fullPath)
			});


			Promises.push(new Promise(
					resolve => 
					{
						var Ps = [];
						lineReader.on('line', function (line) {
							var json =JSON.parse(line);

							if (json.internetOutletCode == code) {
								//console.log(JSON.stringify(json, null, 2));
								//Ps.push(new Promise(resolveInner => resolveInner(json.crawlStartTime)));
								Ps.push(new Promise(resolveInner => resolveInner(
									json.Resources.map(r => r.src)
									.filter(src => 
										/*src.toLowerCase().indexOf('.swf') > 0
										&&*/
										(src.startsWith('https://tpc.googlesyndication.com')
										|| src.startsWith('https://secure-ds.serving-sys.com')
										|| src.startsWith('https://s1.2mdn.net')
										|| src.startsWith('https://s0.2mdn.net')
										|| src.startsWith('https://ad.zanox.com/')
										|| src.startsWith('https://ad.adsrvr.org/')))
									)
								));
							}
						});

						lineReader.on('close', () =>
							{
								Promise.all(Ps).then(value =>{resolve(Array.prototype.concat.apply([], value));}) 
							}
						);
					}
				));
		});

	}

	return Promises;
};

var writeLog = function (code, urls) {
	var fs = require('fs');
	var logger = fs.createWriteStream(logPath, {
	  flags: 'a' // 'a' means appending (old data will be preserved)
	});

	urls.forEach(url => {
		var dim = url.match(/(\d+x\d+)/);
		var arr = url.split('/').filter(v => /^\d+$/.test(v));

		if (arr.length) {
			arr.sort(function(a, b){
			  return b.length - a.length;
			});
		}
		
		logger.write(code + '\t' + url + '\t' + (arr.length ? arr[0] : '') +'\t' + (dim ? dim[1] : '')  + '\r\n');
	}); // append string to your file
	
	logger.end(); // close string
	console.log(code);
}

var getUrls = function(codes, idx) {
	if (codes.length <= idx)
		return;

	var code = codes[idx];
	Promise.all(getUrlsP(code)).then(value => {
			writeLog(code, Array.from(new Set(concat.apply([], value))));
			getUrls(codes, idx + 1);
		});
}

var logPath = 'D:\\SavvyWebCrawler\\ExportFiles\\log.txt';

fs.access(logPath, fs.F_OK, function(err) {
    if (!err) {
        fs.unlinkSync(logPath);
    }
});


getUrls([2455, 2456, 2656, 2480], 0);

//getUrls(2656);
//getUrls(2455);
//getUrls(2480);

		/*var sqlite3 = require('C:\\Program Files\\nodejs\\node_modules\\sqlite3\\sqlite3.js').verbose();
		var db = new sqlite3.Database('D:\\SavvyWebCrawler\\ExportFiles\\1.db');

		db.run("BEGIN TRANSACTION");
		db.serialize(function() {
		  allUrls.forEach(url =>
			  {
			  	db.run("INSERT OR IGNORE INTO url (code, url) VALUES (?,?)", [code, url]);
			  }
		  );
		});
		db.run("END");
*/