import { Node, mergeAttributes } from "@tiptap/core";
import { ReactNodeViewRenderer } from "@tiptap/react";
import FloatingImageComponent from "./FloatingImageComponent";

export const FloatingImage = Node.create({
  name: "floatingImage",

  group: "block",
  atom: true,
  draggable: true,

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
    return [
      {
        tag: "figure[data-type='floatingImage']",
      },
    ];
  },

  renderHTML({ node, HTMLAttributes }) {
    return [
      "figure",
      mergeAttributes(HTMLAttributes, { "data-type": "floatingImage" }),
      [
        "img",
        {
          src: node.attrs.src,
          style: `width: ${node.attrs.width}px; height: ${node.attrs.height}px; border-radius: 8px; display: block; margin: 1rem auto;`,
        },
      ],
      [
        "figcaption",
        {
          style:
            "font-size: 0.875rem; color: #6b7280; text-align: center; margin-top: 0.5rem;",
        },
        node.attrs.caption || "",
      ],
    ];
  },

  addNodeView() {
    return ReactNodeViewRenderer(FloatingImageComponent);
  },
});
