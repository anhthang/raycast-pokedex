import moves from "./statics/moves.json";
import groupBy from "lodash.groupby";
import { List } from "@raycast/api";

const geneartions = groupBy(moves, "generation");

export default function Move() {
  return (
    <List throttle>
      {Object.entries(geneartions).map(([generation, moves]) => {
        return (
          <List.Section key={generation} title={generation}>
            {moves.map((move, idx) => {
              return (
                <List.Item
                  key={idx}
                  title={move.name}
                  subtitle={move.short_effect}
                  icon={`moves/${move.damage_class || "status"}.png`}
                  accessoryTitle={move.type}
                  accessoryIcon={`types/${move.type}.png`}
                />
              );
            })}
          </List.Section>
        );
      })}
    </List>
  );
}
