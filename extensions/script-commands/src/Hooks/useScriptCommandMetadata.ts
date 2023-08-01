import moment from "moment"

import { useDataManager } from "@hooks"
import { ScriptCommand, CompactGroup } from "@models"
import { DateInfoLike, State } from "@types"

type UseScriptCommandMetadataProps = {
  path: string
  description: string[] | undefined
  dateInfo: DateInfoLike
  language: string
  state: State
  extraInfo: {
    needSetup: boolean
    hasArguments: boolean
  }
}

type UseScriptCommandMetadataState = {
  props: UseScriptCommandMetadataProps
}

type useScriptCommandMetadata = (
  scriptCommand: ScriptCommand,
  group: CompactGroup,
) => UseScriptCommandMetadataState

export const useScriptCommandMetadata: useScriptCommandMetadata = (
  scriptCommand,
  group,
) => {
  const { dataManager } = useDataManager()

  let path = ""
  if (group.subtitle) {
    path += `${group.subtitle} > `
  }

  path += `${group.title} > ${scriptCommand.title}`

  const formatMask = "LLL"
  const createdAt = moment(scriptCommand.createdAt).format(formatMask)
  const updatedAt = moment(scriptCommand.updatedAt).format(formatMask)

  const state = dataManager.stateFor(scriptCommand.identifier)

  let description: string[] | undefined
  if (scriptCommand.description) {
    let text = scriptCommand.description
    text = clearMarkdownLinks(text)

    description = breakContentIntoLines(text, 60)
  }

  return {
    props: {
      path: path,
      description: description,
      dateInfo: {
        createdAt: createdAt,
        updatedAt: updatedAt,
      },
      language: scriptCommand.language,
      state: state,
      extraInfo: {
        hasArguments: scriptCommand.hasArguments,
        needSetup: scriptCommand.isTemplate,
      },
    },
  }
}

type ClearMarkdownLinks = (content: string) => string

const clearMarkdownLinks: ClearMarkdownLinks = content => {
  const expression = /\[([A-Za-z0-9\-._ ]+)\]\(([^\\)]+)\)/gm

  return content.replace(expression, `$1`)
}

type BreakContentIntoLines = (content: string, length: number) => string[]

const breakContentIntoLines: BreakContentIntoLines = (content, length) => {
  if (content.length <= length) {
    return [content]
  }

  const wordsList = content.trim().split(" ")

  const chunks: string[] = []
  let currentLine: string[] = []
  let currentLineLength = 0

  wordsList.forEach((word, index) => {
    const isLastWord = index == wordsList.length - 1

    if (
      (currentLineLength < length &&
        currentLineLength + word.length > length) ||
      currentLineLength + word.length > length
    ) {
      currentLine.push(word)
      chunks.push(currentLine.join(" "))

      currentLine = []
      currentLineLength = 0
    } else {
      currentLine.push(word)
      currentLineLength += word.length + 1

      if (isLastWord) {
        chunks.push(currentLine.join(" "))
      }
    }
  })

  return chunks
}
