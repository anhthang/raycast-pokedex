export type PokeAPI = {
  data: Data;
}

export type Data = {
  pokemon_v2_pokemon: PokemonV2Pokemon[];
}

export type PokemonV2Pokemon = {
  id:                          number;
  name:                        string;
  height:                      number;
  weight:                      number;
  pokemon_v2_pokemonabilities: PokemonV2Pokemonability[];
  pokemon_v2_pokemontypes:     PokemonV2Pokemontype[];
  pokemon_v2_pokemonspecy:     PokemonV2Pokemonspecy;
}

type PokemonV2Pokemonability = {
  is_hidden:          boolean;
  pokemon_v2_ability: PokemonV2Ability;
}

type PokemonV2Ability = {
  pokemon_v2_abilitynames: PokemonV2Name[];
}

type PokemonV2Name = {
  name: string;
}

type PokemonV2Pokemonspecy = {
  is_mythical:                          boolean;
  is_legendary:                         boolean;
  is_baby:                              boolean;
  pokemon_v2_pokemonspeciesnames:       PokemonV2Name[];
  pokemon_v2_pokemonspeciesflavortexts: PokemonV2Pokemonspeciesflavortext[];
}

type PokemonV2Pokemonspeciesflavortext = {
  flavor_text:        string;
  pokemon_v2_version: PokemonV2Version;
}

type PokemonV2Version = {
  id:                      number;
  name:                    string;
  pokemon_v2_versionnames: PokemonV2Name[];
}

type PokemonV2Pokemontype = {
  pokemon_v2_type: PokemonV2Type;
}

type PokemonV2Type = {
  pokemon_v2_typenames: PokemonV2Name[];
}
