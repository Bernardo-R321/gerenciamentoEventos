import { NextFunction, Request, Response, Router } from 'express';
import { UsuariosController } from '../controllers/UsuarioController';
import * as yup from 'yup';
import { Usuario } from '../models/Usuario';
import { Not } from 'typeorm';

async function validarPayload (req: Request, res: Response, next: NextFunction): Promise<Response|void> {
  let schema = yup.object({
    nome: yup.string().min(3).max(255).required(),
    email: yup.string().email().required(),
    senha: yup.string().min(6).max(16).required(),
  });

  let payload = req.body;

  try {
    req.body = await schema.validate(payload, { abortEarly: false, stripUnknown: true });

    return next();
  } catch (error) {
    if (error instanceof yup.ValidationError) {
      return res.status(400).json({ errors: error.errors });
    }
    return res.status(500).json({ error: 'Ops! Algo deu errado.' });
  }
}

async function validarSeExiste (req: Request, res: Response, next: NextFunction): Promise<Response|void> {
  let id = Number(req.params.id);
  let usuario: Usuario|null = await Usuario.findOneBy({ id });
  if (! usuario) {
    return res.status(422).json({ error: 'Usuario não encontrado!' });
  }

  res.locals.usuario = usuario;

  return next();
}

async function validarSeEmailExiste (req: Request, res: Response, next: NextFunction): Promise<Response|void> {
  let email: string = req.body.email;
  let id: number|undefined = req.params.id ? Number(req.params.id) : undefined;

  let usuario: Usuario|null = await Usuario.findOneBy({ email, id: id ? Not(id) : undefined });
  if (usuario) {
    return res.status(422).json({ error: 'Email já cadastrado!' });
  }

  return next();
}

let router: Router = Router();

let usuariosController: UsuariosController = new UsuariosController();

router.get('/usuarios', usuariosController.list);

router.get('/usuarios/:id', validarSeExiste, usuariosController.find);

router.post('/usuarios', validarPayload, validarSeEmailExiste, usuariosController.create);

router.put('/usuarios/:id', validarSeExiste, validarPayload, validarSeEmailExiste, usuariosController.update);

router.delete('/usuarios/:id', validarSeExiste, usuariosController.delete);


export default router;