import { useEffect, useState } from "react";

const Parser = () => {
  const [buffer, setBuffer] = useState("");

  useEffect(() => {
    const fetchFile = async () => {
      try {
        const response = await fetch("../../hdl/test.hdl");
        const text = await response.text();
        setBuffer(text);
      } catch (error) {
        console.error("Failed to fetch file", error);
      }
    };

    fetchFile();
  }, []);

  const visualizeSpecialCharacters = (text: string) => {
    return text.replace(/\n/g, "").replace(/\t/g, "&nbsp;&nbsp;");
  };

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "8px",
        height: "100%",
      }}
    >
      <div
        style={{
          gridColumn: "1 / span 1",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div style={{ borderBottom: "1px solid white" }}>HDL</div>
        <div
          style={{ flex: 1, whiteSpace: "pre-wrap" }}
          dangerouslySetInnerHTML={{
            __html: visualizeSpecialCharacters(buffer),
          }}
        ></div>
      </div>
      <div
        style={{
          gridColumn: "2 / span 1",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div style={{ borderBottom: "1px solid white" }}>JSON</div>
        <div
          style={{ flex: 1, whiteSpace: "pre-wrap" }}
          dangerouslySetInnerHTML={{
            __html: buffer,
          }}
        />
      </div>
    </div>
  );
};

export default Parser;
