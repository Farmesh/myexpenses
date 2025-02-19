import { body, validationResult } from 'express-validator';

export const validateExpense = [
  body('description').notEmpty().trim(),
  body('amount').isNumeric().toFloat(),
  body('category').notEmpty().trim(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
]; 