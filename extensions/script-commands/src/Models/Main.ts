import { CompactGroup, Group, Language } from "@models"

export type MainGroup = Main<Group>

export type MainCompactGroup = Main<CompactGroup>

interface Main<T> {
  groups: T[]
  parentGroups?: T[]
  totalScriptCommands: number
  languages: Language[]
}
