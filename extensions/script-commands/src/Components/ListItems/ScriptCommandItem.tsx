import { ActionPanel, Image, List, showHUD } from "@raycast/api"

import {
  AuthorsActionPanel,
  FiltersActionPanel,
  ManagementActionPanel,
  ReadmeActionPanel,
  StoreToast,
  ViewsActionPanel,
} from "@components"

import { useScriptCommand } from "@hooks"

import { CompactGroup, ScriptCommand } from "@models"

import { Progress, State } from "@types"

type Props = {
  scriptCommand: ScriptCommand
  group: CompactGroup
  onInstallPackage: () => void
}

export function ScriptCommandItem({
  scriptCommand,
  group,
  onInstallPackage,
}: Props): JSX.Element {
  const {
    props,
    details,
    install,
    uninstall,
    confirmSetup,
    editSourceCode,
    setFilter,
  } = useScriptCommand(scriptCommand)

  const handleInstall = async () => {
    await StoreToast(props.state, Progress.InProgress, scriptCommand.title)

    install()

    await StoreToast(props.state, Progress.Finished, scriptCommand.title)
  }

  const handleUninstall = async () => {
    await StoreToast(State.Installed, Progress.InProgress, scriptCommand.title)

    uninstall()

    await StoreToast(State.Installed, Progress.Finished, scriptCommand.title)
  }

  const handleSetup = () => {
    showHUD(`Opening ${props.title}'s file to be configured...`)
  }

  const handleEditLocal = () => {
    editSourceCode()
    showHUD(`Opening ${props.title}'s local source code to be edited...`)
  }

  let accessoryIcon: undefined | Image.ImageLike
  let accessoryTitle: undefined | string
  let subtitle: undefined | string
  let detailsContent: undefined | string

  if (props.isSidebarEnabled) {
    detailsContent = details
  } else {
    accessoryIcon = props.accessoryIcon
    accessoryTitle = props.accessoryTitle
    subtitle = props.subtitle
  }

  return (
    <List.Item
      id={props.identifier}
      key={props.identifier}
      icon={props.icon}
      title={props.title}
      subtitle={subtitle}
      accessoryIcon={accessoryIcon}
      accessoryTitle={accessoryTitle}
      keywords={props.keywords}
      detail={
        props.isSidebarEnabled && <List.Item.Detail markdown={detailsContent} />
      }
      actions={
        <ActionPanel title={props.title}>
          <ManagementActionPanel
            state={props.state}
            commandPath={props.path}
            onConfirmSetup={confirmSetup}
            onEditLocal={handleEditLocal}
            onInstall={handleInstall}
            onInstallPackage={onInstallPackage}
            onSetup={handleSetup}
            onUninstall={handleUninstall}
          />
          <ViewsActionPanel
            url={props.sourceCodeURL}
            scriptCommand={scriptCommand}
          />
          <AuthorsActionPanel authors={scriptCommand.authors ?? []} />
          {group.readme && group.readme.length > 0 && (
            <ReadmeActionPanel group={group} />
          )}
          <FiltersActionPanel filter={props.filter} onFilter={setFilter} />
        </ActionPanel>
      }
    />
  )
}
