import { motion } from "framer-motion";
import { X } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface AlertNotificationProps {
  alert: {
    type: "success" | "error";
    title: string;
    message: string;
  } | null;
  onDismiss: () => void;
}

export function AlertNotification({
  alert,
  onDismiss,
}: AlertNotificationProps) {
  if (!alert) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -100 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -100 }}
      className="fixed top-20 left-1/2 -translate-x-1/2 z-50 w-full max-w-md px-4"
    >
      <Alert
        variant={alert.type === "error" ? "destructive" : "default"}
        className="shadow-lg border-2"
      >
        <AlertTitle className="flex items-center justify-between">
          {alert.title}
          <button
            onClick={onDismiss}
            className="ml-auto hover:opacity-70 transition-opacity"
          >
            <X className="h-4 w-4" />
          </button>
        </AlertTitle>
        <AlertDescription>{alert.message}</AlertDescription>
      </Alert>
    </motion.div>
  );
}
