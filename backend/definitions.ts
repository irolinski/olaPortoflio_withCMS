import { Request } from "express"
export interface RequestWithSessionAndFlash extends Request {
  session?: any // or any other type
  flash: any
}

// export interface RequestWithFlash extends Request {
//   flash?: any // or any other type
// }

// export interface RequestWithSessionAndFlash extends Request {
//   session?: any // or any other type
//   flash?: any
// }

