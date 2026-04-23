"use client";

import { useState } from "react";

interface AccordionItemProps {
  question: string;
  answer: string;
}

export function AccordionItem({ question, answer }: AccordionItemProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-b border-cyan-100 last:border-0">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-4 rounded py-5 text-left text-base font-semibold text-navy transition-colors duration-150 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 md:py-6 md:text-lg"
      >
        <span>{question}</span>
        <span
          className={`flex-shrink-0 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          aria-hidden="true"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M5 7.5L10 12.5L15 7.5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      </button>
      <div
        className={`overflow-hidden transition-all duration-200 ${open ? "max-h-96 pb-5" : "max-h-0"}`}
      >
        <p className="max-w-2xl text-sm leading-7 text-gray-600 md:text-base">
          {answer}
        </p>
      </div>
    </div>
  );
}
