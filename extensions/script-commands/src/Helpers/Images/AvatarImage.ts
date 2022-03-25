import { Image } from "@raycast/api"

import { avatarURL } from "@urls"

export const avatarImage = (url: string | null = null): Image => {
  return {
    source: avatarURL(url),
    mask: Image.Mask.Circle,
  }
}
