import Link from "next/link";

type ButtonVariant = "primary" | "secondary" | "ghost" | "white";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonBaseProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
  children: React.ReactNode;
}

interface ButtonAsButton extends ButtonBaseProps {
  href?: undefined;
  type?: "button" | "submit" | "reset";
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  disabled?: boolean;
  "aria-busy"?: boolean;
}

interface ButtonAsLink extends ButtonBaseProps {
  href: string;
  type?: undefined;
  onClick?: undefined;
  disabled?: undefined;
}

type ButtonProps = ButtonAsButton | ButtonAsLink;

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-primary text-white shadow-[0_6px_18px_rgba(99,102,241,0.28)] hover:bg-primary-dark hover:shadow-[0_8px_22px_rgba(99,102,241,0.35)] focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-60",
  secondary:
    "border border-primary/30 bg-white text-primary shadow-sm hover:border-primary hover:bg-primary-light focus-visible:ring-primary",
  ghost:
    "bg-transparent text-navy-light underline underline-offset-4 hover:text-primary focus-visible:ring-primary",
  white:
    "border border-white/25 bg-white text-navy shadow-[0_12px_28px_rgba(0,0,0,0.16)] hover:bg-[#F6FBF8] focus-visible:ring-white",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "min-h-11 px-4 py-2 text-sm",
  md: "min-h-12 px-6 py-3 text-base",
  lg: "min-h-14 px-8 py-4 text-base md:text-lg",
};

export function Button({
  variant = "primary",
  size = "md",
  className = "",
  children,
  ...props
}: ButtonProps) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-lg font-semibold transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2";
  const classes = `${base} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`;

  if (props.href !== undefined) {
    return (
      <Link href={props.href} className={classes}>
        {children}
      </Link>
    );
  }

  const { type, onClick, disabled, "aria-busy": ariaBusy } = props as ButtonAsButton;
  return (
    <button
      className={classes}
      type={type}
      onClick={onClick}
      disabled={disabled}
      aria-busy={ariaBusy}
    >
      {children}
    </button>
  );
}
