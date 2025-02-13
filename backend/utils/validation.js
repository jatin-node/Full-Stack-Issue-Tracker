// Regular expression for validating email
export const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

// Regular expression for validating password
export const passwordRegex =
  /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{7,}$/;

// Regular expression for validating name
export const nameRegex = /^(?![_.])[a-zA-Z0-9._]{3,20}(?<![_.])$/;
