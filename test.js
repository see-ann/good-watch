var unirest = require("unirest");

var req = unirest("GET", "https://movie-database-imdb-alternative.p.rapidapi.com/");

req.query({
	"page": "1",
	"r": "json",
  "s": "Avengers Endgame",
  "plot": full
});

req.headers({
	"x-rapidapi-host": "movie-database-imdb-alternative.p.rapidapi.com",
	"x-rapidapi-key": "f216588249msh213fcde5db9d142p19cc64jsn8b430b104cef",
	"useQueryString": true
});


req.end(function (res) {
	if (res.error) throw new Error(res.error);

	console.log(res.body.Search[0].Title);
});