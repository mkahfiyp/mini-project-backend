import { Router } from "express";
import TransactionsController from "../controllers/transaction.controller";
import verifyToken from "../middleware/verifyToken";

class TransactionRouter {
    private route: Router;
    private transactionsController: TransactionsController;

    constructor() {
        this.route = Router();
        this.transactionsController = new TransactionsController();
        this.initializeRoutes();
    }

    private initializeRoutes(): void {
        this.route.get("/", verifyToken.verifyToken, this.transactionsController.getByUser);
        this.route.get("/:id", this.transactionsController.get);
        this.route.post("/", verifyToken.verifyToken, this.transactionsController.create);
    }

    public getRouter(): Router {
        return this.route;
    }
}

export default TransactionRouter;