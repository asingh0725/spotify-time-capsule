import { Request, Response } from "express";
import { Playlist } from "../models/playlist.model";

export const createPlaylistId = async (req: Request, res: Response) => {
  const { playlistId } = req.body;

  if (!playlistId) {
    return res.status(400).json({ message: "PlaylistID cannot be empty!" });
  }

  try {
    const created = await Playlist.create({ playlistId });
    res.json(created);
  } catch (err) {
    res.status(500).json({ status: "error", error: err });
  }
};

export const getPlaylistCount = async (_req: Request, res: Response) => {
  try {
    const count = await Playlist.countDocuments({});
    res.json({ count });
  } catch (err) {
    res.status(500).json({ status: "error", error: err });
  }
};