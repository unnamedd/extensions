import { useDataManager } from "@hooks"
import { ScriptCommand } from "@models"

type LanguageDisplayName = (scriptCommand: ScriptCommand) => string

export const languageDisplayName: LanguageDisplayName = scriptCommand => {
  const { dataManager } = useDataManager()
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
