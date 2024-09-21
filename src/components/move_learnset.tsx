import { Grid } from "@raycast/api";
import groupBy from "lodash.groupby";
import { PokemonV2Move } from "../types";
import { getOfficialArtworkImg, nationalDexNumber } from "../utils";

export default function MoveLearnset(props: { moves: PokemonV2Move[] }) {
  const learnset = groupBy(
    props.moves,
    (m) => m.pokemon_v2_movelearnmethod.pokemon_v2_movelearnmethodnames[0].name,
  );

  return (
    <Grid throttle columns={6}>
      {Object.entries(learnset).map(([method, pokemons]) => {
        return (
          <Grid.Section title={method} key={method}>
            {pokemons.map((pokemon) => {
              return (
                <Grid.Item
                  key={pokemon.pokemon_id}
                  content={getOfficialArtworkImg(pokemon.pokemon_id)}
                  title={
                    pokemon.pokemon_v2_pokemon.pokemon_v2_pokemonspecy
                      .pokemon_v2_pokemonspeciesnames[0].name
                  }
                  subtitle={nationalDexNumber(pokemon.pokemon_id)}
                />
              );
            })}
          </Grid.Section>
        );
      })}
    </Grid>
  );
}
