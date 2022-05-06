import { on, showUI } from "@create-figma-plugin/utilities";

import { InsertSingleHandler } from "./types";

export default function () {
  on<InsertSingleHandler>("INSERT_SINGLE", async function (code: Uint8Array) {
    const rect = figma.createRectangle();
    rect.x = figma.viewport.center.x;
    rect.y = figma.viewport.center.y;
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
  });
  showUI({ width: 300, height: 450 });
}
