import { useEffect, useRef, useState } from "react"
import { Image, List } from "@raycast/api"
import moment from "moment"

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
  details?: string
  accessories: List.Item.Accessory[]
  install: () => void
  uninstall: () => void
  confirmSetup: () => void
  editSourceCode: () => void
}

type UseScriptCommand = (
  initialScriptCommand: ScriptCommand,
  initialGroup: CompactGroup
) => UseScriptCommandState

export const useScriptCommand: UseScriptCommand = (initialScriptCommand, initialGroup) => {
  const abort = useRef<AbortController | null>(null)
  const { dataManager, commandIdentifier, setReloadDropdown } = useDataManager()

  const [state, setState] = useState<ScriptCommandState>({
    commandState: dataManager.stateFor(initialScriptCommand.identifier),
    scriptCommand: initialScriptCommand,
    group: initialGroup
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
      state.scriptCommand
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
      }
    )
  }

  return {
    props: {
      identifier: state.scriptCommand.identifier,
      title: state.scriptCommand.title,
      subtitle: isSidebarEnabled ? state.scriptCommand.packageName : undefined,
      keywords: keywordsForScriptCommand(
        state.scriptCommand,
        state.commandState
      ),
      icon: iconForScriptCommand(state.scriptCommand),
      sourceCodeURL: sourceCodeNormalURL(state.scriptCommand),
      state: state.commandState,
      path: file?.path,
      isSidebarEnabled: isSidebarEnabled,
    },
    details: isSidebarEnabled ? details(state) : undefined,
    accessories: accessoriesForState(state, dataManager),
    install,
    uninstall,
    confirmSetup,
    editSourceCode,
  }
}

// ###########################################################################
// ###########################################################################

type AuthorDescription = (scriptCommand: ScriptCommand) => string

const authorDescription: AuthorDescription = scriptCommand => {
  const defaultAuthor = "Raycast"

  if (!scriptCommand.authors) {
    return defaultAuthor
  }

  const authors = scriptCommand.authors

  if (authors.length == 0) {
    return defaultAuthor
  }

  let content = ""

  authors.forEach(author => {
    if (content.length > 0) {
      content += " and "
    }

    content += author.name
  })

  return content
}

type AuthorSocialMedia = (scriptCommand: ScriptCommand) => string | undefined

const authorSocialMedia: AuthorSocialMedia = scriptCommand => {
  let authorSocialMedia: string | undefined

  const authors = scriptCommand.authors

  if (authors && authors.length == 1) {
    const author = authors[0]
    const authorInfo = infoDisplayForAuthor(author)

    if (authorInfo.socialMedia) {
      authorSocialMedia = authorInfo.socialMedia
    }
  }

  return authorSocialMedia
}

// ###########################################################################
// ###########################################################################

type AccessoriesForState = (
  state: ScriptCommandState,
  dataManager: DataManager
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

    accessories.push({
      icon: { source: languageURL(state.scriptCommand.language) },
      tooltip: languageDisplayName(dataManager, state.scriptCommand),
    })
  }

  return accessories
}

type AuthorsAccessories = (
  scriptCommand: ScriptCommand,
  widgetStyle: AuthorWidgetStyle
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
        tooltip: info.socialMedia,
      })
    }
  })

  return accessories
}

// ###########################################################################
// ###########################################################################

type LanguageDisplayName = (
  dataManager: DataManager,
  scriptCommand: ScriptCommand
) => string

const languageDisplayName: LanguageDisplayName = (
  dataManager,
  scriptCommand
) => {
  const language = dataManager.fetchLanguage(scriptCommand.language)
  let languageDisplayName = scriptCommand.language

  // Hack to make the first letter uppercased
  languageDisplayName =
    languageDisplayName.charAt(0).toUpperCase() + languageDisplayName.slice(1)

  if (language) {
    languageDisplayName = language.displayName
  }

  return languageDisplayName
}

// ###########################################################################
// ###########################################################################

type Details = (state: ScriptCommandState) => string

const details: Details = state => {
  const newLine = "\n\n"
  const separator = "\n***\n"

  const scriptCommand = state.scriptCommand

  let content = ""

  if (state.group.subtitle) {
    content += `${state.group.subtitle} > `
  }

  if (scriptCommand.packageName) {
    content += `**${scriptCommand.packageName}**\n\n`
  }

  content += newLine + `## ${scriptCommand.title}`

  if (scriptCommand.description) {
    content += newLine + scriptCommand.description
  }

  content += separator

  const authors = scriptCommand.authors
  if (authors && authors.length > 0) {
    const suffix = authors.length > 1 ? "s" : ""
    content += label(`Author${suffix}`, authorDescription(scriptCommand))
  }

  content += newLine
  const formatMask = "LLL"
  const createdAt = moment(scriptCommand.createdAt).format(formatMask)
  const updatedAt = moment(scriptCommand.updatedAt).format(formatMask)

  content += label("Created at", createdAt)
  content += label("Updated at", updatedAt)
  content += newLine

  content += label("Status", descriptionForState(state.commandState))
  content += newLine

  return content
}

type LabelValue = (label: string, value: string) => string

const label: LabelValue = (label, value) => {
  const newLine = "\n"
  return newLine + label + " **" + value + "**  "
}
