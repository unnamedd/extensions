import { ActionPanel, List } from "@raycast/api"

import {
  ClearFilterActionItem,
  FilterDropdown,
  GroupSection,
} from "@components"

import { useScriptCommands } from "@hooks"

export function MainContent(): JSX.Element {
  const { props, setFilter, setSelection, installPackage } = useScriptCommands()

  return (
    <List
      isLoading={props.isLoading}
      isShowingDetail={!props.isLoading && props.isSidebarEnabled}
      onSelectionChange={setSelection}
      searchBarAccessory={
        !props.isLoading && <FilterDropdown onFilter={setFilter} />
      }
      searchBarPlaceholder={props.placeholder}
      children={props.groups.map(group => (
        <GroupSection
          key={group.identifier}
          group={group}
          onInstallPackage={() => installPackage(group)}
        />
      ))}
      actions={
        <ActionPanel title="Filter by">
          {props.filter != null && !props.hasContent && (
            <ClearFilterActionItem onFilter={setFilter} />
          )}
        </ActionPanel>
      }
    />
  )
}
