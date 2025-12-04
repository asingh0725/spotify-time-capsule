import { Router } from "express";
import {
  createPlaylistId,
  getPlaylistCount,
} from "../controllers/playlist.controller";

const router = Router();

router.post("/", createPlaylistId);
router.get("/playlistIds", getPlaylistCount);

export default router;