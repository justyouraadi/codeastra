import { toast } from "sonner";

// Success Toast
export const successToast = (message) => {
  toast.success(message);
};

// Error Toast
export const errorToast = (message) => {
  toast.error(message);
};

// Loading Toast
export const loadingToast = (message) => {
  return toast.loading(message);
};

// Dismiss Toast
export const dismissToast = (id) => {
  toast.dismiss(id);
};