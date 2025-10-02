const asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(error=>{
        next(error);
    });
};


// Method 2: Using try-catch block

// const asyncHandler = (fn) => async (req, res, next) => {
//     try {
//         await fn(req, res, next);
//     } catch (error) {
//         req.status(500).json({ 
//         success: false,
//         message: error.message 
//         });
//     }
// }

export default asyncHandler;
