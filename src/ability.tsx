import abilities from "./statics/abilities.json";
import groupBy from "lodash.groupby";
import { List } from "@raycast/api";

const geneartions = groupBy(abilities, "generation");

export default function Ability() {
  return (
    <List throttle>
      {Object.entries(geneartions).map(([generation, abilities]) => {
        return (
          <List.Section key={generation} title={generation}>
            {abilities.map((ability) => {
              return (
                <List.Item
                  key={ability.ability_name}
                  title={ability.ability_name}
                  subtitle={ability.short_effect}
                />
              );
            })}
          </List.Section>
        );
      })}
    </List>
  );
}
