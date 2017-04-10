var express = require('express');
var random = require('random-js')();
var fs = require('fs');
var app = express();
app.use(express.static('./client/'));
app.listen(3000);

// Home page.
app.get('/data', function(req, res) {
	var options = {encoding:'utf8', flag:'r'}
	fs.readFile('./data/wordlist.txt', options, function(err, simpleWordList) {
		if(err){
			console.log('Bad');
			res.status(500);
		}
		else {
			console.log('Good');
			fs.readFile('./data/dictionary.csv', function(err, complexWordList) {
				var wordList = simpleWordList.split('\r\n');
				var pickedWords = [];
				const nWordRequested = 20;
				for (var i = 1; i <= nWordRequested; i++) {
					var index = random.integer(0, wordList.length-1);
					pickedWords.push(wordList[index]);
				}
				var refList = JSON.parse(complexWordList);
				var sendingWord = [];
				for(var i = 0; i < pickedWords.length; i++) {
					sendingWord.push({
						word: pickedWords[i],
						part_of_speech: refList[`${pickedWords[i]}`]
					});
				}
				console.log(sendingWord)
				res.send({wordList: sendingWord});				
			})
		}
	});
});