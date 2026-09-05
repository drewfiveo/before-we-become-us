const express = require("express");
const path = require("path");

const router = express.Router();

// ============================================================
// AUTHENTICATION CHECK
// ============================================================

function requireLogin(req, res, next) {


if (!req.session || !req.session.userId) {

    return res.redirect("/login");

}

next();


}

// ============================================================
// HOMEPAGE
// ============================================================

router.get("/", (req, res) => {


res.sendFile(
    path.join(
        __dirname,
        "..",
        "..",
        "views",
        "index.html"
    )
);


});

// ============================================================
// LOGIN
// ============================================================

router.get("/login", (req, res) => {


res.sendFile(
    path.join(
        __dirname,
        "..",
        "..",
        "views",
        "login.html"
    )
);


});

// ============================================================
// CREATE ACCOUNT
// ============================================================

router.get("/create-account", (req, res) => {


res.sendFile(
    path.join(
        __dirname,
        "..",
        "..",
        "views",
        "create-account.html"
    )
);


});

// ============================================================
// DASHBOARD
// ============================================================

router.get("/dashboard", requireLogin, (req, res) => {


res.sendFile(
    path.join(
        __dirname,
        "..",
        "..",
        "views",
        "dashboard.html"
    )
);


});

// ============================================================
// SELF-UNDERSTANDING
// ============================================================

router.get("/self-understanding", requireLogin, (req, res) => {


res.sendFile(
    path.join(
        __dirname,
        "..",
        "..",
        "views",
        "self-understanding.html"
    )
);


});

// ============================================================
// THOUGHTS & FEELINGS
// ============================================================

router.get("/thoughts-and-feelings", requireLogin, (req, res) => {


res.sendFile(
    path.join(
        __dirname,
        "..",
        "..",
        "views",
        "thoughts-and-feelings.html"
    )
);


});

// ============================================================
// REFLECTION
// ============================================================

router.get("/reflection", requireLogin, (req, res) => {


res.sendFile(
    path.join(
        __dirname,
        "..",
        "..",
        "views",
        "reflection.html"
    )
);


});

// ============================================================
// MY REFLECTIONS
// ============================================================

router.get("/my-reflections", requireLogin, (req, res) => {


res.sendFile(
    path.join(
        __dirname,
        "..",
        "..",
        "views",
        "my-reflections.html"
    )
);


});

module.exports = router;
