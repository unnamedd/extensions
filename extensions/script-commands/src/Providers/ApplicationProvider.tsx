import { createContext, useState, ReactNode } from "react"

import { DataManager } from "@managers"

import { Filter } from "@types"

type ProviderState = {
  dataManager: DataManager
  filter: Filter
  commandIdentifier: string
  reloadDropdown: boolean
}

type ContextType = {
  state: ProviderState
  setFilter: (filter: Filter) => void
  setCommandToRefresh: (identifier: string) => void
  setReloadDropdown: (reload: boolean) => void
}

const initialState: ProviderState = {
  dataManager: DataManager.shared(),
  filter: null,
  commandIdentifier: "",
  reloadDropdown: false,
}

export const ApplicationContext = createContext<ContextType>({
  state: initialState,
  setFilter: () => {
    return
  },
  setCommandToRefresh: () => {
    return
  },
  setReloadDropdown: () => {
    return
  },
})

type ApplicationProviderProps = {
  children: ReactNode
}

export const ApplicationProvider = ({ children }: ApplicationProviderProps) => {
  const [state] = useState<ProviderState>(initialState)
  const [filter, setFilter] = useState<Filter>(null)
  const [commandIdentifier, setCommandToRefresh] = useState<string>("")
  const [reloadDropdown, setReloadDropdown] = useState<boolean>(false)

  return (
    <ApplicationContext.Provider
      value={{
        state: {
          dataManager: state.dataManager,
          filter,
          commandIdentifier,
          reloadDropdown,
        },
        setFilter,
        setCommandToRefresh,
        setReloadDropdown,
      }}
      children={children}
    />
  )
}
