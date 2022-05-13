import { on, showUI, emit } from "@create-figma-plugin/utilities";

import { InsertSingleHandler, SelectionChangeHandler } from "./types";

// Node types that you cannot insert a fill into
const INVALID_INSERTION_TYPES = [
  "COMPONENT",
  "INSTANCE",
  "GROUP",
  "LINE",
  "PAGE",
  "SLICE",
];

export default function () {
  on<InsertSingleHandler>(
    "INSERT_SINGLE",
    async function (code: Uint8Array, newImage: boolean) {
      if (newImage) {
        const rect = figma.createRectangle();
        rect.x = figma.viewport.center.x;
        rect.y = figma.viewport.center.y - 512;
        rect.resize(1024, 1024);
        const image = figma.createImage(code);
        rect.fills = [
          {
            type: "IMAGE",
            scaleMode: "FILL",
            imageHash: image.hash,
            visible: true,
          },
        ];
        figma.currentPage.appendChild(rect);
        figma.currentPage.selection = [rect];
      } else {
        if (figma.currentPage.selection.length >= 1) {
          const selected = figma.currentPage.selection[0] as any;
          if (INVALID_INSERTION_TYPES.includes(selected.type)) {
            figma.notify("Invalid item selected on canvas.", { error: true });
          } else {
            const newFills = JSON.parse(JSON.stringify(selected.fills));
            const image = figma.createImage(code);
            newFills.push({
              type: "IMAGE",
              scaleMode: "FILL",
              imageHash: image.hash,
              visible: true,
            });
            selected.fills = newFills;
          }
        } else {
          figma.notify("Invalid item selected on canvas.", { error: true });
        }
      }
    }
  );

  figma.on("selectionchange", () => {
    emit<SelectionChangeHandler>(
      "SELECTION_CHANGE",
      figma.currentPage.selection.length === 1 &&
        !INVALID_INSERTION_TYPES.includes(figma.currentPage.selection[0].type)
    );
  });
  showUI({ width: 300, height: 390, themeColors: true });
}
