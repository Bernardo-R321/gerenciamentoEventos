import express, { Express, NextFunction, Request, Response } from 'express';
import cors from 'cors';


let server: Express = express();

server.use(cors());
server.use(express.json());

server.use((req: Request, res: Response, next: NextFunction) => {
  console.log('[' + (new Date()) + '] ' + req.method + ' ' + req.url);
  next();
});


export default {
  start () {
    server.listen(3000, () => {
      console.log('Server started!');
    });
  }
};
