import dotenv from "dotenv";
import cors from "cors";
import express, { Application, Request, Response } from "express";
import AuthRouter from "./routers/auth.router";
import EventRouter from "./routers/event.router";
import CategoryRouter from "./routers/category.router";
import TicketRouter from "./routers/ticket.router";
import ReviewRouter from "./routers/review.router";
import VoucherRouter from "./routers/voucher.router";
import TransactionRouter from "./routers/transaction.router";
import CityRouter from "./routers/city.router";
import PaymentRouter from "./routers/payment.router";
import UserRouter from "./routers/user.router";

dotenv.config();
const PORT: string = process.env.PORT || "8181";

class App {
    public app: Application;

    constructor() {
        this.app = express();
        this.configure();
        this.route();
    }

    private configure(): void {
        this.app.use(cors());
        this.app.use(express.json());
    }

    private route(): void {
        this.app.get("/", (req: Request, res: Response) => {
            res.status(200).send("<h1>Classbase API</h1>");
        });

        const authRouter = new AuthRouter();
        this.app.use("/auth", authRouter.getRouter());

        const eventRouter = new EventRouter();
        this.app.use("/event", eventRouter.getRouter());

        const categoryRouter = new CategoryRouter();
        this.app.use("/category", categoryRouter.getRouter());

        const cityRouter = new CityRouter();
        this.app.use("/city", cityRouter.getRouter());

        const ticketRouter = new TicketRouter();
        this.app.use("/ticket", ticketRouter.getRouter());

        const reviewRouter = new ReviewRouter()
        this.app.use("/review", reviewRouter.getRouter())

        const voucherRouter = new VoucherRouter()
        this.app.use("/voucher", voucherRouter.getRouter())

        const transactionRouter = new TransactionRouter();
        this.app.use("/transaction", transactionRouter.getRouter());

        const paymentRouter = new PaymentRouter();
        this.app.use("/payment", paymentRouter.getRouter());

        const userRouter = new UserRouter();
        this.app.use("/user", userRouter.getRouter());
    }

    public start(): void {
        this.app.listen(Number(PORT), () => {
            console.log(`API RUNNING : http://localhost:${PORT}`);
        });
    }
}

export default App;