import { Request } from 'express';
export interface IRequestWithUser extends Request {
  user?: RequestUserPayload
}

export interface RequestUserPayload {
  id: string,
  email: string,
  monitors: number
}