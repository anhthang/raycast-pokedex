import axios, { AxiosRequestConfig } from "axios";
import { showToast, ToastStyle } from "@raycast/api";
import type { PokemonV2Pokemon } from "../types";

export const getPokemon = async (nameOrId: string | number): Promise<PokemonV2Pokemon[]> => {
  const data = JSON.stringify({
    query: `query pokeAPI {
      pokemon_v2_pokemon(where: {id: {_eq: ${nameOrId}}}) {
        id
        name
        height
        weight
        pokemon_v2_pokemonabilities(where: {pokemon_id: {_eq: ${nameOrId}}}) {
          is_hidden
          pokemon_v2_ability {
            pokemon_v2_abilitynames(where: {language_id: {_eq: 9}}) {
              name
            }
          }
        }
        pokemon_v2_pokemontypes(where: {pokemon_id: {_eq: ${nameOrId}}}) {
          pokemon_v2_type {
            pokemon_v2_typenames(where: {language_id: {_eq: 9}}) {
              name
            }
          }
        }
        pokemon_v2_pokemonspecy {
          is_mythical
          is_legendary
          is_baby
          pokemon_v2_pokemonspeciesnames(where: {language_id: {_eq: 9}}) {
            name
          }
          pokemon_v2_pokemonspeciesflavortexts(where: {language_id: {_eq: 9}}) {
            flavor_text
            pokemon_v2_version {
              id
              name
              pokemon_v2_versionnames(where: {language_id: {_eq: 9}}) {
                name
              }
            }
          }
        }
      }
    }`,
        variables: {}
    });

  const config: AxiosRequestConfig = {
    method: 'post',
    url: 'https://beta.pokeapi.co/graphql/v1beta',
    headers: { 
        'Content-Type': 'application/json'
    },
    data
  };

  try {
    const { data } = await axios(config)

    return data.data.pokemon_v2_pokemon;
  } catch (error) {
    showToast(ToastStyle.Failure, "Could not get results")

    return []
  }
}