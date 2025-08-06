import { Router } from "express";
import CityController from "../controllers/city.controller";

class CityRouter {
    private route: Router;
    private cityController: CityController;

    constructor() {
        this.route = Router();
        this.cityController = new CityController();
        this.initializeRoutes();
    }

    private initializeRoutes(): void {
        this.route.get("/", this.cityController.getAll);
    }

    public getRouter(): Router {
        return this.route;
    }
}

export default CityRouter;