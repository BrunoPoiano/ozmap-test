import { User } from '../models'; // Ajuste o caminho conforme necessário

declare module 'express' {
  export interface Request {
    user?: User;
  }
}
