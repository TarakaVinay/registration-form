const registrationErrorHandler = (err, req, res, next) => {
    console.error("❌ Registration API Error:", err.stack);
    res.status(500).json({ message: "Internal Server Error", error: err.message });
};

export default registrationErrorHandler;
