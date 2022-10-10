const pokemons = fetch("https://pokeapi.co/api/v2/pokemon/")
  .then((response) => response.json())
  .then((data) => {
    const promises = data.results.map(async (pokeItem) => {
      const response = await fetch(pokeItem.url);
      const pokemon = await response.json();
      return pokemon;
    });
    return Promise.all(promises);
  })
  .then((pokemonsListInfo) => {
    showPokemonsList(pokemonsListInfo);
  });

showPokemonsList = (pokemons) => {
  const pokemonsList = document.querySelector("#pokedex");
  pokemons.forEach((pokemon) => {
    const pokemonElement = document.createElement("li");
    const pokemonBox = document.createElement("div");
    const pokemonTitle = document.createElement("h2");
    const pokemonImage = document.createElement("img");

    pokemonImage.setAttribute("src", pokemon.sprites.front_default);
    pokemonTitle.innerText = pokemon.name;
    pokemonsList.append(pokemonElement);
    pokemonElement.append(pokemonBox);
    pokemonBox.append(pokemonTitle);
    pokemonBox.append(pokemonImage);
  });
};
