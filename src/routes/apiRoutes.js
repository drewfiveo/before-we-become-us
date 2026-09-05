const express = require("express");
const bcrypt = require("bcryptjs");

const router = express.Router();


// ============================================================
// HEALTH CHECK
// ============================================================

router.get("/health", (req, res) => {

    res.json({
        status: "ok",
        service: "Before We Become Us",
        message: "The platform is running."
    });

});


// ============================================================
// REGISTER NEW USER
// ============================================================

router.post("/auth/register", async (req, res) => {

    try {

        const { name, email, password } = req.body;


        if (!name || !email || !password) {

            return res.status(400).json({
                status: "error",
                message: "Name, email and password are required."
            });

        }


        const cleanName = name.trim();

        const cleanEmail =
            email.trim().toLowerCase();


        if (password.length < 8) {

            return res.status(400).json({
                status: "error",
                message: "Password must be at least 8 characters long."
            });

        }


        const db = req.app.locals.db;


        const existingUser = await db
            .collection("users")
            .findOne({
                email: cleanEmail
            });


        if (existingUser) {

            return res.status(409).json({
                status: "error",
                message: "An account with this email already exists."
            });

        }


        const passwordHash =
            await bcrypt.hash(password, 12);


        const result = await db
            .collection("users")
            .insertOne({
                name: cleanName,
                email: cleanEmail,
                passwordHash,
                createdAt: new Date()
            });


        res.status(201).json({
            status: "success",
            message: "Your account has been created.",
            userId: result.insertedId
        });


    } catch (error) {

        console.error(
            "Failed to register user:",
            error.message
        );


        res.status(500).json({
            status: "error",
            message: "The account could not be created."
        });

    }

});


// ============================================================
// LOGIN
// ============================================================

router.post("/auth/login", async (req, res) => {

    try {

        const { email, password } = req.body;


        if (!email || !password) {

            return res.status(400).json({
                status: "error",
                message: "Email and password are required."
            });

        }


        const cleanEmail =
            email.trim().toLowerCase();


        const db = req.app.locals.db;


        const user = await db
            .collection("users")
            .findOne({
                email: cleanEmail
            });


        if (!user) {

            return res.status(401).json({
                status: "error",
                message: "Email or password is incorrect."
            });

        }


        const passwordMatches =
            await bcrypt.compare(
                password,
                user.passwordHash
            );


        if (!passwordMatches) {

            return res.status(401).json({
                status: "error",
                message: "Email or password is incorrect."
            });

        }


        // ====================================================
        // CREATE A FRESH SESSION
        // ====================================================

        req.session.regenerate((error) => {

            if (error) {

                console.error(
                    "Failed to create login session:",
                    error.message
                );

                return res.status(500).json({
                    status: "error",
                    message: "The login could not be completed."
                });

            }


            // Store the logged-in user

            req.session.userId =
                user._id.toString();


            req.session.user = {
                id: user._id.toString(),
                name: user.name,
                email: user.email
            };


            // Save the session

            req.session.save((saveError) => {

                if (saveError) {

                    console.error(
                        "Failed to save login session:",
                        saveError.message
                    );

                    return res.status(500).json({
                        status: "error",
                        message: "The login could not be completed."
                    });

                }


                console.log(
                    `User logged in successfully: ${user.email}`
                );


                console.log(
                    `Session created: ${req.sessionID}`
                );


                res.json({
                    status: "success",
                    message: "Login successful.",
                    user: req.session.user
                });

            });

        });


    } catch (error) {

        console.error(
            "Failed to log in:",
            error.message
        );


        res.status(500).json({
            status: "error",
            message: "The login could not be completed."
        });

    }

});


// ============================================================
// SESSION DIAGNOSTIC
// ============================================================

router.get("/auth/debug", (req, res) => {

    res.json({

        sessionExists: !!req.session,

        sessionId:
            req.sessionID || null,

        userId:
            req.session.userId || null,

        user:
            req.session.user || null

    });

});


// ============================================================
// CHECK CURRENT LOGIN SESSION
// ============================================================

router.get("/auth/me", (req, res) => {

    if (!req.session.userId) {

        return res.status(401).json({
            status: "error",
            message: "You are not signed in."
        });

    }


    res.json({
        status: "success",
        authenticated: true,
        user: req.session.user
    });

});


// ============================================================
// LOG OUT
// ============================================================

router.post("/auth/logout", (req, res) => {

    req.session.destroy((error) => {

        if (error) {

            console.error(
                "Failed to log out:",
                error.message
            );

            return res.status(500).json({
                status: "error",
                message: "We could not sign you out."
            });

        }


        res.clearCookie("connect.sid");


        res.json({
            status: "success",
            message: "You have been signed out."
        });

    });

});


// ============================================================
// GET ALL SAVED REFLECTIONS
// ============================================================

router.get("/reflections", async (req, res) => {

    try {

        const db = req.app.locals.db;


        const reflections = await db
            .collection("reflections")
            .find({})
            .sort({ createdAt: -1 })
            .toArray();


        res.json({
            status: "success",
            reflections
        });


    } catch (error) {

        console.error(
            "Failed to load reflections:",
            error.message
        );


        res.status(500).json({
            status: "error",
            message: "The reflections could not be loaded."
        });

    }

});


// ============================================================
// SAVE A REFLECTION
// ============================================================

router.post("/reflections", async (req, res) => {

    try {

        const { reflection } = req.body;


        if (!reflection || !reflection.trim()) {

            return res.status(400).json({
                status: "error",
                message: "Reflection cannot be empty."
            });

        }


        const db = req.app.locals.db;


        const result = await db
            .collection("reflections")
            .insertOne({
                reflection: reflection.trim(),
                createdAt: new Date()
            });


        res.status(201).json({
            status: "success",
            message: "Reflection saved successfully.",
            id: result.insertedId
        });


    } catch (error) {

        console.error(
            "Failed to save reflection:",
            error.message
        );


        res.status(500).json({
            status: "error",
            message: "The reflection could not be saved."
        });

    }

});


module.exports = router;