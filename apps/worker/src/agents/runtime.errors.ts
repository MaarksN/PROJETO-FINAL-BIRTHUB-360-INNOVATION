// @ts-expect-error TODO: remover suppressão ampla
// 
export function createRuntimeError(code: string, message: string): Error & { code: string } {
  const error = new Error(message) as Error & { code: string };
  error.code = code;
  return error;
}

