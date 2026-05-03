"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { basicSetup } from "codemirror";
import { EditorState } from "@codemirror/state";
import { EditorView } from "@codemirror/view";
import { FiAlertTriangle, FiEye, FiInfo } from "react-icons/fi";
import type { ChallengeDefinition } from "@/consts/challenges";

type ChallengeRunnerProps = {
  challenge: ChallengeDefinition;
};

const editorTheme = EditorView.theme({
  "&": {
    height: "100%",
    backgroundColor: "#13081f",
    color: "#efe6fa",
    borderRadius: "16px",
    overflow: "hidden",
  },
  ".cm-scroller": {
    fontFamily: "var(--font-mono)",
    lineHeight: "1.7",
  },
  ".cm-content": {
    caretColor: "#f5f3ff",
    padding: "16px 0",
  },
  ".cm-gutters": {
    backgroundColor: "#0f051b",
    color: "#a78bfa",
    border: "none",
  },
  ".cm-activeLine, .cm-activeLineGutter": {
    backgroundColor: "rgba(167, 139, 250, 0.08)",
  },
  ".cm-cursor, .cm-dropCursor": {
    borderLeftColor: "#f5f3ff",
  },
  ".cm-selectionBackground, .cm-content ::selection": {
    backgroundColor: "rgba(167, 139, 250, 0.35) !important",
  },
  ".cm-placeholder": {
    color: "rgba(239, 230, 250, 0.45)",
  },
});

function getInitialHintCount(totalHints: number) {
  return totalHints > 0 ? 1 : 0;
}

export default function ChallengeRunner({ challenge }: ChallengeRunnerProps) {
  const editorHostRef = useRef<HTMLDivElement | null>(null);
  const editorViewRef = useRef<EditorView | null>(null);
  const [code, setCode] = useState(challenge.starterCode);
  const [revealedHintCount, setRevealedHintCount] = useState(getInitialHintCount(challenge.hints.length));

  useEffect(() => {
    const host = editorHostRef.current;

    if (!host || editorViewRef.current) {
      return undefined;
    }

    const state = EditorState.create({
      doc: challenge.starterCode,
      extensions: [
        basicSetup,
        editorTheme,
        EditorView.updateListener.of((update) => {
          if (update.docChanged) {
            setCode(update.state.doc.toString());
          }
        }),
      ],
    });

    editorViewRef.current = new EditorView({
      state,
      parent: host,
    });

    return () => {
      editorViewRef.current?.destroy();
      editorViewRef.current = null;
    };
  }, [challenge.starterCode]);

  useEffect(() => {
    const view = editorViewRef.current;

    if (!view) {
      return;
    }

    const currentCode = view.state.doc.toString();

    if (currentCode === code) {
      return;
    }

    view.dispatch({
      changes: {
        from: 0,
        to: currentCode.length,
        insert: code,
      },
    });
  }, [code]);

  const previewDoc = useMemo(() => code, [code]);

  const handleReset = () => {
    setCode(challenge.starterCode);
    setRevealedHintCount(getInitialHintCount(challenge.hints.length));

    const view = editorViewRef.current;

    if (!view) {
      return;
    }

    view.dispatch({
      changes: {
        from: 0,
        to: view.state.doc.length,
        insert: challenge.starterCode,
      },
    });
  };

  const revealHint = () => {
    setRevealedHintCount((current) => Math.min(current + 1, challenge.hints.length));
  };

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-10 text-[#efe6fa] lg:px-0">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-3">
          <p className="font-mono text-3xl tracking-wide text-[#efe6fa]">
            Challenge {challenge.id}: {challenge.title}
          </p>
          <p className="max-w-3xl text-sm leading-6 text-[#cdbfe0]">
            {challenge.objective}
          </p>
        </div>

        <button
          type="button"
          aria-label="Challenge information"
          className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/90 text-[#1a1022] transition hover:bg-white"
        >
          <FiInfo className="h-5 w-5" />
        </button>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <section className="overflow-hidden rounded-2xl border border-violet-300/70 bg-[#13081f] shadow-[0_0_0_1px_rgba(255,255,255,0.02)]">
          <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
            <div className="flex items-center gap-3 text-[#d9c9ef]">
              <span className="font-mono text-sm">&lt;/&gt;</span>
              <span className="font-mono text-sm">index.html</span>
            </div>
            <button
              type="button"
              onClick={handleReset}
              className="rounded-full border border-white/10 px-3 py-1 text-xs text-[#d9c9ef] transition hover:border-white/25 hover:bg-white/5"
            >
              Reset
            </button>
          </div>
          <div className="h-[34rem] min-h-[34rem] p-3">
            <div ref={editorHostRef} className="h-full min-h-0 rounded-xl border border-white/5" />
          </div>
        </section>

        <section className="overflow-hidden rounded-2xl border border-violet-300/70 bg-[#13081f] shadow-[0_0_0_1px_rgba(255,255,255,0.02)]">
          <div className="flex items-center gap-3 border-b border-white/10 px-5 py-4 text-[#d9c9ef]">
            <FiEye className="h-5 w-5" />
            <span className="font-mono text-sm">Preview</span>
          </div>
          <div className="h-[34rem] min-h-[34rem] bg-[#ece5f8] p-0">
            <iframe
              title={`${challenge.title} preview`}
              sandbox="allow-scripts allow-modals"
              className="h-full w-full border-0 bg-white"
              srcDoc={previewDoc}
            />
          </div>
        </section>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <section className="overflow-hidden rounded-2xl border border-violet-300/70 bg-[#13081f]">
          <div className="flex items-center gap-3 border-b border-white/10 px-5 py-4 text-[#d9c9ef]">
            <FiAlertTriangle className="h-5 w-5" />
            <span className="font-mono text-sm">Errors</span>
          </div>
          <div className="space-y-3 p-5">
            {challenge.errors.map((error) => (
              <div key={error} className="rounded-xl border border-fuchsia-500/40 bg-fuchsia-950/50 px-4 py-3 text-sm text-fuchsia-100">
                {error}
              </div>
            ))}
          </div>
        </section>

        <section className="overflow-hidden rounded-2xl border border-violet-300/70 bg-[#13081f]">
          <div className="flex items-center gap-3 border-b border-white/10 px-5 py-4 text-[#d9c9ef]">
            <FiInfo className="h-5 w-5" />
            <span className="font-mono text-sm">Hints</span>
          </div>
          <div className="space-y-3 p-5">
            {challenge.hints.slice(0, revealedHintCount).map((hint) => (
              <div key={hint} className="rounded-xl border border-violet-500/30 bg-violet-950/50 px-4 py-3 text-sm text-violet-100">
                {hint}
              </div>
            ))}

            {revealedHintCount < challenge.hints.length ? (
              <button
                type="button"
                onClick={revealHint}
                className="w-full rounded-xl bg-[#6d2bbf] px-4 py-3 text-left text-sm font-medium text-white transition hover:bg-[#7d38d9]"
              >
                Reveal Hint {revealedHintCount + 1}
              </button>
            ) : null}
          </div>
        </section>
      </div>
    </div>
  );
}