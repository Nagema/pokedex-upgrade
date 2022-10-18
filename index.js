const container = document.querySelector(".container");
const pokemonSearch = document.createElement("input");
pokemonSearch.type = "search";
pokemonSearch.placeholder = "Search";
pokemonSearch.className = "input-search";
const pokemonsList = document.createElement("ul");
pokemonsList.className = "pokedex";
container.append(pokemonSearch);
container.append(pokemonsList);

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
  .then((pokemons) => {
    showPokemonsList(pokemons);
    setPokemonFilter(pokemons);
  });

const setPokemonFilter = (pokemons) => {
  pokemonSearch.addEventListener("keyup", (e) => {
    let searchText = e.target.value;
    const filteredPokemons = pokemons.filter((poke) => {
      return poke.name.includes(searchText);
    });
    showPokemonsList(filteredPokemons);
  });
};

showPokemonsList = (pokemons) => {
  pokemonsList.innerHTML = "";
  pokemons.forEach((pokemon) => {
    const pokemonElement = document.createElement("li");
    const pokemonBox = document.createElement("div");
    const pokemonTitle = document.createElement("h2");
    const pokemonImage = document.createElement("img");
    pokemonImage.setAttribute("src", pokemon.sprites.front_default);
    const imageToggle = () => {
      pokemonImage.src === pokemon.sprites.front_default
        ? (pokemonImage.src = pokemon.sprites.back_default)
        : (pokemonImage.src = pokemon.sprites.front_default);
    };
    pokemonImage.addEventListener("click", imageToggle);
    pokemonTitle.innerText = pokemon.name;
    pokemonsList.append(pokemonElement);
    pokemonElement.append(pokemonBox);
    pokemonBox.append(pokemonTitle);
    pokemonBox.append(pokemonImage);
  });
};
