import { nanoid } from "nanoid"

import { Image } from "@raycast/api"

import { avatarImage } from "@helpers"
import { Author } from "@models"
import { checkIsValidURL } from "@urls"

export type InfoDisplayForAuthor = (author: Author) => {
  identifier: string
  name: string
  icon: Image.ImageLike
  url?: string
}

export const infoDisplayForAuthor: InfoDisplayForAuthor = author => {
  let name = author.name ?? "Raycast"
  let url = author.url
  const identifier = nanoid()

  if (!url) {
    return {
      identifier: identifier,
      name: name,
      icon: avatarImage(),
      url: undefined,
    }
  }

  if (
    url &&
    url.length > 0 &&
    (!url.startsWith("http") || !url.startsWith("https"))
  ) {
    // As every url gives support at least to http, we are prepending http:// to the url.
    // This is an arbitrary decision.
    url = `http://${url}`
  }

  if (checkIsValidURL(url)) {
    const path = new URL(url)

    if (path.host === "twitter.com") {
      name = `${name} (Twitter)`
    } else if (path.host === "github.com") {
      name = `${name} (GitHub)`
    }

    return {
      identifier: `${identifier}-${url}`,
      name: name,
      icon: avatarImage(url),
      url: url,
    }
  }

  return {
    identifier: identifier,
    name: name,
    icon: avatarImage(),
    url: undefined,
  }
}
