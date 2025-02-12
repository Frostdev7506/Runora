const isValidPositiveNumber = (value) => {
  // Convert string to number if needed
  const num = typeof value === 'string' ? Number(value) : value;
  // Check if it's a valid number and is positive
  return !isNaN(num) && typeof num === 'number' && num > 0;
};

export default isValidPositiveNumber;