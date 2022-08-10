export default function validateSubscribeForm(values) {
  let errors = {};
  // email Errors
  if (!values.email) {
    errors.email = "A subcribe email address is required.";
  }

  return errors;
}