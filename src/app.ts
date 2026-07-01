import express, { type Application, type Request, type Response, type NextFunction } from "express";
import { ApiError } from "./utils/apiError.utils.js";
import { sendError } from "./utils/apiResponse.js";
import userRoutes from "./routes/user.routes.js";

const app: Application = express();

app.use(express.json());

app.get("/health", (req: Request, res: Response) => {
    res.status(200).json({ success: true, message: "API is running..." });
});

// Routes
app.use("/api/v1/users", userRoutes);

// Handle 404 Not Found for unknown routes
app.use((req: Request, res: Response, next: NextFunction) => {
    next(new ApiError(404, `Route not found: ${req.method} ${req.originalUrl}`));
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

export default app;
