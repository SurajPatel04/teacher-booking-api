import express, { type Application, type Request, type Response, type NextFunction } from "express";
import { ApiError } from "./utils/apiError.utils.js";
import { sendError } from "./utils/apiResponse.js";

const app: Application = express();

app.use(express.json());

app.get("/health", (req: Request, res: Response) => {
    res.status(200).json({ success: true, message: "API is running..." });
});

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    let statusCode = 500;
    let message = "Internal Server Error";
    let errors: any = undefined;

    if (err instanceof ApiError) {
        statusCode = err.statusCode;
        message = err.message;
        errors = err.errors;
    } else if (err.message) {
        message = err.message;
    }

    sendError(res, message, statusCode, errors);
});

export { app };
