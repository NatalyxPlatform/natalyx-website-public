import Link from "next/link";

interface FormSuccessProps {
  alreadyRegistered?: boolean;
}

export function FormSuccess({ alreadyRegistered = false }: FormSuccessProps) {
  return (
    <div className="text-center py-16 px-6" role="status" aria-live="polite">
      {/* Stork icon */}
      <div className="flex justify-center mb-8" aria-hidden="true">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/natalyx_combined_icon.png"
          alt=""
          className="h-24 w-auto"
        />
      </div>

      <h2 className="text-3xl font-light text-navy mb-4">
        {alreadyRegistered ? "You are already on the list." : "You are on the list."}
      </h2>
      <p className="text-gray-500 max-w-md mx-auto leading-relaxed mb-8">
        Thank you for reaching out. We are opening Natalyx carefully, and we
        will be in touch as access opens and there is a useful next step to
        share.
      </p>
      <p className="text-sm text-gray-400 mb-10">
        In the meantime, if you have any questions, reach us at{" "}
        <a
          href="mailto:hello@natalyx.health"
          className="text-primary hover:text-primary-dark transition-colors"
        >
          hello@natalyx.health
        </a>
      </p>

      <Link
        href="/"
        className="inline-flex items-center gap-2 text-sm text-primary hover:text-primary-dark transition-colors font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded"
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path
            d="M10 12L6 8L10 4"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        Back to homepage
      </Link>
    </div>
  );
}
