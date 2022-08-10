export default function validateCreateBrand(values) {
  let errors = {};
  // brand Errors
  if (!values.brand) {
    errors.title = "A brand is required.";
  }
  // category Errors
  if (!values.category) {
    errors.title = "A category is required.";
  }

  // title Errors
  if (!values.title) {
    errors.title = "A title is required.";
  }
  // description Errors
  if (!values.description) {
    errors.description = "A description is required.";
  }
  // url Errors
  if (!values.url) {
    errors.title = "A url is required.";
  }
  // thumbnail Errors
  if (!values.thumbnail) {
    errors.title = "A thumbnail is required.";
  }
  // photos Errors
  if (!values.photos) {
    errors.photos = "A photos is required.";
  }

  return errors;
}