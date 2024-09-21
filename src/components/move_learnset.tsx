import { Action, ActionPanel, Grid, Icon } from "@raycast/api";
import groupBy from "lodash.groupby";
import { PokemonV2Move } from "../types";
import { getContentImg, nationalDexNumber } from "../utils";
import PokeProfile from "./profile";

export default function MoveLearnset(props: {
  name: string;
  moves: PokemonV2Move[];
}) {
  const learnset = groupBy(
    props.moves,
    (m) => m.pokemon_v2_movelearnmethod.pokemon_v2_movelearnmethodnames[0].name,
  );

  return (
    <Grid throttle columns={6} navigationTitle={`${props.name} | Learnset`}>
      {Object.entries(learnset).map(([method, pokemons]) => {
        return (
          <Grid.Section title={method} key={method}>
            {pokemons.map((pokemon) => {
              return (
                <Grid.Item
                  key={pokemon.pokemon_id}
                  content={getContentImg(pokemon.pokemon_id)}
                  title={
                    pokemon.pokemon_v2_pokemon.pokemon_v2_pokemonspecy
                      .pokemon_v2_pokemonspeciesnames[0].name
                  }
                  subtitle={nationalDexNumber(pokemon.pokemon_id)}
                  actions={
                    <ActionPanel>
                      <ActionPanel.Section title="Information">
                        <Action.Push
                          title="Pokémon Profile"
                          icon={Icon.Sidebar}
                          target={<PokeProfile id={pokemon.pokemon_id} />}
                        />
                      </ActionPanel.Section>
                    </ActionPanel>
                  }
                />
              );
            })}
          </Grid.Section>
        );
      })}
    </Grid>
  );
}
