import { Router } from "express";
import TicketsController from "../controllers/ticket.controller";
import verifyToken from "../middleware/verifyToken";

class TicketRouter {
    private route: Router;
    private ticketsController: TicketsController;

    constructor() {
        this.route = Router();
        this.ticketsController = new TicketsController();
        this.initializeRoutes();
    }

    private initializeRoutes(): void {
        this.route.get("/", this.ticketsController.getAll);
        this.route.get("/:id", this.ticketsController.getById);
        this.route.get("/getData/getByUser", verifyToken.verifyToken, this.ticketsController.getByUser);
        this.route.post("/", verifyToken.verifyToken, this.ticketsController.create);
        this.route.patch("/:id", verifyToken.verifyToken, this.ticketsController.update);
        this.route.delete("/:id", verifyToken.verifyToken, this.ticketsController.delete);
    }

    public getRouter(): Router {
        return this.route;
    }
}

export default TicketRouter;