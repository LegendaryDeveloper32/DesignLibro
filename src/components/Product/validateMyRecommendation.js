export default function validateRecommendProduct(values) {
  let errors = {};
  // Title Errors
  if (!values.title) {
    errors.title = "A title field is required.";
  }
  // URL Errors
  if (!values.url) {
    errors.url = "A URL field required.";
  } else if (!/^(ftp|http|https):\/\/[^ "]+$/.test(values.url)) {
    errors.url = "The URL must be valid.";
  }
  // Price Errors
  if (!values.price) {
    errors.price = "A price field is required.";
  }
  // Brand Errors
  if (!values.brand) {
    errors.brand = "A brand field is required.";
  }
  // Designer Errors
  // if (!values.designer) {
  //   errors.designer = "A designer field is required.";
  // }
  // Recommendation Errors
  // if (!values.recommendation) {
  //   errors.recommendation = "A recommendation field is required.";
  // }

  return errors;
}