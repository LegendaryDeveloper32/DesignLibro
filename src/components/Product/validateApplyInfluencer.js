export default function validateApplyInfluencer(values) {
  let errors = {};
  // Invitation Code Errors
  if (!values.invitationCode) {
    errors.invitationCode = "A Invitatoin Code field is required.";
  }
  return errors;
}