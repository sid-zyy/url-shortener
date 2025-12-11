import express from "express";
import { getUrl, postUrl } from "../controller/urlController.js";

const router = express.Router();

router.get("/:hashId", getUrl);
router.post("/", postUrl);

export default router;
