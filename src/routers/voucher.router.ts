import { Router } from "express";
import VouchersController from "../controllers/voucher.controller";
import verifyToken from "../middleware/verifyToken";

class TicketRouter {
    private route: Router;
    private vouchersController: VouchersController;

    constructor() {
        this.route = Router();
        this.vouchersController = new VouchersController();
        this.initializeRoutes();
    }

    private initializeRoutes(): void {
        this.route.get("/", this.vouchersController.getAll)
        this.route.get("/getAllByUser", verifyToken.verifyToken, this.vouchersController.getAllByUser);
        this.route.post("/", verifyToken.verifyToken, this.vouchersController.create)
    }

    public getRouter(): Router {
        return this.route;
    }
}

export default TicketRouter;