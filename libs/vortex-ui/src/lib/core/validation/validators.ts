export type VxValidationResult = string | null;

export type VxValidatorFn = (value: unknown) => VxValidationResult;

export function required(message = 'Campo obrigatório'): VxValidatorFn {
  return (value) => {
    if (value == null) return message;
    if (typeof value === 'string' && value.trim() === '') return message;
    if (typeof value === 'boolean' && value === false) return message;
    return null;
  };
}

export function email(message = 'E-mail inválido'): VxValidatorFn {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return (value) => {
    if (value == null || value === '') return null;
    return re.test(String(value)) ? null : message;
  };
}

export function minLength(min: number, message?: string): VxValidatorFn {
  return (value) => {
    if (value == null || value === '') return null;
    const len = String(value).trim().length;
    return len >= min ? null : message ?? `Mínimo de ${min} caracteres`;
  };
}

export function pattern(regex: RegExp, message = 'Formato inválido'): VxValidatorFn {
  return (value) => {
    if (value == null || value === '') return null;
    return regex.test(String(value)) ? null : message;
  };
}

/** Executa validators em ordem; retorna o primeiro erro. */
export function validate(value: unknown, validators: VxValidatorFn[]): VxValidationResult {
  for (const v of validators) {
    const err = v(value);
    if (err) return err;
  }
  return null;
}

export function validateAll(
  fields: Record<string, { value: unknown; validators: VxValidatorFn[] }>
): Record<string, string> {
  const errors: Record<string, string> = {};
  for (const [key, field] of Object.entries(fields)) {
    const err = validate(field.value, field.validators);
    if (err) errors[key] = err;
  }
  return errors;
}
