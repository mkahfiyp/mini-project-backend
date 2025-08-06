import { Router } from "express";
import CategoriesController from "../controllers/category.controller";

class CategoryRouter {
    private route: Router;
    private categoriesController: CategoriesController;

    constructor() {
        this.route = Router();
        this.categoriesController = new CategoriesController();
        this.initializeRoutes();
    }

    private initializeRoutes(): void {
        this.route.get("/", this.categoriesController.getAll);
        this.route.get("/:id", this.categoriesController.getById);
        this.route.post("/", this.categoriesController.create);
        this.route.patch("/:id", this.categoriesController.update);
        this.route.delete("/:id", this.categoriesController.delete);
    }

    public getRouter(): Router {
        return this.route;
    }
}

export default CategoryRouter;