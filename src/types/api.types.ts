import { RequestMethodType } from "@prisma/client"
import { Headers } from "got"

export type API_REQUEST_TYPE = {
  endpoint: string,
  method: RequestMethodType,
  headers?: Headers,
  json?: object 
}