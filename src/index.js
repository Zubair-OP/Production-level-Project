import dotenv from 'dotenv';
dotenv.config({
    path: './.env'
});
import express from 'express';
import mongoose from 'mongoose';
import { DB_NAME } from './constants.js';
import MONGO_DB from './db/index.js';
import app from './app.js';

MONGO_DB()
.then(()=>{
    app.listen(process.env.PORT, () => {
        console.log(`Server is running on port ${process.env.PORT}`);
    });
    app.on('error', (err) => {
        console.error("Error :", err);
        throw err;
    });
})
.catch((err) => {
    console.error("Error :", err);
    throw err;
});


// (async () => {
//     try {
//         await mongoose.connect(`${process.env.MONGO_URI}/${DB_NAME}`);
//         app.on('error', (err) => {
//             console.error("Error :", err);
//             throw err;
//         });

//         app.listen(process.env.PORT, () => {
//             console.log(`Server is running on port ${process.env.PORT}`);
//         })
//     } catch (error) {
//         console.error("Error :", error);
//         throw error;
//     }
// })();