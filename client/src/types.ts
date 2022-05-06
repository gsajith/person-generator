import { EventHandler } from "@create-figma-plugin/utilities";

export interface InsertSingleHandler extends EventHandler {
  name: "INSERT_SINGLE";
  handler: (code: Uint8Array) => void;
}
