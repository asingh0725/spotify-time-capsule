import mongoose, { Schema, Document } from "mongoose";

export interface IPlaylist extends Document {
  playlistId: string;
}

const PlaylistSchema = new Schema<IPlaylist>({
  playlistId: { type: String, required: true },
});

export const Playlist = mongoose.model<IPlaylist>("PlaylistIDs", PlaylistSchema);