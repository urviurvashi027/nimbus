export interface GetWorkoutVideoRequest {
  userID: string;
  location: string;
}

export interface GetWorkoutVideoResponse {
  data: any;
}

export interface GetSoundscapeListRequest {
  userID: string;
  location: string;
}

export interface GetSoundscapeListResponse {
  message: string;
}

export interface DownloadMediaListRequest {
  userID: string;
  location: string;
}

export interface DownloadMediaListResponse {
  data: any;
}
