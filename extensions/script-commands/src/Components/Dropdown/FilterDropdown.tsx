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
  
  const languages = dataManager.fetchLanguages()
  const categories = dataManager.fecthCategories()
  const totalScriptCommands = dataManager.totalScriptCommands

  return (
    <List.Dropdown
      tooltip={TextConstants.Filter.SelectAFilter}
      storeValue={true}
      defaultValue={valueForBasicFilterKind}
      onChange={value => onFilter(value)}>
      <AllScriptCommandsDropdownSection total={totalScriptCommands} />
      {(hasNeedSetup || hasInstalled) && (
        <StatusDropdownSection
          hasNeedSetup={hasNeedSetup}
          hasInstalled={hasInstalled}
        />
      )}
      <LanguageDropdownSection languages={languages} />
      <CategoriesDropdownSection categories={categories} />
    </List.Dropdown>
  )
}
