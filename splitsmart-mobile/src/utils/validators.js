export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password) => {
  if (password.length < 6) {
    return { valid: false, message: "Password must be at least 6 characters" };
  }
  return { valid: true };
};

export const validateName = (name) => {
  if (!name || name.trim().length === 0) {
    return { valid: false, message: "Name is required" };
  }
  if (name.trim().length < 2) {
    return { valid: false, message: "Name must be at least 2 characters" };
  }
  return { valid: true };
};

export const validateAmount = (amount) => {
  const numAmount = parseFloat(amount);
  if (isNaN(numAmount) || numAmount <= 0) {
    return {
      valid: false,
      message: "Please enter a valid amount greater than 0",
    };
  }
  if (numAmount > 1000000) {
    return { valid: false, message: "Amount cannot exceed $1,000,000" };
  }
  return { valid: true };
};

export const validateGroupName = (name) => {
  if (!name || name.trim().length === 0) {
    return { valid: false, message: "Group name is required" };
  }
  if (name.trim().length > 100) {
    return { valid: false, message: "Group name cannot exceed 100 characters" };
  }
  return { valid: true };
};

export const validateExpenseDescription = (description) => {
  if (!description || description.trim().length === 0) {
    return { valid: false, message: "Description is required" };
  }
  if (description.trim().length > 200) {
    return {
      valid: false,
      message: "Description cannot exceed 200 characters",
    };
  }
  return { valid: true };
};

export const validateSplitAmounts = (splits, totalAmount) => {
  const total = splits.reduce(
    (sum, split) => sum + parseFloat(split.amount || 0),
    0
  );
  const difference = Math.abs(total - totalAmount);

  if (difference > 0.01) {
    return {
      valid: false,
      message: `Split amounts (${total.toFixed(
        2
      )}) must equal total amount (${totalAmount.toFixed(2)})`,
    };
  }
  return { valid: true };
};

export const validateSplitPercentages = (splits) => {
  const total = splits.reduce(
    (sum, split) => sum + parseFloat(split.percentage || 0),
    0
  );
  const difference = Math.abs(total - 100);

  if (difference > 0.01) {
    return {
      valid: false,
      message: `Percentages (${total.toFixed(1)}%) must add up to 100%`,
    };
  }
  return { valid: true };
};
