import { List } from "@raycast/api"

import {
  AllScriptCommandsDropdownSection,
  CategoriesDropdownSection,
  LanguageDropdownSection,
  StatusDropdownSection,
} from "@components"
import { TextConstants } from "@constants"
import { valueForBasicFilterKind } from "@helpers"
import { useDataManager } from "@hooks"
import { Filter } from "@types"

type Props = {
  onFilter: (filter: Filter) => void
}

export function FilterDropdown({ onFilter }: Props): JSX.Element {
  const { dataManager } = useDataManager()

  const hasNeedSetup = dataManager.hasNeedSetupCommands()
  const hasInstalled = dataManager.hasInstalledCommands()

  return (
    <List.Dropdown
      tooltip={TextConstants.Filter.SelectAFilter}
      storeValue={true}
      defaultValue={valueForBasicFilterKind}
      onChange={value => onFilter(value)}>
      <AllScriptCommandsDropdownSection />
      {(hasNeedSetup || hasInstalled) && (
        <StatusDropdownSection
          hasNeedSetup={hasNeedSetup}
          hasInstalled={hasInstalled}
        />
      )}
      <LanguageDropdownSection languages={dataManager.fetchLanguages()} />
      <CategoriesDropdownSection categories={dataManager.fecthCategories()} />
    </List.Dropdown>
  )
}
