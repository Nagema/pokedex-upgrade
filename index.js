const colours = [
  {
    normal: "#A8A77A",
    fire: "#EE8130",
    water: "#6390F0",
    electric: "#F7D02C",
    grass: "#7AC74C",
    ice: "#96D9D6",
    fighting: "#C22E28",
    poison: "#A33EA1",
    ground: "#E2BF65",
    flying: "#A98FF3",
    psychic: "#F95587",
    bug: "#A6B91A",
    rock: "#B6A136",
    ghost: "#735797",
    dragon: "#6F35FC",
    dark: "#705746",
    steel: "#B7B7CE",
    fairy: "#D685AD",
  },
];

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
    pokemonElement.className = "pokedex-box";
    const pokemonBox = document.createElement("div");
    const pokemonTitle = document.createElement("h2");
    const pokemonImage = document.createElement("img");

    pokemonImage.setAttribute(
      "src",
      pokemon.sprites.other.dream_world.front_default
    );

    const imageToggle = () => {
      pokemonImage.src === pokemon.sprites.other.dream_world.front_default
        ? (pokemonImage.src = pokemon.sprites.back_default)
        : (pokemonImage.src = pokemon.sprites.other.dream_world.front_default);
    };
    pokemonImage.addEventListener("click", imageToggle);
    pokemonTitle.innerText = pokemon.name;
    pokemonsList.appendChild(pokemonElement);
    pokemonElement.appendChild(pokemonBox);
    pokemonBox.appendChild(pokemonTitle);
    pokemonBox.appendChild(pokemonImage);

    const pokemonBadgeList = document.createElement("ul");
    pokemonBadgeList.className = "pokemon-badge-list";
    for (const type of pokemon.types) {
      const pokemonBadge = document.createElement("li");
      pokemonBox.appendChild(pokemonBadgeList);
      pokemonBadgeList.appendChild(pokemonBadge);
      pokemonBadge.textContent = type.type.name;
      for (const color of colours) {
        pokemonBadge.style.background = color[type.type.name];
      }
    }
  });
};
