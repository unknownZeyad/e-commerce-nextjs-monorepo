export type CloudinaryResourceType = "image" | "video" | "raw"

export interface CloudinaryAssetsResponse {
  next_cursor: string,
  rate_limit_allowed: number,
  rate_limit_remaining: number,
  rate_limit_reset_at: Date,
  resources: {
    asset_id: string,
    public_id: string,
    format: string,
    version: number,
    resource_type: CloudinaryResourceType,
    url: string,
    secure_url: string,
    asset_folder: string,
    bytes: number,
    created_at: string,
    display_name: string,
    height: number,
    type: string,
    width: number
  }[]
}
