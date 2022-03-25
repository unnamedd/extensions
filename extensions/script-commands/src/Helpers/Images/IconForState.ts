import { IconConstants } from "@constants"
import { Image } from "@raycast/api"

import { State } from "@types"

type IconForState = (state: State) => Image.ImageLike

export const iconForState: IconForState = state => {
  let icon: Image.ImageLike

  if (state === State.Installed) {
    icon = IconConstants.Installed
  } else if (state === State.NeedSetup) {
    icon = IconConstants.NeedSetup
  } else if (state === State.ChangesDetected) {
    icon = IconConstants.ChangesDetected
  } else {
    icon = IconConstants.Install
  }

  return icon
}
