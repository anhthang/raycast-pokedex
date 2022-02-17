import axios, { AxiosRequestConfig } from "axios";
import { showToast, Toast, getPreferenceValues } from "@raycast/api";
import { PokemonV2Pokemon } from "../types";

const { language } = getPreferenceValues();

function showFailureToast() {
  showToast(
    Toast.Style.Failure,
    "Something went wrong",
    "Please try again later"
  );
}

export const getPokemon = async (id: number): Promise<PokemonV2Pokemon[]> => {
  const query = JSON.stringify({
    query: `query pokemon($language_id: Int, $pokemon_id: Int) {
      pokemon_v2_pokemon(where: {id: {_eq: $pokemon_id}}) {
        id
        name
        height
        weight
        pokemon_v2_pokemonabilities {
          is_hidden
          pokemon_v2_ability {
            pokemon_v2_abilitynames(where: {language_id: {_eq: $language_id}}) {
              name
            }
          }
        }
        pokemon_v2_pokemonstats {
          base_stat
          pokemon_v2_stat {
            name
            pokemon_v2_statnames(where: {language_id: {_eq: $language_id}}) {
              name
            }
          }
        }
        pokemon_v2_pokemontypes {
          pokemon_v2_type {
            pokemon_v2_typenames(where: {language_id: {_eq: $language_id}}) {
              name
            }
          }
        }
        pokemon_v2_pokemonspecy {
          is_mythical
          is_legendary
          is_baby
          name
          pokemon_v2_evolutionchain {
            pokemon_v2_pokemonspecies(order_by: {order: asc}) {
              id
              name
              pokemon_v2_pokemonspeciesnames(where: {language_id: {_eq: $language_id}}) {
                genus
                name
              }
            }
          }
          pokemon_v2_pokemonspeciesnames(where: {language_id: {_eq: $language_id}}) {
            genus
            name
          }
          pokemon_v2_pokemonspeciesflavortexts(where: {language_id: {_eq: $language_id}}) {
            flavor_text
            pokemon_v2_version {
              id
              name
              pokemon_v2_versionnames(where: {language_id: {_eq: $language_id}}) {
                name
              }
            }
          }
        }
      }
    }`,
    variables: {
      language_id: Number(language),
      pokemon_id: id,
    },
  });

  const config: AxiosRequestConfig = {
    method: "post",
    url: "https://beta.pokeapi.co/graphql/v1beta",
    headers: {
      "Content-Type": "application/json",
    },
    data: query,
    timeout: 10000,
  };

  try {
    const { data } = await axios(config);

    if (Array.isArray(data.errors) && data.errors.length) {
      showFailureToast();

      return [];
    }

    return data.data.pokemon_v2_pokemon;
  } catch (e) {
    showFailureToast();

    return [];
  }
};
