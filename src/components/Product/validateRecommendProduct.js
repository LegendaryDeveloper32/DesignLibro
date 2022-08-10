export default function validateMyRecommendation(values) {
  let errors = {};
  // Recommendation Errors
  if (!values.recommendation) {
    errors.recommendation = "A recommendation field is required.";
  }

  return errors;
}