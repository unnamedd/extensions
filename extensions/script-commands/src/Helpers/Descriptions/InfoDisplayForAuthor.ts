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
  socialMedia?: string
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
      socialMedia: undefined,
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
    let socialMedia: string | undefined

    if (path.host === "twitter.com" || path.host === "www.twitter.com") {
      socialMedia = "Twitter"
    } else if (path.host === "github.com" || path.host === "www.github.com") {
      socialMedia = "GitHub"
    }

    if (socialMedia) {
      name = `${name} (${socialMedia})`
    }

    return {
      identifier: `${identifier}-${url}`,
      name: name,
      icon: avatarImage(url),
      url: url,
      socialMedia: socialMedia,
    }
  }

  return {
    identifier: identifier,
    name: name,
    icon: avatarImage(),
    url: undefined,
    socialMedia: undefined,
  }
}
