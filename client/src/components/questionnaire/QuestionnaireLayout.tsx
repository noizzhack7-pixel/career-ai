import React from "react";

interface QuestionnaireLayoutProps {
  header?: React.ReactNode;
  children: React.ReactNode;
}

export const QuestionnaireLayout: React.FC<QuestionnaireLayoutProps> = ({
  header,
  children,
}) => {
  return (
    <div className="bg-white border border-neutral-light/70 shadow-card rounded-card overflow-hidden">
      {header ? (
        <div className="px-8 py-8 bg-white">
          {header}
        </div>
      ) : null}

      <div className="p-8 bg-neutral-extralight/40">{children}</div>
    </div>
  );
};
