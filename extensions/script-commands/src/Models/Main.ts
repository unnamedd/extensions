import { CompactGroup, Group } from "@models"

import { Language } from "./Language"

export type MainGroup = Main<Group>

export type MainCompactGroup = Main<CompactGroup>

interface Main<T> {
  groups: T[]
  parentGroups?: T[]
  totalScriptCommands: number
  languages: Language[]
}
