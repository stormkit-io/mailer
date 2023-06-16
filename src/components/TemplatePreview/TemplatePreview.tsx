import { useState } from "react";
import { createPortal } from "react-dom";
import Box from "@mui/material/Box";

interface Props {
  children: React.ReactNode;
}

export default function TemplatePreview({ children }: Props) {
  const [contentRef, setContentRef] = useState<HTMLIFrameElement>();
  const mountNode = contentRef?.contentWindow?.document?.body;

  return (
    <Box
      component="iframe"
      sx={{ border: "none", width: "100%", height: "100%", m: 0 }}
      ref={setContentRef}
    >
      {mountNode ? <div>{createPortal(children, mountNode)}</div> : ""}
    </Box>
  );
}
