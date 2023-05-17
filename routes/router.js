const router = require("express").Router();
// const sendOtp = require('../utils/otp');
const { signup, verify } = require("../utils/signup");
const { login } = require("../utils/login");
const getDetails = require("../utils/userDetails");
const authoriseToken = require("../middleware/authorizeToken");
const deleteUser = require("../utils/deleteUser");
const { getOtp, verifyForgot, setNewPassword } = require("../utils/forgot");
const resendOtp = require("../utils/resendOtp");
const { body } = require("express-validator");

// router.route("/otp").post(sendOtp);
router
  .route("/signup")
  .post(
    [
      body("username")
        .notEmpty()
        .withMessage("Username is required")
        .isLength({ min: 3, max: 25 })
        .withMessage("Username must be between 3 and 20 characters"),
      body("email")
        .notEmpty()
        .withMessage("Email is required")
        .isEmail()
        .withMessage("Invalid email")
        .normalizeEmail(),
      body("password")
        .notEmpty()
        .withMessage("Password is required")
        .isLength({ min: 6 })
        .withMessage("Password must be at least 6 characters"),
    ],
    signup
  );
router
  .route("/login")
  .post(
    [
      body("username")
        .if(body("email").isEmpty())
        .notEmpty()
        .withMessage("Username is required if email is not provided")
        .isLength({ min: 3, max: 25 })
        .withMessage("Username must be between 3 and 20 characters"),
      body("email")
        .if(body("username").isEmpty())
        .notEmpty()
        .withMessage("Email is required if username is not provided")
        .normalizeEmail(),
      body("email").optional().isEmail().withMessage("Invalid email"),
      body("password")
        .notEmpty()
        .withMessage("Password is required")
        .isLength({ min: 6 })
        .withMessage("Password must be at least 6 characters"),
    ],
    login
  );
router.route("/getDetails").get(authoriseToken, getDetails);
router
  .route("/delete")
  .delete(
    [
      body("username")
        .if(body("email").isEmpty())
        .notEmpty()
        .withMessage("Username is required if email is not provided")
        .isLength({ min: 3, max: 25 })
        .withMessage("Username must be between 3 and 20 characters"),
      body("email")
        .if(body("username").isEmpty())
        .notEmpty()
        .withMessage("Email is required if username is not provided")
        .normalizeEmail(),
      body("email").optional().isEmail().withMessage("Invalid email"),
      body("password")
        .notEmpty()
        .withMessage("Password is required")
        .withMessage("Password must be at least 6 characters"),
      ,
    ],
    deleteUser
  );
router
  .route("/signup/verify")
  .post(
    [
      body("email")
        .notEmpty()
        .withMessage("Email is required")
        .isEmail()
        .withMessage("Invalid email")
        .normalizeEmail(),
      body("otp")
        .notEmpty()
        .withMessage("Otp is required")
        .isLength({ min: 4, max: 4 })
        .withMessage("Otp must be 4 characters"),
    ],
    verify
  );
router
  .route("/forgot")
  .post(
    [
      body("email")
        .notEmpty()
        .withMessage("Email is required")
        .isEmail()
        .withMessage("Invalid email")
        .normalizeEmail(),
    ],
    getOtp
  );
router
  .route("/forgot/verify")
  .post(
    [
      body("email")
        .notEmpty()
        .withMessage("Email is required")
        .isEmail()
        .withMessage("Invalid email")
        .normalizeEmail(),
      body("otp")
        .notEmpty()
        .withMessage("Otp is required")
        .isLength({ min: 4, max: 4 })
        .withMessage("Otp must be 4 characters"),
    ],
    verifyForgot
  );
router
  .route("/forgot/set")
  .post(
    [
      body("email")
        .notEmpty()
        .withMessage("Email is required")
        .isEmail()
        .withMessage("Invalid email")
        .normalizeEmail(),
      body("password")
        .notEmpty()
        .withMessage("Password is required")
        .isLength({ min: 6 })
        .withMessage("Password must be at least 6 characters"),
    ],
    setNewPassword
  );
router
  .route("/resend")
  .post(
    [
      body("email")
        .notEmpty()
        .withMessage("Email is required")
        .isEmail()
        .withMessage("Invalid email")
        .normalizeEmail(),
    ],
    resendOtp
  );

module.exports = router;
