import { success } from "zod"

export const validation = (schema) => {
  return (req, res, next) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      throw result.error;
    }

    req.validated = result.data;
    next();
  };
};