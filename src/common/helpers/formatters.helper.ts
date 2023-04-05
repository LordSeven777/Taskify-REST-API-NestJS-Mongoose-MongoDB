import { ValidationError } from 'class-validator';

/**
 * Formats the class-validator errors into a key-value pairs format
 *
 * @param errors The validation error array provided by the class-validator exception factory
 * @returns The same error data formatted into key-value pairs of field-errors
 */
export function formatValidationErrors(
  errors: ValidationError[],
): Record<string, string[]> {
  const formattedErrors: Record<string, string[]> = {};
  for (const error of errors) {
    const field = error.property;
    if (!error.constraints) continue;
    const messages: string[] = Object.entries(error.constraints).map(
      ([, message]) => message,
    );
    formattedErrors[field] = messages;
  }
  return formattedErrors;
}
