import { Router } from "express"
import ReviewController from "../controllers/review.controller"

class ReviewRouter {
    private route: Router
    private reviewController = new ReviewController

    constructor() {
        this.route = Router()
        this.reviewController = new ReviewController()
        this.initializeRoutes()
    }

    private initializeRoutes(): void {
        this.route.get("/", this.reviewController.getAll)
    }

    public getRouter(): Router {
        return this.route;
    }
}

export default ReviewRouter