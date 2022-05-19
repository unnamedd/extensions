import moment from "moment"

import {
  languageDisplayName,
  iconForState,
  descriptionForState,
} from "@helpers"
import { useDataManager } from "@hooks"
import { ScriptCommand, CompactGroup } from "@models"
import { languageURL } from "@urls"
import { DateInfoLike, IconLike } from "@types"

type UseScriptCommandMetadataProps = {
  path: string
  description: string | undefined
  dateInfo: DateInfoLike
  language: IconLike
  status: IconLike
}

type UseScriptCommandMetadataState = {
  props: UseScriptCommandMetadataProps
}

type useScriptCommandMetadata = (
  scriptCommand: ScriptCommand,
  group: CompactGroup
) => UseScriptCommandMetadataState

export const useScriptCommandMetadata: useScriptCommandMetadata = (
  scriptCommand,
  group
) => {
  const { dataManager } = useDataManager()

  let path = ""
  if (group.subtitle) {
    path += `${group.subtitle} > `
  }

  if (scriptCommand.packageName) {
    path += scriptCommand.packageName
  }

  let description = scriptCommand.description
  if (description && description.length > 60) {
    description = description.substring(0, 60) + "..."
  }

  const formatMask = "LLL"
  const createdAt = moment(scriptCommand.createdAt).format(formatMask)
  const updatedAt = moment(scriptCommand.updatedAt).format(formatMask)

  const commandState = dataManager.stateFor(scriptCommand.identifier)

  return {
    props: {
      path: path,
      description: description,
      dateInfo: {
        createdAt: createdAt,
        updatedAt: updatedAt,
      },
      language: {
        icon: languageURL(scriptCommand.language),
        text: languageDisplayName(scriptCommand),
      },
      status: {
        icon: iconForState(commandState),
        text: descriptionForState(commandState),
      },
    },
  }
}
