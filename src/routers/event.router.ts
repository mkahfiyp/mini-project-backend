import { Router } from "express";
import EventController from "../controllers/event.controller";
import verifyToken from "../middleware/verifyToken";

class EventRouter {
    private route: Router;
    private eventController = new EventController

    constructor() {
        this.route = Router();
        this.eventController = new EventController();
        this.initializeRoutes();
    }

    private initializeRoutes(): void {
        this.route.get("/", this.eventController.getAll);
        this.route.get("/:id", this.eventController.getById);
        this.route.get("/detail/:name", this.eventController.getByName);
        this.route.get("/getData/getByUser", verifyToken.verifyToken, this.eventController.getByUser);
        this.route.post("/", verifyToken.verifyToken, this.eventController.create);
        this.route.patch("/:id", verifyToken.verifyToken, this.eventController.update);
        this.route.delete("/:id", verifyToken.verifyToken, this.eventController.delete);

        this.route.get("/purchase/getByNamePurchase", this.eventController.getByNamePurchase)
    }

    public getRouter(): Router {
        return this.route;
    }
}

export default EventRouter;