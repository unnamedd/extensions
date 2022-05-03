import { nanoid } from "nanoid"

import { Image } from "@raycast/api"

import { avatarImage } from "@helpers"
import { Author } from "@models"
import { checkIsValidURL } from "@urls"

export type InfoDisplayForAuthor = (author: Author) => {
  /** Auto generated unique identifier */
  identifier: string
  name: string
  /** Concatenate the author name and social media (if exists), otherwise shows only the name  */
  nameAndSocialMedia: string
  icon: Image.ImageLike
  url?: string
  socialMedia?: string
}

export const infoDisplayForAuthor: InfoDisplayForAuthor = author => {
  const name = author.name ?? "Raycast"
  let url = author.url
  const identifier = nanoid()

  if (!url) {
    return {
      identifier: identifier,
      name: name,
      nameAndSocialMedia: name,
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

    let nameAndSocialMedia = name
    if (socialMedia) {
      nameAndSocialMedia = `${name} (${socialMedia})`
    }

    return {
      identifier: `${identifier}-${url}`,
      name: name,
      nameAndSocialMedia: nameAndSocialMedia,
      icon: avatarImage(url),
      url: url,
      socialMedia: socialMedia,
    }
  }

  return {
    identifier: identifier,
    name: name,
    nameAndSocialMedia: name,
    icon: avatarImage(),
    url: undefined,
    socialMedia: undefined,
  }
}
