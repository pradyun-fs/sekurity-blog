import { Node, mergeAttributes } from "@tiptap/core";
import { ReactNodeViewRenderer } from "@tiptap/react";
import FloatingImageComponent from "./FloatingImageComponent";

export const FloatingImage = Node.create({
  name: "floatingImage",
  group: "block",
  atom: true,
  draggable: true,
  selectable: true,

  addAttributes() {
    return {
      src: { default: null },
      width: { default: 300 },
      height: { default: 200 },
      x: { default: 0 },
      y: { default: 0 },
      caption: { default: "" },
    };
  },

  parseHTML() {
    return [{ tag: 'figure[data-type="floatingImage"]' }];
  },

  renderHTML({ HTMLAttributes }) {
    const { src, width, height, caption, x, y } = HTMLAttributes;

    return [
      "figure",
      mergeAttributes(HTMLAttributes, {
        "data-type": "floatingImage",
        style: `
          width: ${width}px;
          height: ${height}px;
          transform: translate(${x}px, ${y}px);
          position: relative;
          margin: 1rem auto;
        `,
      }),
      ["img", {
        src,
        width,
        height,
        alt: caption || "Image",
        style: "display: block; object-fit: cover; width: 100%; height: 100%;",
      }],
      caption
        ? ["figcaption", {
            style: "font-size: 0.875rem; text-align: center; margin-top: 0.5rem; color: #6b7280;",
          }, caption]
        : "",
    ];
  },

  addNodeView() {
    return ReactNodeViewRenderer(FloatingImageComponent);
  },
});



