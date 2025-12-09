import React from "react";
import { HelpCircle } from "lucide-react";

interface QuestionCardProps {
  index: number;
  question: { id: number; category: string; text: string };
  value?: number;
  onChange: (value: number) => void;
}

const SCALE = [
  { value: 1, label: "בכלל לא מסכים" },
  { value: 2, label: "לא מסכים" },
  { value: 3, label: "ניטרלי" },
  { value: 4, label: "מסכים" },
  { value: 5, label: "מסכים מאוד" },
];

export const QuestionCard: React.FC<QuestionCardProps> = ({
  index,
  question,
  value,
  onChange,
}) => {
  return (
    <div className="bg-white border border-neutral-light/70 rounded-2xl shadow-sm p-6 flex flex-col gap-5">
      {/* Header row with category badge and question number */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 text-neutral-500">
          <span className="text-sm font-medium">שאלה {index}</span>
        </div>
        <span className="px-4 py-1.5 rounded-full bg-purple-100 text-purple-700 text-sm font-semibold">
          {question.category}
        </span>

      </div>

      {/* Question text */}
      <p className="text-neutral-800 text-lg font-bold leading-7 text-start py-2">
        {question.text}
      </p>

      {/* Answer options - horizontal row */}
      <div className="flex gap-3 justify-center w-full">
        {SCALE.map((option) => {
          const isActive = value === option.value;
          return (
            <button
              key={option.value}
              type="button"
              onClick={() => onChange(option.value)}
              className={`group flex-1 max-w-[140px] rounded-xl border-2 transition-all duration-200 flex flex-col items-center justify-center px-4 py-1 cursor-pointer ${isActive
                ? "bg-purple-100 text-purple-700 border-purple-400 shadow-md scale-105"
                : "bg-neutral-50 text-neutral-600 border-neutral-200 hover:border-purple-400 hover:bg-purple-50 hover:shadow-lg hover:scale-105 hover:-translate-y-1"
                }`}
            >
              <span className={`text-2xl font-bold mb-1 transition-colors duration-200 ${isActive ? "text-purple-700" : "text-neutral-700 group-hover:text-purple-600"}`}>
                {option.value}
              </span>
              <span className={`text-xs font-medium transition-colors duration-200 ${isActive ? "text-purple-600" : "text-neutral-500 group-hover:text-purple-500"}`}>
                {option.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

