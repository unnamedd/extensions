import { Keyboard } from "@raycast/api"

interface Constants {
  ClearFilter: Keyboard.Shortcut
  Languages: Keyboard.Shortcut
  Type: Keyboard.Shortcut
  Uninstall: Keyboard.Shortcut
  ViewReadmeInBrowser: Keyboard.Shortcut
  ViewReadme: Keyboard.Shortcut
  ViewSourceCodeInBrowser: Keyboard.Shortcut
  ViewSourceCode: Keyboard.Shortcut
}

export const ShortcutConstants: Constants = {
  ClearFilter: {
    modifiers: ["cmd", "shift"],
    key: "c",
  },
  Languages: {
    modifiers: ["cmd"],
    key: "l",
  },
  Type: {
    modifiers: ["cmd"],
    key: "t",
  },
  Uninstall: {
    modifiers: ["ctrl"],
    key: "x",
  },
  ViewReadmeInBrowser: {
    modifiers: ["cmd", "ctrl"],
    key: "o",
  },
  ViewReadme: {
    modifiers: ["cmd", "shift"],
    key: "r",
  },
  ViewSourceCodeInBrowser: {
    modifiers: ["cmd"],
    key: "o",
  },
  ViewSourceCode: {
    modifiers: ["cmd", "shift"],
    key: "s",
  },
}
