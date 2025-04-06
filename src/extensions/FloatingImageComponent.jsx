import { NodeViewWrapper, NodeViewContent } from "@tiptap/react";
import { useRef, useEffect, useState } from "react";
import Moveable from "react-moveable";

export default function FloatingImageComponent({ node, updateAttributes, selected }) {
  const { src, width = 300, height = 200 } = node.attrs;
  const wrapperRef = useRef(null);
  const [frame, setFrame] = useState({ width, height });

  useEffect(() => {
    updateAttributes({
      width: frame.width,
      height: frame.height,
    });
  }, [frame]);

  return (
    <NodeViewWrapper
      as="figure"
      ref={wrapperRef}
      data-type="floatingImage"
      className="mx-auto my-4 text-center"
      style={{
        width: `${frame.width}px`,
        height: `${frame.height + 40}px`, // height + space for caption
        border: selected ? "2px solid #22d3ee" : "none",
      }}
    >
      <img
        src={src}
        alt="Floating"
        style={{
          width: "100%",
          height: `${frame.height}px`,
          objectFit: "cover",
          display: "block",
          margin: "0 auto",
        }}
        draggable={false}
      />

      {/* Caption - TipTap manages content here */}
      <figcaption className="text-sm text-gray-500 mt-2">
        <NodeViewContent as="p" className="outline-none" />
      </figcaption>

      {selected && (
        <Moveable
          target={wrapperRef.current}
          resizable
          draggable
          keepRatio={false}
          throttleResize={1}
          throttleDrag={1}
          onResize={({ width, height }) => {
            setFrame({ width, height });
          }}
          onDrag={({ target, beforeTranslate }) => {
            target.style.transform = `translate(${beforeTranslate[0]}px, ${beforeTranslate[1]}px)`;
          }}
        />
      )}
    </NodeViewWrapper>
  );
}
