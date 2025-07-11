const { body } = require("express-validator");

exports.firstName = (bodyItem) =>
  body(bodyItem)
    .trim()
    .isAlpha()
    .withMessage("First Name must only contain characters.")
    .not()
    .isEmpty()
    .withMessage("First Name should not be empty.")
    .isLength({ max: 100 })
    .withMessage("First Name should not exceed 100 characters.")
    .escape();

exports.lastName = (bodyItem) =>
  body(bodyItem)
    .trim()
    .isAlpha()
    .withMessage("Last Name must only contain characters.")
    .not()
    .isEmpty()
    .withMessage("Last Name should not be empty.")
    .isLength({ max: 100 })
    .withMessage("Last Name should not exceed 100 characters.")
    .escape();

// exports.gender = (bodyItem) => body(bodyItem)
//     .trim()
//     .isAlpha()
//     .withMessage('Gender must only contain characters.')
//     .not().isEmpty()
//     .withMessage('Gender should not be empty.')
//     .isLength({max: 100})
//     .withMessage('Gender should not exceed 100 characters.')
//     .escape()

// exports.age = (bodyItem) => body(bodyItem)
//   .trim()
//   .isNumeric()
//   .withMessage('Age must only contain numbers.')
//   .not().isEmpty()
//   .withMessage('Age should not be empty.')
//   .escape()

// exports.businessOrgName = (bodyItem) => body(bodyItem)
//   .trim()
//   .not().isEmpty()
//   .withMessage('Business/Org Name should not be empty.')
//   .escape()

exports.email = (bodyItem, unique = null) => {
  const result = body(bodyItem)
    .trim()
    .isEmail()
    .withMessage("Please provide a valid email.")
    .not()
    .isEmpty()
    .withMessage("Email should not be empty")
    .escape();
  // if (unique) {
  //   // TODO: handle uniqueness
  //   result.custom((value, {req}) => {
  //     return User.find({email: value})
  //       .then(userDoc => {
  //         if (userDoc.length > 0) {
  //           return Promise.reject('Email already exists')
  //         }
  //       })
  //   })
  // }
  return result.normalizeEmail();
};

exports.password = (bodyItem) =>
  body(bodyItem)
    .trim()
    .isLength({ min: 8 })
    .withMessage("Password must be atleast 8 characters long.")
    .isAlphanumeric()
    .withMessage("Password must include atleast one character and one numbers")
    .not()
    .isEmpty()
    .withMessage("Password should not be empty")
    .escape();

// exports.confirmPassword = (bodyItem) => body(bodyItem)
//     .trim()
//     .not().isEmpty()
//     .withMessage('Confirm Password should not be empty')
//     .custom((value, {req}) => {
//       if (value !== req.body.password) {
//         throw new Error('Passwords have to match.')
//       }
//       return true;
//     })
