import { ActionPanel, List, showHUD } from "@raycast/api"

import {
  AuthorsActionPanel,
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
    accessories,
    install,
    uninstall,
    confirmSetup,
    editSourceCode,
  } = useScriptCommand(scriptCommand, group)

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

  return (
    <List.Item
      id={props.identifier}
      key={props.identifier}
      icon={props.icon}
      keywords={props.keywords}
      title={props.title}
      subtitle={props.subtitle}
      accessories={accessories}
      detail={details && <List.Item.Detail markdown={details} />}
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
          {scriptCommand.authors && scriptCommand.authors.length > 0 && (
            <AuthorsActionPanel authors={scriptCommand.authors} />
          )}
          {group.readme && group.readme.length > 0 && (
            <ReadmeActionPanel group={group} />
          )}
        </ActionPanel>
      }
    />
  )
}
