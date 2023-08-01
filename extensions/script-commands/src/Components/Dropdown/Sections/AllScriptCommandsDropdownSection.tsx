import { nanoid } from "nanoid"
import { List } from "@raycast/api"

import { IconConstants, TextConstants } from "@constants"
import { valueForBasicFilterKind } from "@helpers"

type Props = {
  total: number
}

export function AllScriptCommandsDropdownSection({
  total,
}: Props): JSX.Element {
  let totalDescription = ""

  if (total > 0) {
    totalDescription = ` (${total})`
  }

  return (
    <List.Dropdown.Section>
      <List.Dropdown.Item
        key={nanoid()}
        title={TextConstants.Filter.All + totalDescription}
        value={valueForBasicFilterKind}
        icon={IconConstants.All}
      />
    </List.Dropdown.Section>
  )
}
