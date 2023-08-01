import { useEffect, useRef, useState } from "react"
import { Image, List } from "@raycast/api"

import { ScriptCommand, CompactGroup } from "@models"

import { useDataManager } from "@hooks"

import { AuthorWidgetStyle, State } from "@types"

import { languageURL, sourceCodeNormalURL } from "@urls"

import {
  descriptionForState,
  iconForScriptCommand,
  iconForState,
  infoDisplayForAuthor,
  keywordsForScriptCommand,
  languageDisplayName,
} from "@helpers"

import { DataManager } from "@managers"

type ScriptCommandState = {
  commandState: State
  scriptCommand: ScriptCommand
  group: CompactGroup
}

interface UseScriptCommandProps {
  identifier: string
  title: string
  subtitle?: string
  keywords: string[]
  icon: Image.ImageLike
  sourceCodeURL: string
  state: State
  path?: string
  isSidebarEnabled: boolean
}

type UseScriptCommandState = {
  props: UseScriptCommandProps
  accessories: List.Item.Accessory[]
  install: () => void
  uninstall: () => void
  confirmSetup: () => void
  editSourceCode: () => void
}

type UseScriptCommand = (
  initialScriptCommand: ScriptCommand,
  initialGroup: CompactGroup,
) => UseScriptCommandState

export const useScriptCommand: UseScriptCommand = (
  initialScriptCommand,
  initialGroup,
) => {
  const abort = useRef<AbortController | null>(null)
  const { dataManager, commandIdentifier, setReloadDropdown } = useDataManager()

  const [state, setState] = useState<ScriptCommandState>({
    commandState: dataManager.stateFor(initialScriptCommand.identifier),
    scriptCommand: initialScriptCommand,
    group: initialGroup,
  })

  const file = dataManager.commandFileFor(state.scriptCommand.identifier)
  const isSidebarEnabled = dataManager.isSidebarDetailsEnabled()

  useEffect(() => {
    abort.current?.abort()
    abort.current = new AbortController()

    if (state.commandState === State.NeedSetup) {
      const identifier = state.scriptCommand.identifier

      const monitor = dataManager.monitorChangesFor(identifier, state => {
        if (state === State.ChangesDetected && !abort.current?.signal.aborted) {
          setState(oldState => ({
            ...oldState,
            commandState: state,
          }))

          monitor?.close()
        }
      })
    }

    return () => {
      abort.current?.abort()
    }
  }, [state])

  useEffect(() => {
    if (state.scriptCommand.identifier == commandIdentifier) {
      setState(oldState => ({
        ...oldState,
        commandState: dataManager.stateFor(state.scriptCommand.identifier),
      }))
    }
  }, [commandIdentifier])

  const install = async () => {
    setReloadDropdown(false)
    const result = await dataManager.installScriptCommand(state.scriptCommand)
    setReloadDropdown(true)

    setState(oldState => ({
      ...oldState,
      commandState: result.content,
    }))
  }

  const uninstall = async () => {
    setReloadDropdown(false)
    const result = await dataManager.deleteScriptCommand(state.scriptCommand)
    setReloadDropdown(true)

    setState(oldState => ({
      ...oldState,
      commandState: result.content,
    }))
  }

  const confirmSetup = async () => {
    const result = await dataManager.confirmScriptCommandSetupFor(
      state.scriptCommand,
    )

    setState(oldState => ({
      ...oldState,
      commandState: result.content,
    }))
  }

  const editSourceCode = () => {
    const monitor = dataManager.updateHashOnChangeFor(
      state.scriptCommand.identifier,
      () => {
        monitor?.close()
      },
    )
  }

  return {
    props: {
      identifier: state.scriptCommand.identifier,
      title: state.scriptCommand.title,
      subtitle: isSidebarEnabled ? undefined : state.scriptCommand.packageName,
      keywords: keywordsForScriptCommand(
        state.scriptCommand,
        state.commandState,
      ),
      icon: iconForScriptCommand(state.scriptCommand),
      sourceCodeURL: sourceCodeNormalURL(state.scriptCommand),
      state: state.commandState,
      path: file?.path,
      isSidebarEnabled: isSidebarEnabled,
    },
    accessories: accessoriesForState(state, dataManager),
    install,
    uninstall,
    confirmSetup,
    editSourceCode,
  }
}

// ###########################################################################
// ###########################################################################

type AccessoriesForState = (
  state: ScriptCommandState,
  dataManager: DataManager,
) => List.Item.Accessory[]

const accessoriesForState: AccessoriesForState = (state, dataManager) => {
  const icon =
    state.commandState === State.NotInstalled
      ? undefined
      : iconForState(state.commandState)

  const description = descriptionForState(state.commandState)

  const accessories: List.Item.Accessory[] = []

  if (dataManager.isSidebarDetailsEnabled()) {
    if (icon) {
      accessories.push({
        icon: icon,
        tooltip: description,
      })
    }
  } else {
    if (icon) {
      accessories.push({
        icon: icon,
        tooltip: description,
      })
    }

    const widgetStyle = dataManager.authorWidgetStyle()
    const authorsWidget = authorsAccessories(state.scriptCommand, widgetStyle)

    if (authorsWidget) {
      authorsWidget.forEach(accessory => accessories.push(accessory))
    }

    const language = state.scriptCommand.language

    accessories.push({
      icon: { source: languageURL(language) },
      tooltip: languageDisplayName(language),
    })
  }

  return accessories
}

type AuthorsAccessories = (
  scriptCommand: ScriptCommand,
  widgetStyle: AuthorWidgetStyle,
) => List.Item.Accessory[] | undefined

const authorsAccessories: AuthorsAccessories = (scriptCommand, widgetStyle) => {
  if (!scriptCommand.authors) {
    return undefined
  }

  const accessories: List.Item.Accessory[] = []

  scriptCommand.authors.forEach(author => {
    const info = infoDisplayForAuthor(author)

    if (widgetStyle == AuthorWidgetStyle.OnlyName) {
      accessories.push({
        text: info.name,
        tooltip: info.socialMedia,
      })
    } else if (widgetStyle == AuthorWidgetStyle.OnlyAvatar) {
      accessories.push({
        icon: info.icon,
        tooltip: info.name,
      })
    } else if (widgetStyle == AuthorWidgetStyle.AvatarAndName) {
      accessories.push({
        icon: info.icon,
        text: info.name,
      })
    }
  })

  return accessories
}
