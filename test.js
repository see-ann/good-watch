var request = require("request");

var options = {
  method: 'GET',
  url: 'https://movie-database-imdb-alternative.p.rapidapi.com/',
  qs: {page: '1', r: 'json', s: 'Avengers Endgame'},
  headers: {
    'x-rapidapi-host': 'movie-database-imdb-alternative.p.rapidapi.com',
    'x-rapidapi-key': 'f216588249msh213fcde5db9d142p19cc64jsn8b430b104cef',
    useQueryString: true
  }
};

request(options, function (error, response, body) {
	if (error) throw new Error(error);

	console.log(body);
});