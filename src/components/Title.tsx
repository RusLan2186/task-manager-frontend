import { cn } from "@/lib/utils";

const sizes = {
  sm: "text-lg",
  md: "text-2xl",
  lg: "text-3xl",
  xl: "text-4xl",
} as const;

type size = keyof typeof sizes;

interface Props {
  text: string;
  className?: string;
  size?: size;
}

export const Title: React.FC<Props> = ({ text, size = "md", className }) => {
  const sizeClass = sizes[size];

  return (
    <h1
      className={cn(
        "font-semibold tracking-tight text-foreground",
        sizeClass,
        className,
      )}
    >
      {text}
    </h1>
  );
};
