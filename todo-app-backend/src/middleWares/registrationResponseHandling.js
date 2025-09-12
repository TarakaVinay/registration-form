export const handleRegistrationResponse = (res, statusCode, message, data = null) => {
    res.status(statusCode).json({
        success: statusCode >= 200 && statusCode < 300, // true if 2xx
        message,
        data,
    });
};
