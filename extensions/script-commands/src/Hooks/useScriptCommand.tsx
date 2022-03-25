import { useEffect, useRef, useState } from "react"
import moment from "moment"

import { Image } from "@raycast/api"

import { ScriptCommand } from "@models"

import { useDataManager } from "@hooks"

import { Filter, State } from "@types"

import { languageURL, sourceCodeNormalURL } from "@urls"

import {
  descriptionForState,
  iconForScriptCommand,
  iconForState,
  keywordsForScriptCommand,
} from "@helpers"

type ScriptCommandState = {
  commandState: State
  scriptCommand: ScriptCommand
}

interface UseScriptCommandProps {
  identifier: string
  title: string
  subtitle: string
  keywords: string[]
  icon: Image.ImageLike
  iconForState: Image.ImageLike | undefined
  iconForLanguage: Image.ImageLike
  author: string
  sourceCodeURL: string
  filter: Filter
  state: State
  path?: string
  isSidebarEnabled: boolean
}

type UseScriptCommandState = {
  props: UseScriptCommandProps
  details: string
  install: () => void
  uninstall: () => void
  confirmSetup: () => void
  editSourceCode: () => void
  setFilter: (filter: Filter) => void
}

type UseScriptCommand = (
  initialScriptCommand: ScriptCommand
) => UseScriptCommandState

export const useScriptCommand: UseScriptCommand = initialScriptCommand => {
  const abort = useRef<AbortController | null>(null)
  const { dataManager, filter, commandIdentifier, setFilter } = useDataManager()

  const [state, setState] = useState<ScriptCommandState>({
    commandState: dataManager.stateFor(initialScriptCommand.identifier),
    scriptCommand: initialScriptCommand,
  })

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

  const install = async () => {
    const result = await dataManager.installScriptCommand(state.scriptCommand)

    setState(oldState => ({
      ...oldState,
      commandState: result.content,
    }))
  }

  const uninstall = async () => {
    const result = await dataManager.deleteScriptCommand(state.scriptCommand)

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

  const file = dataManager.commandFileFor(state.scriptCommand.identifier)

  useEffect(() => {
    if (state.scriptCommand.identifier == commandIdentifier) {
      setState(oldState => ({
        ...oldState,
        commandState: dataManager.stateFor(state.scriptCommand.identifier),
      }))
    }
  }, [commandIdentifier])

  return {
    props: {
      identifier: state.scriptCommand.identifier,
      title: state.scriptCommand.title,
      subtitle: state.scriptCommand.packageName ?? "",
      keywords: keywordsForScriptCommand(
        state.scriptCommand,
        state.commandState
      ),
      icon: iconForScriptCommand(state.scriptCommand),
      iconForState:
        state.commandState === State.NotInstalled
          ? undefined
          : iconForState(state.commandState),
      iconForLanguage: { source: languageURL(state.scriptCommand.language) },
      author: authorDescription(state.scriptCommand),
      sourceCodeURL: sourceCodeNormalURL(state.scriptCommand),
      filter: filter,
      state: state.commandState,
      path: file?.path,
      isSidebarEnabled: dataManager.isSidebarDetailsEnabled(),
    },
    details: details(state),
    install,
    uninstall,
    confirmSetup,
    editSourceCode,
    setFilter,
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

// ###########################################################################
// ###########################################################################

type Details = (state: ScriptCommandState) => string

const details: Details = state => {
  const newLine = "\n\n"
  const separator = "\n***\n"

  const scriptCommand = state.scriptCommand

  let content = ""

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
