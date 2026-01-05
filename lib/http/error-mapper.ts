import { ApiException } from "@/lib/http/errors";
import { FieldValues, Path, UseFormSetError } from "react-hook-form";

export function applyApiErrorsToForm<T extends FieldValues>(
  err: ApiException,
  setError: UseFormSetError<T>,
  validFields: readonly string[]
): boolean {
  const details = err?.details;

  if (
    !details ||
    typeof details !== "object" ||
    !Array.isArray((details as any).validationError)
  ) {
    return false;
  }
  
  const errors = (details as any).validationError;
  let applied = false;

  for (const e of errors) {  
    if (typeof e?.field === "string" && typeof e?.message === "string" && validFields.includes(e.field)) { 
      setError(e?.field as Path<T>, {
        type: "server",
        message: e.message,
      });
      applied = true;
    }
  }
  return applied;
}

 