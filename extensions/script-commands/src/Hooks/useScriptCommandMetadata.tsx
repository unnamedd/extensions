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
  group: CompactGroup
) => UseScriptCommandMetadataState

export const useScriptCommandMetadata: useScriptCommandMetadata = (
  scriptCommand,
  group
) => {
  const { dataManager } = useDataManager()

  let path = ""
  let packageName = ""

  if (group.subtitle) {
    packageName = group.subtitle
  } else if (group.title) {
    packageName = group.title
  }

  if (packageName.length > 0) {
    path += packageName
  }

  path += ` > ${
    scriptCommand.packageName && scriptCommand.packageName != packageName
      ? scriptCommand.packageName
      : scriptCommand.title
  }`

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
      extraInfo: {
        hasArguments: scriptCommand.hasArguments,
        needSetup: scriptCommand.isTemplate,
      },
    },
  }
}
