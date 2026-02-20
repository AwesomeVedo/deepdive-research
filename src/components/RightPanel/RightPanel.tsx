// src/components/RightPanel/RightPanel.tsx
import type { ReactNode } from "react";
import "./RightPanel.css";

type RightPanelProps = {
  title?: string;
  subtitle?: string;
  children: ReactNode;
};

export function RightPanel({ title = "Details", subtitle, children }: RightPanelProps) {
  return (
    <aside className="right-panel">
      <div className="right-panel__header">
        <h3 className="right-panel__title">{title}</h3>
        {subtitle ? <div className="right-panel__subtitle">{subtitle}</div> : null}
      </div>

      <div className="right-panel__body">{children}</div>
    </aside>
  );
}
