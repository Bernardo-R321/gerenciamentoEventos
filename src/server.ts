import express, { Express, NextFunction, Request, Response } from 'express';
import cors from 'cors';

import usuarios from "./routes/Usuario";
import funcinarios from "./routes/Funcionario";
import permissao from "./routes/Permissao";
 
const PORT: Number = Number(process.env.SERVER_PORT || 3000);

let server: Express = express();

server.use(cors());
server.use(express.json());

server.use(usuarios);
server.use(funcinarios);
server.use(permissao)

server.use((req: Request, res: Response, next: NextFunction) => {
  console.log('[' + (new Date()) + '] ' + req.method + ' ' + req.url);
  next();
});


export default {
  start () {
    server.listen(PORT, () => {
      console.log(`Server started on port ${PORT}!`);
    });
  }
};
