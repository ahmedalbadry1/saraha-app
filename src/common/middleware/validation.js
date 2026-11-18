import { Query } from "mongoose";
import { success } from "zod"

export const validation = (schema) => {
  return (req, res, next) => {
    const result = schema.safeParse({
            params: req.params,   
            body: req.body,
            query: req.query,
            headers: req.headers  
    });

    if (!result.success) {
      throw result.error;
    }

    req.validated = result.data;
    next();
  };
};