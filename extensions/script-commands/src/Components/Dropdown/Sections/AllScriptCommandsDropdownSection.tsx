import { nanoid } from "nanoid"
import { List } from "@raycast/api"

import { TextConstants } from "@constants"
import { valueForBasicFilterKind } from "@helpers"

export function AllScriptCommandsDropdownSection(): JSX.Element {
  return (
    <List.Dropdown.Section>
      <List.Dropdown.Item
        key={nanoid()}
        title={TextConstants.Filter.All}
        value={valueForBasicFilterKind}
      />
    </List.Dropdown.Section>
  )
}
