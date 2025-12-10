import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function ActionButton({
  icon,
  label,
  variant = "outline",
  className,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  variant?: "outline" | "destructive" | "default";
  className?: string;
  onClick?: () => void;
}) {
  const baseStyles = "h-8 px-3 text-xs gap-1.5";
  const variantStyles = {
    outline:
      "hover:bg-muted text-muted-foreground hover:text-foreground border-transparent hover:border-input",
    destructive:
      "text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 border border-red-200 dark:border-red-900/50 bg-transparent",
    default: "",
  };

  return (
    <Button
      variant="outline"
      size="sm"
      className={cn(
        baseStyles,
        variantStyles[variant as keyof typeof variantStyles],
        className
      )}
      onClick={onClick}
    >
      {icon}
      <span className="hidden sm:inline">{label}</span>
    </Button>
  );
}
