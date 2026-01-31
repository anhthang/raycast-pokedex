import { Icon, List } from "@raycast/api";
import { TypeChartType } from "../types";

export function TypeDetail({
  type,
  allTypes,
}: {
  type: TypeChartType;
  allTypes: TypeChartType[];
}) {
  // Use the localized name if available
  const typeName = type.typenames[0]?.name || type.name;

  // OFFENSE: When this type attacks others
  const attacking = {
    superEffective: [] as string[],
    neutral: [] as string[],
    notVeryEffective: [] as string[],
    noEffect: [] as string[],
  };

  const efficacyMap = new Map();
  type.typeefficacies.forEach((eff) => {
    efficacyMap.set(eff.target_type_id, eff.damage_factor);
  });

  allTypes.forEach((target) => {
    if (target.id >= 10000) return;
    const factor = efficacyMap.has(target.id)
      ? efficacyMap.get(target.id)
      : 100;
    const targetName = target.typenames[0]?.name || target.name;

    if (factor === 200) attacking.superEffective.push(targetName);
    else if (factor === 100) attacking.neutral.push(targetName);
    else if (factor === 50) attacking.notVeryEffective.push(targetName);
    else if (factor === 0) attacking.noEffect.push(targetName);
  });

  // DEFENSE: When this type is hit by others
  const defending = {
    weakTo: [] as string[],
    neutral: [] as string[],
    resistantTo: [] as string[],
    immuneTo: [] as string[],
  };

  allTypes.forEach((attacker) => {
    if (attacker.id >= 10000) return;
    const attackerName = attacker.typenames[0]?.name || attacker.name;

    const eff = attacker.typeefficacies.find(
      (e) => e.target_type_id === type.id,
    );
    const factor = eff ? eff.damage_factor : 100;

    if (factor === 200) defending.weakTo.push(attackerName);
    else if (factor === 100) defending.neutral.push(attackerName);
    else if (factor === 50) defending.resistantTo.push(attackerName);
    else if (factor === 0) defending.immuneTo.push(attackerName);
  });

  return (
    <List navigationTitle={`${typeName} | Type Chart`}>
      <List.Section
        title="Attacking"
        subtitle="Effectiveness when this type attacks others"
      >
        <List.Item
          title="Super Effective"
          icon={Icon.ChevronUp}
          subtitle="2x"
          accessories={attacking.superEffective.map((text) => ({
            tooltip: text,
            icon: `types/${text.toLowerCase()}.svg`,
          }))}
        />
        <List.Item
          title="Neutral"
          icon={Icon.CircleFilled}
          subtitle="1x"
          accessories={attacking.neutral.map((text) => ({
            tooltip: text,
            icon: `types/${text.toLowerCase()}.svg`,
          }))}
        />
        <List.Item
          title="Not Very Effective"
          icon={Icon.CircleProgress50}
          subtitle="0.5x"
          accessories={attacking.notVeryEffective.map((text) => ({
            tooltip: text,
            icon: `types/${text.toLowerCase()}.svg`,
          }))}
        />
        <List.Item
          title="No Effect"
          icon={Icon.XMarkCircle}
          subtitle="0x"
          accessories={attacking.noEffect.map((text) => ({
            tooltip: text,
            icon: `types/${text.toLowerCase()}.svg`,
          }))}
        />
      </List.Section>
      <List.Section
        title="Defending"
        subtitle="Effectiveness when this type is hit by others"
      >
        <List.Item
          title="Weak To"
          icon={Icon.ChevronUp}
          subtitle="2x"
          accessories={defending.weakTo.map((text) => ({
            tooltip: text,
            icon: `types/${text.toLowerCase()}.svg`,
          }))}
        />
        <List.Item
          title="Neutral"
          icon={Icon.CircleFilled}
          subtitle="1x"
          accessories={defending.neutral.map((text) => ({
            tooltip: text,
            icon: `types/${text.toLowerCase()}.svg`,
          }))}
        />
        <List.Item
          title="Resistant To"
          icon={Icon.CircleProgress50}
          subtitle="0.5x"
          accessories={defending.resistantTo.map((text) => ({
            tooltip: text,
            icon: `types/${text.toLowerCase()}.svg`,
          }))}
        />
        <List.Item
          title="Immune To"
          icon={Icon.XMarkCircle}
          subtitle="0x"
          accessories={defending.immuneTo.map((text) => ({
            tooltip: text,
            icon: `types/${text.toLowerCase()}.svg`,
          }))}
        />
      </List.Section>
    </List>
  );
}
