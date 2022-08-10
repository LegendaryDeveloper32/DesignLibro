export default function validateUpdateProduct(values) {
    let errors = {};
    // Title Errors
    if (!values.Brand) {
      errors.title = "A Brand Name is required.";
    }
    // Description Errors
    if (!values.Description) {
      errors.Description = "A Description is required.";
    }

    return errors;
  }