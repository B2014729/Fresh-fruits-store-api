import express from 'express';
import middelewareConfig from './configs/middlewareConfig.js';
import initWebRoute from './routers/index.js';
import MongoDB from './configs/mongoDBConfig.js';
import ApiError from './api-error.js';


const startServe = async () => {
    try {
        const app = express();
        const PORT = 8081;

        middelewareConfig(app);
        initWebRoute(app);

        await MongoDB.connect("mongodb://127.0.0.1:27017/fresh-fruits");
        console.log("Connected to the database!");

        app.use((req, res, next) => {
            return next(new ApiError(404, "Resource not found"));
        })

        app.use((err, req, res, next) => {
            return res.status(err.statusCode || 500).json({
                message: err.message || "Internal Server Error",
            });
        });

        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        })

    } catch (error) {
        console.log(error);
    }
}

startServe();