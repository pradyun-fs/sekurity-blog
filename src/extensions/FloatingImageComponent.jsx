import { NodeViewWrapper } from "@tiptap/react";
import { useRef, useEffect, useState } from "react";
import Moveable from "react-moveable";

export default function FloatingImageComponent({ node, updateAttributes, selected }) {
  const { src, width, height, x, y, caption } = node.attrs;
  const targetRef = useRef(null);
  const [frame, setFrame] = useState({
    translate: [x, y],
    width,
    height,
  });

  useEffect(() => {
    updateAttributes({
      x: frame.translate[0],
      y: frame.translate[1],
      width: frame.width,
      height: frame.height,
    });
  }, [frame]);

  return (
    <NodeViewWrapper className="floating-image-wrapper">
      <div
        ref={targetRef}
        style={{
          transform: `translate(${frame.translate[0]}px, ${frame.translate[1]}px)`,
          width: `${frame.width}px`,
          height: `${frame.height}px`,
          position: "relative",
          border: selected ? "2px solid #22d3ee" : "none",
        }}
      >
        <img
          src={src}
          alt="floating"
          style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
          draggable={false}
        />
        <figcaption
          contentEditable
          suppressContentEditableWarning
          onBlur={(e) => updateAttributes({ caption: e.target.innerText.trim() })}
          className="text-xs text-gray-500 text-center mt-1"
        >
          {caption || "Write a caption..."}
        </figcaption>
      </div>

      {selected && (
        <Moveable
          target={targetRef.current}
          draggable
          resizable
          throttleDrag={1}
          throttleResize={1}
          keepRatio={false}
          onDrag={({ beforeTranslate }) => {
            setFrame((prev) => ({
              ...prev,
              translate: beforeTranslate,
            }));
          }}
          onResize={({ width, height, drag }) => {
            const [x, y] = drag.beforeTranslate;
            setFrame({
              width,
              height,
              translate: [x, y],
            });
          }}
          bounds={{ left: 0, top: 0 }}
        />
      )}
    </NodeViewWrapper>
  );
}