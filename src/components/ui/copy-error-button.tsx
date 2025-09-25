import * as React from "react";
import { Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

interface CopyErrorButtonProps {
  message: string;
  className?: string;
  variant?: "default" | "ghost" | "outline" | "secondary" | "destructive" | "link";
  size?: "default" | "sm" | "lg" | "icon";
  showToast?: boolean;
  toastMessage?: string;
}

export const CopyErrorButton = React.forwardRef<
  HTMLButtonElement,
  CopyErrorButtonProps
>(({ 
  message, 
  className, 
  variant = "ghost", 
  size = "icon", 
  showToast = true,
  toastMessage = "Error message copied to clipboard",
  ...props 
}, ref) => {
  const [copied, setCopied] = React.useState(false);
  const { toast } = useToast();

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message);
      setCopied(true);
      
      if (showToast) {
        toast({
          title: "Copied!",
          description: toastMessage,
          duration: 2000,
        });
      }

      // Reset the copied state after 2 seconds
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
      
      if (showToast) {
        toast({
          title: "Copy failed",
          description: "Unable to copy to clipboard",
          variant: "destructive",
          duration: 2000,
        });
      }
    }
  };

  return (
    <Button
      ref={ref}
      variant={variant}
      size={size}
      onClick={handleCopy}
      className={cn(
        "transition-all duration-200",
        copied && "text-green-600 dark:text-green-400",
        className
      )}
      title="Copy error message"
      {...props}
    >
      {copied ? (
        <Check className="h-4 w-4" />
      ) : (
        <Copy className="h-4 w-4" />
      )}
    </Button>
  );
});

CopyErrorButton.displayName = "CopyErrorButton";