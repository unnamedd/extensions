import { nanoid } from "nanoid"
import { List } from "@raycast/api"

import { IconConstants, StateConstants, TextConstants } from "@constants"
import { descriptionForState, valueForFilterKind } from "@helpers"
import { useDataManager } from "@hooks"
import { CompactGroup, Language } from "@models"
import { Filter, FilterKind, State } from "@types"
import { languageURL } from "@urls"

type Props = {
  onFilter: (filter: Filter) => void
}

export function FilterDropdown({ onFilter }: Props): JSX.Element {
  const { dataManager } = useDataManager()

  return (
    <List.Dropdown
      tooltip={TextConstants.Filter.SelectAFilter}
      storeValue={true}
      defaultValue="all"
      onChange={value => onFilter(value)}>
      <AllScriptCommandsDropdownSection />
      <StatusDropdownSection />
      <LanguageDropdownSection languages={dataManager.fetchLanguages()} />
      <CategoriesDropdownSection categories={dataManager.fecthCategories()} />
    </List.Dropdown>
  )
}

export function AllScriptCommandsDropdownSection(): JSX.Element {
  return (
    <List.Dropdown.Section>
      <List.Dropdown.Item
        key={nanoid()}
        title={TextConstants.Filter.All}
        value={valueForFilterKind(FilterKind.All, "")}
      />
    </List.Dropdown.Section>
  )
}

export function StatusDropdownSection(): JSX.Element {
  const statusInstalledTitle = descriptionForState(State.Installed)
  const statusInstalledValue = valueForFilterKind(
    FilterKind.Status,
    StateConstants.Installed
  )

  const statusNeedSetupTitle = descriptionForState(State.NeedSetup)
  const statusNeedSetupValue = valueForFilterKind(
    FilterKind.Status,
    StateConstants.NeedSetup
  )

  return (
    <List.Dropdown.Section title={TextConstants.Filter.Status}>
      <List.Dropdown.Item
        key={nanoid()}
        title={statusInstalledTitle}
        value={statusInstalledValue}
        icon={IconConstants.Installed}
      />
      <List.Dropdown.Item
        key={nanoid()}
        title={statusNeedSetupTitle}
        value={statusNeedSetupValue}
        icon={IconConstants.NeedSetup}
      />
    </List.Dropdown.Section>
  )
}

type LanguageDropdownSectionProps = {
  languages: Language[]
}

export function LanguageDropdownSection({
  languages,
}: LanguageDropdownSectionProps): JSX.Element {
  return (
    <List.Dropdown.Section title={TextConstants.Filter.Languages}>
      {languages.map(language => (
        <List.Dropdown.Item
          key={nanoid()}
          title={language.displayName}
          value={valueForFilterKind(FilterKind.Language, language.name)}
          icon={languageURL(language.name)}
        />
      ))}
    </List.Dropdown.Section>
  )
}

type CategoriesDropdownSectionProps = {
  categories: CompactGroup[]
}

export function CategoriesDropdownSection({
  categories,
}: CategoriesDropdownSectionProps): JSX.Element {
  return (
    <List.Dropdown.Section title={TextConstants.Filter.Categories}>
      {categories.map(group => (
        <List.Dropdown.Item
          key={group.identifier}
          title={group.title}
          value={valueForFilterKind(FilterKind.Language, group.path)}
        />
      ))}
    </List.Dropdown.Section>
  )
}
