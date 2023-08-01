import moment from "moment"

import { useEffect, useRef, useState } from "react"

import { useDataManager } from "@hooks"
import { Language, ScriptCommand } from "@models"
import { sourceCodeNormalURL } from "@urls"
import { State } from "@types"

type SourceCodeState = {
  content: string
  scriptCommand: ScriptCommand
}

type UseSourceCodeProps = {
  title: string
  filename: string
  createdAt: string
  updatedAt: string
  language: string
  state: State
  isLoading: boolean
  sourceCodeURL: string
  sourceCode: string
}

type UseSourceCode = (initialScriptCommand: ScriptCommand) => UseSourceCodeProps

export const useSourceCode: UseSourceCode = initialScriptCommand => {
  const abort = useRef<AbortController | null>(null)
  const { dataManager } = useDataManager()

  const [state, setState] = useState<SourceCodeState>({
    content: "",
    scriptCommand: initialScriptCommand,
  })

  useEffect(() => {
    const fetch = async () => {
      abort.current?.abort()
      abort.current = new AbortController()

      const result = await dataManager.fetchSourceCode(
        state.scriptCommand,
        abort.current.signal,
      )

      if (!abort.current.signal.aborted) {
        setState(oldState => ({
          ...oldState,
          content: result,
        }))
      }
    }

    fetch()

    return () => {
      abort.current?.abort()
    }
  }, [state])

  const formatMask = "LLL"
  const createdAt = moment(state.scriptCommand.createdAt).format(formatMask)
  const updatedAt = moment(state.scriptCommand.updatedAt).format(formatMask)

  return {
    title: state.scriptCommand.title,
    filename: state.scriptCommand.filename,
    createdAt: createdAt,
    updatedAt: updatedAt,
    state: dataManager.stateFor(state.scriptCommand.identifier),
    language: state.scriptCommand.language,
    isLoading: state.content.length === 0,
    sourceCodeURL: sourceCodeNormalURL(state.scriptCommand),
    sourceCode: details(state.scriptCommand.language, state.content),
  }
}

type Details = (language: string, sourceCode: string) => string

const details: Details = (language, sourceCode) => {
  let content = ""
  content += "```" + language + "\n"
  content += sourceCode
  content += "\n```"

  return content
}
