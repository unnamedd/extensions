import { Image } from "@raycast/api"

import { ScriptCommand } from "@models"
import { iconDarkURLFor, iconLightURLFor } from "@urls"

type IconForScriptCommand = (scriptCommand: ScriptCommand) => Image

export const iconForScriptCommand: IconForScriptCommand = scriptCommand => {
  const iconDark = iconDarkURLFor(scriptCommand)
  const iconLight = iconLightURLFor(scriptCommand)

  const image: Image = {
    source: {
      light: iconLight != null ? iconLight.content : "",
      dark: iconDark != null ? iconDark.content : "",
    },
  }

  return image
}
