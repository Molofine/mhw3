function onResponse(response) {
    return response.json();    
}

function onError(error) {
	console.log("Errore: " + error);	
}

function onJsonToken(json) {
	console.log(json);
	token = json.access_token;
}

// Chiavi ed endpoint
const img_api_endpoint = 'https://api.unsplash.com/search/photos?client_id='; 
const img_key = '8lJOUF8-QsePqUO7aWtF9xMoxdHiN_tiffc9bDsurTk';
const gif_api_endpoint_auth = 'https://api.gfycat.com/v1/oauth/token';
const gif_api_endpoint_search = 'https://api.gfycat.com/v1/gfycats/';
const client_id = '2_o3tEkw';
const client_secret = 'U_huTRsDTjUDqN7tAjmOCiUKuQEuhA-qKDbFs8Iqv3LI4i09mYI0g4VOyJYbdSmO';

// ID delle Gif che voglio usare
const list_gifs_id = {
	"Porsche 911 GT3": 'selfassuredpositiveaphid',
	"McLaren 570": 'bothenlightenedaustraliankelpie',
	"Audi R8": 'honestshamelesshornet',
	"Ferrari 488": 'farawayquarrelsomelangur',
	"Lamborghini Huracan": 'briskspotlessblackrhino'
}

// Faccio la richiesta del token
let token;

const body = {
  grant_type: "client_credentials",
  client_id: client_id,
  client_secret: client_secret,
};
  
const stringified_body = JSON.stringify(body);

fetch(gif_api_endpoint_auth, {
  method: "POST",
  body: stringified_body,
  headers: {
	"Content-Type": "application/json",
  }
}).then(onResponse, onError).then(onJsonToken);

// Cerco ognuno dei 5 articoli della classifica
const articles = document.querySelectorAll("article");

// Per ogni articolo faccio una fetch e gli metto ulteriori foto oltre quella di default e una gif
for(let article of articles) {
	let car_model = article.dataset.carModel;
	let img_url = img_api_endpoint + img_key + '&query=' + encodeURIComponent(car_model) + '&page=1&per_page=21';
	
	// Carico foto usando una ricerca per parole chiave (uso lambda function)
	fetch(img_url).then(onResponse, onError).then((json) => {
		console.log(json);

		// Inserisco 21 foto
		for(let i=0; i < json.results.length; i++) {
			let image = document.createElement('img');
			image.src = json.results[i].urls.regular;
			let album = article.querySelector("p");
			album.appendChild(image);
		}
	});

	// Inserisco una GIF per ID, già scelta per ogni auto
	fetch(gif_api_endpoint_search + list_gifs_id[car_model], {
		method: "GET",
		headers: {
		  Authorization: "Bearer " + token,
		},
	  }).then(onResponse, onError).then((json) => {
		console.log(json);
		let gif = document.createElement('img');
		gif.src = json.gfyItem.webpUrl;
		gif.classList.add('gif');
		article.appendChild(gif);
	});
}