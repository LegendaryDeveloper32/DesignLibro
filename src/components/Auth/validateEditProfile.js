export default function validateEditProfile(values) {
  let errors = {};

  // Name Errors
  if (!values.userName) {
    errors.name = "A username is required.";
  }
  // displayName Errors
  if (!values.displayName) {
    errors.displayName = "A displayName is required.";
  }

  // Email Errors
  if (!values.email) {
    errors.email = "Your email is required.";
  } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)) {
    errors.email = "Your email is invalid.";
  }

  // New Password Errors
  // if (values.password.length < 6) {
  //   errors.password = "Your new password must be at least 6 characters.";
  // }

  return errors;
}