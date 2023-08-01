import { nanoid } from "nanoid"
import { List } from "@raycast/api"

import { descriptionForState, valueForFilterKind } from "@helpers"
import { FilterKind, State } from "@types"
import { IconConstants, StateConstants, TextConstants } from "@constants"

type Props = {
  hasNeedSetup: boolean
  hasInstalled: boolean
}

export function StatusDropdownSection({
  hasNeedSetup,
  hasInstalled,
}: Props): JSX.Element {
  const statusInstalledTitle = descriptionForState(State.Installed)
  const statusInstalledValue = valueForFilterKind(
    FilterKind.Status,
    StateConstants.Installed,
  )

  const statusNeedSetupTitle = descriptionForState(State.NeedSetup)
  const statusNeedSetupValue = valueForFilterKind(
    FilterKind.Status,
    StateConstants.NeedSetup,
  )

  return (
    <List.Dropdown.Section title={TextConstants.Filter.Status}>
      {hasInstalled && (
        <List.Dropdown.Item
          key={nanoid()}
          title={statusInstalledTitle}
          value={statusInstalledValue}
          icon={IconConstants.Installed}
        />
      )}
      {hasNeedSetup && (
        <List.Dropdown.Item
          key={nanoid()}
          title={statusNeedSetupTitle}
          value={statusNeedSetupValue}
          icon={IconConstants.NeedSetup}
        />
      )}
    </List.Dropdown.Section>
  )
}
