

//My empty NameSpaceeee
var pokemon = {};

pokemon.init = function(){
	pokemon.getSelection();
	pokemon.events();
}

pokemon.events = function() {
	let newPokemon = $('.newPokemon').on('click', function(){
		//this will scroll to the top
		$('html, body').animate({
			scrollTop: $('header').offset().top},
			1000);
		//all this is to make the intro form to come back and empty the old pokemon.
		//the score is added on to in this one.
		$('.battleArea').addClass('hidden');
		$('.outcome').addClass('hidden');
		$('.introForm').removeClass('hidden fadeOutDown');
		$('footer').removeClass('hidden');
		$('.introForm').addClass('fadeInUp');
		$('.userPokemon').empty();
		$('.computerPokemon').empty();
	});
	let nextOpponent = $('.newOpponent').on('click', function(){
		//this will generate a new computer pokemon while keeping score.
		pokemon.getCards();
		$('.outcome').addClass('hidden');
	});
	let resetGame = $('.reset').on('click', function(){
		//this will scroll to the top.
		$('html, body').animate({
			scrollTop: $('header').offset().top},
			1000);
		//this is to allow user to pick a new pokemon and empty the old containers.
		$('.battleArea').addClass('hidden');
		$('.outcome').addClass('hidden');
		$('.introForm').removeClass('hidden fadeOutDown');
		$('footer').removeClass('hidden');
		$('.introForm').addClass('fadeInUp');
		$('.userPokemon').empty();
		$('.computerPokemon').empty();
		//this is to reset the score back to zero.
		pokemon.totals.user = 0;
		pokemon.totals.computer = 0;
	});
}

//this is the object to keep the score totals!
pokemon.totals = {
	user: 0,
	computer: 0
}


//When user submits their pokemon this is going to grab that information.
pokemon.getSelection = function(){
	$('.choosePokemon').on('submit', function(e){
		e.preventDefault();
		let userPokemon = $('.pokemon').val();
		//This is to Clear the input section
		if (userPokemon !== ''){
			$('.pokemon').val('');

		}
		//this is going to pass the users pokemon choice into into the get cards function.	
		pokemon.userPokemon = userPokemon;
		pokemon.getCards();
	});
}

 
//This is the API Key to call the users POKEMON CHOICE.
pokemon.getCards = function(){
	$.ajax({
		url: 'https://api.pokemontcg.io/v1/cards?supertype=pokemon&name=' + pokemon.userPokemon,
		method: 'GET',
		dataType: 'json'
	}).then(function(cards){
		//This pulls the card data for the users choice aka all the options.
		let cardData = cards.cards;
		//If there is no pokemon or the pokemon name is wrong a prompt with be there.
		if (cardData.length === 0){
			alert("That's not a Pokemon Dumb Dumb");
			//This is to stop computer cards to pile up. No pun intended.
			location.reload();
		}
		else {
			//This will hide the submit form and add the container for the image to load.
			$('.introForm').addClass('fadeOutDown hidden');
			$('.introForm').addClass('hidden');
			$('footer').addClass('hidden');
			$('.battleArea').removeClass('hidden');
			$('html, body').animate({
				scrollTop: $('.battleArea').offset().top},
				1000);
		}
		//This is the Randomizer I need for the user.
		let usersCard = pokemon.userRandomizer(cardData);
		//This is the return Ajax comptuerChoice.
		pokemon.randomSelection().then(function(computersCards){
			//this is will be the random computer cards function.
			console.log(computersCards);							
			compCard = pokemon.userRandomizer(computersCards.cards);
			//This is to the get the card printed.
			pokemon.displayRandomCard(compCard);
			// pokemon.anotherOpponent(compCard);
			//This will determine the HP between the two cards.
			pokemon.determineWinner(usersCard, compCard);
		})
		//This is to pass the Users card to be printed.
		pokemon.displayUserPokemon(usersCard);
	});
}

//Will have to randomize the card choice from the api of the pokemon that has been selected.
pokemon.userRandomizer = function(card){
	//Randomizer for the card length.
	let randomCard = card[Math.floor(Math.random() * card.length)];
	return randomCard;
}

//This will append and post the user's pokemon card to the page.
pokemon.displayUserPokemon = function (usersCard){
	//Need to create the img tag for the users random pokemon card. 
	let userImg = $('<img>').attr('src', usersCard.imageUrlHiRes);
	//This will append the card url to .userPokemon div
	setTimeout(function(){
		$('.userPokemon').empty();
		$('.userPokemon').append(userImg);
		userImg.addClass('animated fadeInUp');
	}, 2000);

}



//COMPUTER CARDDDDDDD

//A second API needs to be set for the second random 
pokemon.randomSelection = function(){
	 return $.ajax({
		url: 'https://api.pokemontcg.io/v1/cards?page=5&pageSize=1000&supertype=pokemon',
		method: 'GET',
		dataType: 'json'
	})
}



//This is to display the Random Generated Card.
pokemon.displayRandomCard = function (computerCard){
	// $('.computerPokemon button').on('click', function(){
		let compImg = $('<img>').attr('src', computerCard.imageUrlHiRes);
		setTimeout(function(){
			$('.computerPokemon').empty();
			$('.computerPokemon').append(compImg);
			compImg.addClass('pokeComp animated fadeInDown')
		}, 2000)
	// })
}
	 
//Winner is determined by which HP is higher (HAHAHAHAHAHAHA).
//This is to determine the winner of the thing!
pokemon.determineWinner = function (playersCard, computersCard){
	let player = parseInt(playersCard.hp);
	let computer = parseInt(computersCard.hp);
	// let winner = $('.computerButton').on('click', function(){
		//This is what will determine the winner
	$('img.pokeComp').ready(function(){
		if (player > computer) {
			//here is a settimeout to delay the display of the winner
			setTimeout(function(){
				$('.outcome').removeClass('hidden');
				$('.outcome').addClass('animated fadeIn outcomeBox');
				$('.outcome h3').text("You have Won")
				//this adds to users score total!
				pokemon.totals.user = pokemon.totals.user + 1;
				$('.user p').text(pokemon.totals.user);
				$('.computer p').text(pokemon.totals.computer);
			}, 3500);
		}
		else if (player === computer){
			setTimeout(function(){
				$('.outcome').removeClass('hidden');
				$('.outcome').addClass('animated fadeIn outcomeBox');
				$('.outcome h3').text("You Have Tied");
				$('.user p').text(pokemon.totals.user);
				$('.computer p').text(pokemon.totals.computer);
			}, 3500);
		}
		else {
			setTimeout(function(){
				$('.outcome').removeClass('hidden');
				$('.outcome').addClass('animated fadeIn outcomeBox');
				$('.outcome h3').text("You Have Lost");
				//this adds to the computers score total!
				pokemon.totals.computer = pokemon.totals.computer + 1;
				$('.user p').text(pokemon.totals.user);
				$('.computer p').text(pokemon.totals.computer);
			}, 3500);
		}
	});
}


$(function(){
	pokemon.init();
});

