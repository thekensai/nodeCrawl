var fs = require('fs');

var concat = Array.prototype.concat;
var yes = 0;
var getUrlsP = function(date) {

	var Promises = [];

	var path = 'D:\\SavvyWebCrawler\\ExportFiles\\';

		
		var files = fs.readdirSync(path + date + '\\');

		files.forEach(file =>  {
			var fullPath = path + date + '\\' + file;
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
/*
  "internetOutletCode": 2553,
  "outletName": "Futhead",
  "url": "http://www.futhead.com/",
  "crawlDuration": 18,
  "crawlStartTime": "2016-07-26T14:09:47.5100468Z",
  "screenShotPath": "\\\\192.168.10.220\\ExportFiles\\20160727\\Futhead\\screens
hot_20160727_000947.jpg",
  "viewportWidth": 1500,
  "pageHeight": 0,
  "FileSize": 10,
  "BodyWidth": 800,
  "ResourceWidth": 50,
  "ResourceHeight": 50,
  "ResourceDiagonal": 150,
  "DeviceType": "PC",
  "UserAgent": "Mozilla/5.0 (Windows NT 6.3; rv:36.0) Gecko/20100101 Firefox/36.
0",
*/
							
						});

						lineReader.on('close', () =>
							{
								Promise.all(Ps).then(value =>{resolve(concat.apply([], value));}) 
							}
						);
					}
				));
		});

	return Promises;
};

//Resources: {src, "type": "Background",target,"diagonal"}
Promise.all(getUrlsP(20160727)).then(value => {
			
		});