import { List } from "@raycast/api";
import { usePromise } from "@raycast/utils";
import json2md from "json2md";
import groupBy from "lodash.groupby";
import { useMemo, useState } from "react";
import { fetchItems } from "./api";
import { fixItemEffectText } from "./utils";

export default function PokeItems(props: { arguments: { search?: string } }) {
  const { search } = props.arguments;
  const [pocket, setPocket] = useState<string>("all");

  const { data: items, isLoading } = usePromise(fetchItems);

  const pockets = useMemo(() => {
    return groupBy(
      items,
      (i) =>
        i.itemcategory?.itempocket?.itempocketnames[0]?.name ||
        i.itemcategory?.itempocket?.name ||
        "Unknown Pocket",
    );
  }, [items]);

  const uniquePockets = useMemo(() => {
    return Object.keys(pockets || {}).sort();
  }, [pockets]);

  const filteredPockets = useMemo(() => {
    let filtered = pockets;

    if (pocket !== "all") {
      filtered = { [pocket]: pockets[pocket] };
    }

    if (!search) return filtered;

    const searchFiltered: Record<string, typeof items> = {};
    Object.entries(filtered || {}).forEach(([pocketName, list]) => {
      const filteredList = list.filter((i) =>
        i.name.toLowerCase().includes(search.toLowerCase()),
      );
      if (filteredList.length > 0) {
        searchFiltered[pocketName] = filteredList;
      }
    });
    return searchFiltered;
  }, [items, pockets, pocket, search]);

  return (
    <List
      throttle
      isShowingDetail={true}
      isLoading={isLoading}
      searchBarPlaceholder="Search Items..."
      searchBarAccessory={
        <List.Dropdown
          tooltip="Filter by Pocket"
          value={pocket}
          onChange={setPocket}
        >
          <List.Dropdown.Item title="All Pockets" value="all" />
          {uniquePockets.map((pocketName) => (
            <List.Dropdown.Item
              key={pocketName}
              title={pocketName}
              value={pocketName}
            />
          ))}
        </List.Dropdown>
      }
    >
      {Object.entries(filteredPockets).map(([pocketName, itemList]) => {
        return (
          <List.Section key={pocketName} title={pocketName}>
            {itemList?.map((item) => {
              const itemName = item.itemnames[0]?.name || item.name;
              const itemIcon = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/${item.name}.png`;
              const categoryName =
                item.itemcategory?.itemcategorynames[0]?.name ||
                item.itemcategory?.name ||
                "Unknown Category";

              return (
                <List.Item
                  key={item.name}
                  title={itemName}
                  icon={itemIcon}
                  keywords={[item.name, itemName]}
                  detail={
                    <List.Item.Detail
                      markdown={json2md([
                        {
                          h1: itemName,
                        },
                        {
                          p: fixItemEffectText(
                            item.itemeffecttexts[0]?.effect ||
                              "No description available.",
                          ),
                        },
                      ])}
                      metadata={
                        <List.Item.Detail.Metadata>
                          <List.Item.Detail.Metadata.Label
                            title="Category"
                            text={categoryName}
                          />
                          {item.cost ? (
                            <List.Item.Detail.Metadata.Label
                              title="Price"
                              text={`${item.cost} Poké Dollars`}
                            />
                          ) : null}
                        </List.Item.Detail.Metadata>
                      }
                    />
                  }
                />
              );
            })}
          </List.Section>
        );
      })}
    </List>
  );
}
