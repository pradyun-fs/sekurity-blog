import { Node, mergeAttributes } from "@tiptap/core";
import { ReactNodeViewRenderer } from "@tiptap/react";
import FloatingImageComponent from "./FloatingImageComponent";

export const FloatingImage = Node.create({
  name: "floatingImage",

  group: "block",
  content: "inline*",     // allow inline content like captions
  inline: false,
  atom: false,
  selectable: true,
  draggable: true,

  addAttributes() {
    return {
      src: { default: null },
      width: { default: 300 },
      height: { default: 200 },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'figure[data-type="floatingImage"]',
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "figure",
      mergeAttributes(HTMLAttributes, {
        "data-type": "floatingImage",
        style: `margin: 1rem auto; text-align: center;`,
      }),
      ["img", { src: HTMLAttributes.src, style: "display: block; margin: 0 auto;" }],
      ["figcaption", {}, 0], // renders inline content
    ];
  },

  addNodeView() {
    return ReactNodeViewRenderer(FloatingImageComponent);
  },
});
