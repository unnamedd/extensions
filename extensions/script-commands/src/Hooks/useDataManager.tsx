import { DataManager } from "@managers"

import { useContext } from "react"

import { ApplicationContext } from "@providers"

import { Filter } from "@types"

type UseDataManager = () => {
  dataManager: DataManager
  filter: Filter
  commandIdentifier: string
  reloadDropdown: boolean
  setFilter: (filter: Filter) => void
  setCommandToRefresh: (identifier: string) => void
  setReloadDropdown: (reload: boolean) => void
}

export const useDataManager: UseDataManager = () => {
  const { state, setFilter, setCommandToRefresh, setReloadDropdown } =
    useContext(ApplicationContext)

  return {
    dataManager: state.dataManager,
    filter: state.filter,
    commandIdentifier: state.commandIdentifier,
    reloadDropdown: state.reloadDropdown,
    setFilter,
    setCommandToRefresh,
    setReloadDropdown,
  }
}
