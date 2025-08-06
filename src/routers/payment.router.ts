import { Router } from "express";
import PaymentsController from "../controllers/payment.controller";
import verifyToken from "../middleware/verifyToken";
import { uploaderMemory } from "../middleware/uploader";

class PaymentRouter {
    private route: Router;
    private paymentController = new PaymentsController;

    constructor() {
        this.route = Router();
        this.paymentController = new PaymentsController();
        this.initializeRoutes();
    }

    private initializeRoutes(): void {
        this.route.patch("/:id", verifyToken.verifyToken, uploaderMemory().single("img"), this.paymentController.postPayment);
    }

    public getRouter(): Router {
        return this.route;
    }
}
export default PaymentRouter;