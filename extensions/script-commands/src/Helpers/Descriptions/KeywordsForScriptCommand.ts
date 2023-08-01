import { ScriptCommand } from "@models"
import { State } from "@types"

type KeywordsForScriptCommand = (
  scriptCommand: ScriptCommand,
  state: State,
) => string[]

export const keywordsForScriptCommand: KeywordsForScriptCommand = (
  scriptCommand,
  state,
) => {
  const keywords: string[] = []

  const packageName = scriptCommand.packageName

  if (packageName) {
    keywords.push(packageName)
  }

  const authors = scriptCommand.authors

  if (authors && authors.length > 0) {
    authors.forEach(author => {
      const name = author.name

      if (name) {
        name.split(" ").forEach(value => keywords.push(value))
      }
    })
  }

  if (scriptCommand.language) {
    keywords.push(scriptCommand.language)
  }

  if (state === State.Installed) {
    keywords.push("installed")
  } else if (state === State.NeedSetup || state === State.ChangesDetected) {
    keywords.push("installed")
    keywords.push("setup")
  }

  if (scriptCommand.isTemplate) {
    keywords.push("template")
  }

  return keywords
}
