import { EventHandler } from "@create-figma-plugin/utilities";

export interface InsertSingleHandler extends EventHandler {
  name: "INSERT_SINGLE";
  handler: (code: Uint8Array, newImage: boolean) => void;
}

export interface SelectionChangeHandler extends EventHandler {
  name: "SELECTION_CHANGE";
  handler: (selected: boolean) => void;
}
