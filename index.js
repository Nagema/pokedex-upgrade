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
const typeList = document.createElement("ul");
const pokemonsList = document.createElement("ul");

pokemonSearch.type = "search";
pokemonSearch.placeholder = "Search";
pokemonSearch.className = "input-search";
typeList.className = "type-list";
pokemonsList.className = "pokedex";

container.appendChild(pokemonSearch);
container.appendChild(typeList);
container.appendChild(pokemonsList);

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
      return poke.name.includes(searchText.toLowerCase());
    });
    showPokemonsList(filteredPokemons);
  });
};

const filterTypes = (pokemons) => {
  const pokeTypes = pokemons.map((pokemon) => pokemon.types).flat();
  let pokemonType = [];
  for (let index = 0; index < pokeTypes.length; index++) {
    const element = pokeTypes[index];

    if (!pokemonType.includes(element.type.name)) {
      pokemonType.push(element.type.name);
      const pokeType = document.createElement("li");
      pokeType.className = "pokemon-type";
      pokeType.id = element.type.name;
      typeList.appendChild(pokeType);
      pokeType.addEventListener("click", function (e) {
        const filterByType = pokemons.filter((pokeType) => {
          let pokeTypeElement = "";
          for (const types of pokeType.types) {
            pokeTypeElement = types.type;
          }
          return pokeTypeElement.name.includes(e.target.id);
        });
        showPokemonsList(filterByType);
      });

      for (const color of colours) {
        pokeType.style.border = "solid";
        pokeType.style.borderColor = color[element.type.name];
        pokeType.style.background = color[element.type.name];
      }
    }
  }
};

showPokemonsList = (pokemons) => {
  typeList.innerHTML = "";
  pokemonsList.innerHTML = "";
  filterTypes(pokemons);

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

    pokemonTitle.textContent = pokemon.name;
    pokemonImage.addEventListener("click", imageToggle);
    pokemonsList.appendChild(pokemonElement);
    pokemonElement.appendChild(pokemonBox);
    pokemonBox.appendChild(pokemonTitle);
    pokemonBox.appendChild(pokemonImage);

    const pokemonBadgeList = document.createElement("ul");
    pokemonBadgeList.className = "pokemon-badge-list";

    for (const type of pokemon.types) {
      const pokemonBadge = document.createElement("li");
      pokemonBadge.textContent = type.type.name;

      pokemonBox.appendChild(pokemonBadgeList);
      pokemonBadgeList.appendChild(pokemonBadge);

      for (const color of colours) {
        pokemonBadge.style.background = color[type.type.name];
      }
    }
  });
};
