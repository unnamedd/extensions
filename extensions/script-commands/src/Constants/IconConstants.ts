import { Color, Icon, Image } from "@raycast/api"

interface Constants {
  All: Image.ImageLike
  ChangesDetected: Image.ImageLike
  ClearFilter: Image.ImageLike
  ConfirmChange: Image.ImageLike
  LocalSourceCode: Image.ImageLike
  Install: Image.ImageLike
  InstallPackage: Image.ImageLike
  Installed: Image.ImageLike
  Languages: Image.ImageLike
  NeedSetup: Image.ImageLike
  Readme: Image.ImageLike
  Setup: Image.ImageLike
  SourceCode: Image.ImageLike
  Type: Image.ImageLike
  Uninstall: Image.ImageLike
}

export const IconConstants: Constants = {
  All: {
    source: Icon.Snippets,
  },
  ChangesDetected: {
    source: Icon.Checkmark,
    tintColor: Color.Orange,
  },
  ClearFilter: {
    source: Icon.XMarkCircle,
    tintColor: Color.Red,
  },
  ConfirmChange: Icon.BlankDocument,
  LocalSourceCode: Icon.Pencil,
  Install: Icon.Download,
  InstallPackage: {
    source: {
      light: "icon-install-package@dark.png",
      dark: "icon-install-package.png",
    },
  },
  Installed: {
    source: Icon.Checkmark,
    tintColor: Color.Green,
  },
  Languages: {
    source: Icon.Hammer,
  },
  NeedSetup: {
    source: Icon.Gear,
    tintColor: Color.Orange,
  },
  Readme: Icon.BlankDocument,
  Setup: Icon.Pencil,
  SourceCode: Icon.BlankDocument,
  Type: {
    source: Icon.Terminal,
  },
  Uninstall: {
    source: Icon.XMarkCircle,
    tintColor: Color.Red,
  },
}
