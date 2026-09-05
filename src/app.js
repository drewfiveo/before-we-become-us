javascript
const express = require("express");
const path = require("path");
const session = require("express-session");
require("dotenv").config();

const pageRoutes = require("./routes/pageRoutes");
const apiRoutes = require("./routes/apiRoutes");
const { connectDatabase } = require("./config/database");

const app = express();
const PORT = process.env.PORT || 3000;


// ============================================================
// MIDDLEWARE
// ============================================================

// Allow the server to receive JSON data
app.use(express.json());

// Allow the server to receive form data
app.use(express.urlencoded({ extended: true }));


// Serve files from the public folder
app.use(
    express.static(
        path.join(__dirname, "..", "public")
    )
);


// ============================================================
// LOGIN SESSIONS
// ============================================================

app.use(
    session({
        secret: process.env.SESSION_SECRET,

        resave: false,

        saveUninitialized: false,

        cookie: {
            httpOnly: true,
            sameSite: "lax",

            // Local development uses HTTP.
            // Production uses HTTPS.
            secure: process.env.NODE_ENV === "production",

            // Keep the session for 7 days
            maxAge: 1000 * 60 * 60 * 24 * 7
        }
    })
);


// ============================================================
// ROUTES
// ============================================================

app.use("/", pageRoutes);

app.use("/api", apiRoutes);


// ============================================================
// 404 HANDLER
// ============================================================

app.use((req, res) => {

    res.status(404).json({
        status: "error",
        message: "The requested resource was not found."
    });

});


// ============================================================
// START SERVER
// ============================================================

async function startServer() {

    try {

        const db = await connectDatabase();

        // Make the database available to our routes
        app.locals.db = db;


       app.listen(PORT, "0.0.0.0", () => {

    console.log(
        `Before We Become Us running on port ${PORT}`
    );

});

    } catch (error) {

        console.error(
            "Application failed to start."
        );

    }

}


startServer();

