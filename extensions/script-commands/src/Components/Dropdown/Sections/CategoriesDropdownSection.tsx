import { List } from "@raycast/api"

import { TextConstants } from "@constants"
import { valueForFilterKind } from "@helpers"
import { CompactGroup } from "@models"
import { FilterKind } from "@types"

type Props = {
  categories: CompactGroup[]
}

export function CategoriesDropdownSection({ categories }: Props): JSX.Element {
  return (
    <List.Dropdown.Section title={TextConstants.Filter.Categories}>
      {categories.map(group => {
        const padding = "    "
        const subgroupTitle = padding + group.title
        const title = group.subtitle !== undefined ? subgroupTitle : group.title
        const value = valueForFilterKind(FilterKind.Category, group.path)

        return (
          <List.Dropdown.Item
            key={group.identifier}
            title={title}
            value={value}
          />
        )
      })}
    </List.Dropdown.Section>
  )
}
