//key for movie API
let key = "b52bafa89a3d95b1fa29201d5bae76b4";
//url to get images for movies
let imagePath = "https://image.tmdb.org/t/p/original";
//variable for movie data
let movieData = "";
//save user search
let userSearch = "";

//function that searches for movie name when user types
function QuickSearch(){
	let input = document.getElementById("SearchInput").value;
	userSearch = input;
	//search for existing movie titles if user enters more than 2 letters
	if (input.length > 2){
		//use fetch to retrieve data from api
		fetch("https://api.themoviedb.org/3/search/movie?api_key=" + key + "&language=en-US&query=" + input + "&page=1&include_adult=false", {
			"method": "GET",
		})
		.then(function (response) {
			// code for handling the data from the API
			return response.json() // data into json
		})
		.then(function (data){
			//save data to variable
			movieData = data;
			//console.log(data)
			//search results to push to quick search box
			let searchResults = "";
			//show top 3 search results
			for (let i = 0; i < 3; i++){
				//if search item has no movie image/poster
				if (data.results[i].poster_path === null){
					searchResults +=   `<div class='QuickSearchItem' id='${i}' onclick='DisplayMovie(this);'>
											<img class='QuickSearchImg' src='images/noImage.png' />	
											<div class='QuickSearchText'>
												<h1>${data.results[i].title}</h1>
												<h3>${data.results[i].release_date.substring(0,4)}</h3>
											</div>
										</div>`;
				}
				//if search item has movie image or poster
				else{
					searchResults +=   `<div class='QuickSearchItem' id='${i}' onclick='DisplayMovie(this);'>
											<img class='QuickSearchImg' src='${imagePath + data.results[i].poster_path}' />	
											<div class='QuickSearchText'>
												<h1>${data.results[i].title}</h1>
												<h3>${data.results[i].release_date.substring(0,4)}</h3>
											</div>
										</div>`;
				}
			}
			//add link to view all search items
			searchResults += '<a href="#FullSearch" id="FullSearchLink" onclick="ShowFullSearch();">view all search results</a>';
			//add search items to quick search
			document.getElementById("QuickSearchBox").innerHTML = searchResults;
			//show search box
			document.getElementById("QuickSearchBox").style.display = "flex";
		})
		.catch(function (error) {
			// if the server returns any errors
			console.log(error)
		});
	}
}

//close quick search when clicking outside
function CloseSearch(){
	document.getElementById("QuickSearchBox").style.display = "none";
}

//function that displays info on movie that was selected
function DisplayMovie(item){
	//get id of movie user selects
	let movieId = item.id;
	//close search box
	document.getElementById("QuickSearchBox").style.display = "none";
	//clear current movie
	document.getElementById("CurrentMovie").innerHTML = `
                <!-- Header -->
                <div id="Header" class="fixed-top">
                    <!-- Logo -->
                    <div id="Logo">
                        <h1 class="heading">the movie</h1>
                        <img src="images/logo.png" />
                        <h1 class="heading">search box</h1>
                    </div>
                    <!-- Search Div -->
                    <div id="SearchDiv">
                        <input type="text" name="SearchInput" id="SearchInput" placeholder="Search Movie Title" oninput="QuickSearch();" />
                        <button id="SearchButton">
                            <img src="images/search.svg" />
                        </button>
                    </div>
                </div>

                <!-- Quick Search Box -->
                <div id="QuickSearchDiv">
                    <div id="QuickSearchBox"></div>
                </div>`;
    //if movie has poster image and backdrop image
    if (movieData.results[movieId].poster_path && movieData.results[movieId].backdrop_path){
    	document.getElementById("CurrentMovie").innerHTML += `<img id="CurrentBg" src='${imagePath + movieData.results[movieId].backdrop_path}' />
															  <div id="MovieInfo">
															  	<div id="MovieText">
															  		<h4>You Searched:</h4>
															  		<h1 class='heading'>${movieData.results[movieId].title}</h1>
														 			<h2>${movieData.results[movieId].release_date}</h2>
														 			<h3>${movieData.results[movieId].overview}</h3>
															  	</div>
															  	<img id='CurrentMovieImg' src='${imagePath + movieData.results[movieId].poster_path}' />
															  </div>
															  `;
    }
    //if movie only has poster image
    else if (movieData.results[movieId].poster_path){
    	document.getElementById("CurrentMovie").innerHTML += `
															  <div id="MovieInfo">
															  	<div id="MovieText">
															  		<h4>You Searched:</h4>
															  		<h1 class='heading'>${movieData.results[movieId].title}</h1>
														 			<h2>${movieData.results[movieId].release_date}</h2>
														 			<h3>${movieData.results[movieId].overview}</h3>
															  	</div>
															  	<img id='CurrentMovieImg' src='${imagePath + movieData.results[movieId].poster_path}' />
															  </div>
															  `;
    }
    //if movie only has backdrop image
    else if (movieData.results[movieId].backdrop_path){
    	document.getElementById("CurrentMovie").innerHTML += `<img id="CurrentBg" src='${imagePath + movieData.results[movieId].backdrop_path}' />
															  <div id="MovieInfo">
															  	<div id="MovieText">
															  		<h4>You Searched:</h4>
															  		<h1 class='heading'>${movieData.results[movieId].title}</h1>
														 			<h2>${movieData.results[movieId].release_date}</h2>
														 			<h3>${movieData.results[movieId].overview}</h3>
															  	</div>
															  	<img id='CurrentMovieImg' src='images/noImg.png' />
															  </div>
															  `;
    }
    //if movie has no images
    else{
    	document.getElementById("CurrentMovie").innerHTML += `
															  <div id="MovieInfo">
															  	<div id="MovieText">
															  		<h4>You Searched:</h4>
															  		<h1 class='heading'>${movieData.results[movieId].title}</h1>
														 			<h2>${movieData.results[movieId].release_date}</h2>
														 			<h3>${movieData.results[movieId].overview}</h3>
															  	</div>
															  	<img id='CurrentMovieImg' src='images/noImg.png' />
															  </div>
															  `;
    }
}

//function to display full search results
function ShowFullSearch(){
	//close search box
	document.getElementById("QuickSearchBox").style.display = "none";
	//show full search div
	document.getElementById("FullSearchDiv").style.display = "flex";
	//search results to push to full search div
	let searchResults = "";
	//show all search results from current page
	for (let i = 0; i < movieData.results.length; i++){
		//if search item has no movie image/poster
		if (movieData.results[i].poster_path === null && movieData.results[i].release_date){
			searchResults +=   `<div class='FullSearchItem' id='${i}' onclick='DisplayMovie(this);'>
									<a href="#PageTop">
										<img class='FullSearchImg' src='images/noImage.png' />	
										<div class='FullSearchText'>
											<h1>${movieData.results[i].title}</h1>
											<h3>${movieData.results[i].release_date.substring(0,4)}</h3>
										</div>
									</a>
								</div>`;
		}
		//if search item has movie image or poster
		else if (movieData.results[i].release_date){
			searchResults +=   `<div class='FullSearchItem' id='${i}' onclick='DisplayMovie(this);'>
									<a href="#PageTop">
										<img class='FullSearchImg' src='${imagePath + movieData.results[i].poster_path}' />	
										<div class='FullSearchText'>
											<h1>${movieData.results[i].title}</h1>
											<h3>${movieData.results[i].release_date.substring(0,4)}</h3>
										</div>
									</a>
								</div>`;
		}
	}

	//add search items to full search
	document.getElementById("FullSearchResults").innerHTML = searchResults;
	//show page buttons
	document.getElementById("Pagination").style.display = "flex";
}

//function to change header background colour on scroll
function ChangeHeaderBg(){
	if (document.body.scrollTop > 50 || document.documentElement.scrollTop > 50) {
    document.getElementById("Header").style.backgroundColor = "rgba(0,0,0,0.9)";
  	} 
  	else {
    	document.getElementById("Header").style.backgroundColor = "transparent";
	}
}

//now playing 
//variable for now playing movies
let nowPlaying = [];
//use fetch to retrieve data from api
fetch("https://api.themoviedb.org/3/movie/now_playing?api_key=" + key + "&language=en-US&page=1", {
	  "method": "GET",
	})
	.then(function (response) {
		// code for handling the data from the API
		return response.json() // data into json
	})
	.then(function (data){
		//console.log(data);
		//save data to variable if they have backdrop images
		for (let i = 0; i < data.results.length; i++){
			if (data.results[i].backdrop_path !== null){
				nowPlaying.push(data.results[i]);
			}
		}
		document.getElementById("CurrentMovie").innerHTML += `<img id="CurrentBg" src='${imagePath + nowPlaying[3].backdrop_path}' />
															  <div id="MovieInfo">
															  	<div id="MovieText">
															  		<h4>Now Playing</h4>
															  		<h1 class='heading'>${nowPlaying[3].title}</h1>
														 			<h2>${nowPlaying[3].release_date}</h2>
														 			<h3>${nowPlaying[3].overview}</h3>
															  	</div>
															  	<img id='CurrentMovieImg' src='${imagePath + nowPlaying[3].poster_path}' />
															  </div>
															  `;
	})
	.catch(function (error) {
		// if the server returns any errors
		console.log(error)
	});

//popular movies
//variable for popular movies
let popularMovies = [];
//use fetch to retrieve data from api
fetch("https://api.themoviedb.org/3/movie/popular?api_key=" + key + "&language=en-US&page=1", {
	  "method": "GET",
	})
	.then(function (response) {
		// code for handling the data from the API
		return response.json() // data into json
	})
	.then(function (data){
		//console.log(data);
		//save data to variable if they have backdrop images
		for (let i = 0; i < data.results.length; i++){
			if (data.results[i].poster_path !== null){
				popularMovies.push(data.results[i]);
			}
		}
		for (let i = 0; i < 4; i++){
			document.getElementById("PopularDiv").innerHTML += `<div onclick="ShowPopularMovie(this)" id="${i}" class='col-xl-3 col-sm-2 popularMovieItem'>
																	<a href="#PageTop">
																		<img src='${imagePath + popularMovies[i].poster_path}' />
																		<h1 class='heading'>${popularMovies[i].title}</h1>
																	</a>
																</div>
															   `;
		}
		
	})
	.catch(function (error) {
		// if the server returns any errors
		console.log(error)
	});

//Display movie selected from popular movie area
function ShowPopularMovie(item){
	//get number of movie
	let PopMovieId = item.id;
	//clear current movie
	document.getElementById("CurrentMovie").innerHTML = `
                <!-- Header -->
                <div id="Header" class="fixed-top">
                    <!-- Logo -->
                    <div id="Logo">
                        <h1 class="heading">the movie</h1>
                        <img src="images/logo.png" />
                        <h1 class="heading">search box</h1>
                    </div>
                    <!-- Search Div -->
                    <div id="SearchDiv">
                        <input type="text" name="SearchInput" id="SearchInput" placeholder="Search Movie Title" oninput="QuickSearch();" />
                        <button id="SearchButton">
                            <img src="images/search.svg" />
                        </button>
                    </div>
                </div>

                <!-- Quick Search Box -->
                <div id="QuickSearchDiv">
                    <div id="QuickSearchBox"></div>
                </div>`;
    //display movie info
    //if movie has poster image and backdrop image
    if (popularMovies[PopMovieId].backdrop_path){
    	document.getElementById("CurrentMovie").innerHTML += `<img id="CurrentBg" src='${imagePath + popularMovies[PopMovieId].backdrop_path}' />
															  <div id="MovieInfo">
															  	<div id="MovieText">
															  		<h4>You Searched:</h4>
															  		<h1 class='heading'>${popularMovies[PopMovieId].title}</h1>
														 			<h2>${popularMovies[PopMovieId].release_date}</h2>
														 			<h3>${popularMovies[PopMovieId].overview}</h3>
															  	</div>
															  	<img id='CurrentMovieImg' src='${imagePath + popularMovies[PopMovieId].poster_path}' />
															  </div>
															  `;
    }
    //if movie only has poster image
	else{
		document.getElementById("CurrentMovie").innerHTML += `
															  <div id="MovieInfo">
															  	<div id="MovieText">
															  		<h4>You Searched:</h4>
															  		<h1 class='heading'>${popularMovies[PopMovieId].title}</h1>
														 			<h2>${popularMovies[PopMovieId].release_date}</h2>
														 			<h3>${popularMovies[PopMovieId].overview}</h3>
															  	</div>
															  	<img id='CurrentMovieImg' src='${imagePath + popularMovies[PopMovieId].poster_path}' />
															  </div>
															  `;
	}
}

//build list of genres on side div
//use fetch to retrieve data from api
fetch("https://api.themoviedb.org/3/genre/movie/list?api_key=" + key + "&language=en-US&page=1", {
	  "method": "GET",
	})
	.then(function (response) {
		// code for handling the data from the API
		return response.json() // data into json
	})
	.then(function (data){
		//console.log(data);
		//show all genre options on side bar
		for (let i = 0; i < data.genres.length; i++){
			document.getElementById("GenresList").innerHTML += `<li onclick="GenreSearch(this)" class='GenreItem' id='${data.genres[i].id}' >
																	<a href="#FullSearch">${data.genres[i].name}</a>
																</li>`;
		}
		
	})
	.catch(function (error) {
		// if the server returns any errors
		console.log(error)
	});

//variable to save results for genre search
let GenreMovies = "";

// function showing results for genre search
function GenreSearch(genre){
	//get id for genre item selected
	let genreId = genre.id;
	//use fetch to retrieve data from api
	fetch("https://api.themoviedb.org/3/discover/movie?api_key=" + key + "&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=1&with_genres=" + genreId, {
	  "method": "GET",
	})
	.then(function (response) {
		// code for handling the data from the API
		return response.json() // data into json
	})
	.then(function (data){
		//save results for genre search
		GenreMovies = data;
		//show all search results for selected genre
		//show full search div
		document.getElementById("FullSearchDiv").style.display = "flex";
		//search results to push to full search div
		let searchResults = ``;
		//show all search results from genre search
		for (let i = 0; i < data.results.length; i++){
		//if search item has no movie image/poster
		if (data.results[i].poster_path === null){
			searchResults +=   `<div class='FullSearchItem' id='${i}' onclick='DisplayGenreMovie(this);'>
									<a href="TopPage">
										<img class='FullSearchImg' src='images/noImage.png' />	
										<div class='FullSearchText'>
											<h1>${data.results[i].title}</h1>
											<h3>${data.results[i].release_date.substring(0,4)}</h3>
										</div>
									</a>
								</div>`;
		}
		//if search item has movie image or poster
		else{
			searchResults +=   `<div class='FullSearchItem' id='${i}' onclick='DisplayGenreMovie(this);'>
									<a href="#PageTop">
										<img class='FullSearchImg' src='${imagePath + data.results[i].poster_path}' />	
										<div class='FullSearchText'>
											<h1>${data.results[i].title}</h1>
											<h3>${data.results[i].release_date.substring(0,4)}</h3>
									 	</div>
									</a>
								</div>`;
		}
	}

	//add search items to full search
	document.getElementById("FullSearchResults").innerHTML = searchResults;
	//change heading to selected genre
	document.getElementById("FullSearchHeading").innerHTML = `All Results: ${genre.innerText}`;
	//hide page buttons
	document.getElementById("Pagination").style.display = "none";
		
	})
	.catch(function (error) {
		// if the server returns any errors
		console.log(error)
	});
}

//function to display movie info if selected from genre search
function DisplayGenreMovie(item){
	//get number of movie
	let GenMovieId = item.id;
	//clear current movie
	document.getElementById("CurrentMovie").innerHTML = `
                <!-- Header -->
                <div id="Header" class="fixed-top">
                    <!-- Logo -->
                    <div id="Logo">
                        <h1 class="heading">the movie</h1>
                        <img src="images/logo.png" />
                        <h1 class="heading">search box</h1>
                    </div>
                    <!-- Search Div -->
                    <div id="SearchDiv">
                        <input type="text" name="SearchInput" id="SearchInput" placeholder="Search Movie Title" oninput="QuickSearch();" />
                        <button id="SearchButton">
                            <img src="images/search.svg" />
                        </button>
                    </div>
                </div>

                <!-- Quick Search Box -->
                <div id="QuickSearchDiv">
                    <div id="QuickSearchBox"></div>
                </div>`;
    //display movie info
    //if movie has poster image and backdrop
    if (GenreMovies.results[GenMovieId].poster_path && GenreMovies.results[GenMovieId].backdrop_path){
    	document.getElementById("CurrentMovie").innerHTML += `<img id="CurrentBg" src='${imagePath + GenreMovies.results[GenMovieId].backdrop_path}' />
															  <div id="MovieInfo">
															  	<div id="MovieText">
															  		<h4>You Searched:</h4>
															  		<h1 class='heading'>${GenreMovies.results[GenMovieId].title}</h1>
														 			<h2>${GenreMovies.results[GenMovieId].release_date}</h2>
														 			<h3>${GenreMovies.results[GenMovieId].overview}</h3>
															  	</div>
															  	<img id='CurrentMovieImg' src='${imagePath + GenreMovies.results[GenMovieId].poster_path}' />
															  </div>
															  `;
    }
    //if movie has only poster image
    else if (GenreMovies.results[GenMovieId].poster_path){
    	document.getElementById("CurrentMovie").innerHTML += `
															  <div id="MovieInfo">
															  	<div id="MovieText">
															  		<h4>You Searched:</h4>
															  		<h1 class='heading'>${GenreMovies.results[GenMovieId].title}</h1>
														 			<h2>${GenreMovies.results[GenMovieId].release_date}</h2>
														 			<h3>${GenreMovies.results[GenMovieId].overview}</h3>
															  	</div>
															  	<img id='CurrentMovieImg' src='${imagePath + GenreMovies.results[GenMovieId].poster_path}' />
															  </div>
															  `;
    }
    //if movie has only backdrop image
    else if (GenreMovies.results[GenMovieId].backdrop_path){
    	document.getElementById("CurrentMovie").innerHTML += `<img id="CurrentBg" src='${imagePath + GenreMovies.results[GenMovieId].backdrop_path}' />
															  <div id="MovieInfo">
															  	<div id="MovieText">
															  		<h4>You Searched:</h4>
															  		<h1 class='heading'>${GenreMovies.results[GenMovieId].title}</h1>
														 			<h2>${GenreMovies.results[GenMovieId].release_date}</h2>
														 			<h3>${GenreMovies.results[GenMovieId].overview}</h3>
															  	</div>
															  	<img id='CurrentMovieImg' src='images/noImg.png' />
															  </div>
															  `;
    }
    //if movie has no images
    else{
    	document.getElementById("CurrentMovie").innerHTML += `
															  <div id="MovieInfo">
															  	<div id="MovieText">
															  		<h4>You Searched:</h4>
															  		<h1 class='heading'>${GenreMovies.results[GenMovieId].title}</h1>
														 			<h2>${GenreMovies.results[GenMovieId].release_date}</h2>
														 			<h3>${GenreMovies.results[GenMovieId].overview}</h3>
															  	</div>
															  	<img id='CurrentMovieImg' src='images/noImg.png' />
															  </div>
															  `;
    }
}

//varaible to track which page of results is displayed
let pageNo = 1;

//next search button
function NextSearch(){
	//increase page no
	pageNo++;
	//display page number
	document.getElementById("PageNumber").innerHTML = `Page ${pageNo}`;
	//use fetch to retrieve data from api
		fetch("https://api.themoviedb.org/3/search/movie?api_key=" + key + "&language=en-US&query=" + userSearch + "&page=" + pageNo + "&include_adult=false", {
			"method": "GET",
		})
		.then(function (response) {
			// code for handling the data from the API
			return response.json() // data into json
		})
		.then(function (data){
			//save data to variable
			movieData = data;
			//console.log(data)
			let searchResults = "";
	//show all search results from current page
	for (let i = 0; i < movieData.results.length; i++){
		//if search item has no movie image/poster
		if (movieData.results[i].poster_path === null && movieData.results[i].release_date){
			searchResults +=   `<div class='FullSearchItem' id='${i}' onclick='DisplayMovie(this);'>
									<a href="#PageTop">
										<img class='FullSearchImg' src='images/noImage.png' />	
										<div class='FullSearchText'>
											<h1>${movieData.results[i].title}</h1>
											<h3>${movieData.results[i].release_date.substring(0,4)}</h3>
										</div>
									</a>
								</div>`;
		}
		//if search item has movie image or poster
		else if (movieData.results[i].release_date){
			searchResults +=   `<div class='FullSearchItem' id='${i}' onclick='DisplayMovie(this);'>
									<a href="#PageTop">
										<img class='FullSearchImg' src='${imagePath + movieData.results[i].poster_path}' />	
										<div class='FullSearchText'>
											<h1>${movieData.results[i].title}</h1>
											<h3>${movieData.results[i].release_date.substring(0,4)}</h3>
										</div>
									</a>
								</div>`;
		}
	}

	//add search items to full search
	document.getElementById("FullSearchResults").innerHTML = searchResults;
		})
		.catch(function (error) {
			// if the server returns any errors
			console.log(error)
		});
}

//previous search button
function PreviousSearch(){
	//only do previous search if current page is greater than page 1
	if (pageNo > 1){
	//decrease page no
	pageNo--;
	//display page number
	document.getElementById("PageNumber").innerHTML = `Page ${pageNo}`;
	//use fetch to retrieve data from api
		fetch("https://api.themoviedb.org/3/search/movie?api_key=" + key + "&language=en-US&query=" + userSearch + "&page=" + pageNo + "&include_adult=false", {
			"method": "GET",
		})
		.then(function (response) {
			// code for handling the data from the API
			return response.json() // data into json
		})
		.then(function (data){
			//save data to variable
			movieData = data;
			//console.log(data)
			let searchResults = "";
	//show all search results from current page
	for (let i = 0; i < movieData.results.length; i++){
		//if search item has no movie image/poster
		if (movieData.results[i].poster_path === null && movieData.results[i].release_date){
			searchResults +=   `<div class='FullSearchItem' id='${i}' onclick='DisplayMovie(this);'>
									<a href="#PageTop">
										<img class='FullSearchImg' src='images/noImage.png' />	
										<div class='FullSearchText'>
											<h1>${movieData.results[i].title}</h1>
											<h3>${movieData.results[i].release_date.substring(0,4)}</h3>
										</div>
									</a>
								</div>`;
		}
		//if search item has movie image or poster
		else if (movieData.results[i].release_date){
			searchResults +=   `<div class='FullSearchItem' id='${i}' onclick='DisplayMovie(this);'>
									<a href="#PageTop">
										<img class='FullSearchImg' src='${imagePath + movieData.results[i].poster_path}' />	
										<div class='FullSearchText'>
											<h1>${movieData.results[i].title}</h1>
											<h3>${movieData.results[i].release_date.substring(0,4)}</h3>
										</div>
									</a>
								</div>`;
		}
	}
	//add search items to full search
	document.getElementById("FullSearchResults").innerHTML = searchResults;
		})
		.catch(function (error) {
			// if the server returns any errors
			console.log(error)
		});
	}
}
