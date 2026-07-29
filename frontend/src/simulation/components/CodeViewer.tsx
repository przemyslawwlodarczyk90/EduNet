import { useEffect, useRef, useState } from "react";
import Editor, { type Monaco, type OnMount } from "@monaco-editor/react";
import type { editor } from "monaco-editor";
import { fetchCodeSnippet } from "../api";

interface CodeViewerProps {
  scenarioId: string | null;
  codeLineRef: string | null;
}

function parseLineNumber(codeLineRef: string | null): number | null {
  if (!codeLineRef) return null;
  const parts = codeLineRef.split(":");
  const line = Number(parts[parts.length - 1]);
  return Number.isFinite(line) ? line : null;
}

export function CodeViewer({ scenarioId, codeLineRef }: CodeViewerProps) {
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("java");
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);
  const monacoRef = useRef<Monaco | null>(null);
  const decorationsRef = useRef<string[]>([]);

  useEffect(() => {
    if (!scenarioId) {
      setCode("");
      return;
    }
    fetchCodeSnippet(scenarioId).then((snippet) => {
      setCode(snippet.code);
      setLanguage(snippet.language);
    });
  }, [scenarioId]);

  useEffect(() => {
    const line = parseLineNumber(codeLineRef);
    const editorInstance = editorRef.current;
    const monaco = monacoRef.current;
    if (!editorInstance || !monaco) return;

    if (line === null) {
      decorationsRef.current = editorInstance.deltaDecorations(decorationsRef.current, []);
      return;
    }

    decorationsRef.current = editorInstance.deltaDecorations(decorationsRef.current, [
      {
        range: new monaco.Range(line, 1, line, 1),
        options: { isWholeLine: true, className: "highlighted-code-line" },
      },
    ]);
    editorInstance.revealLineInCenter(line);
  }, [codeLineRef, code]);

  const handleMount: OnMount = (editorInstance, monaco) => {
    editorRef.current = editorInstance;
    monacoRef.current = monaco;
  };

  return (
    <div className="code-viewer">
      <Editor
        height="240px"
        language={language}
        value={code}
        onMount={handleMount}
        options={{ readOnly: true, minimap: { enabled: false }, fontSize: 13 }}
      />
    </div>
  );
}
