import { NextFunction, Request, Response, Router } from 'express';
import * as yup from 'yup';
import { PermissaoController } from '../controllers/PermissaoController';
import { Permissao } from '../models/Permissao';

async function validarPayload(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
  const schema = yup.object({
    descricao: yup.string().min(3).max(255).required(),
  });

  const payload = req.body;

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

async function validarSeExiste(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
  const id = Number(req.params.id);

  if (isNaN(id) || id <= 0) {
    return res.status(400).json({ error: 'Id inválido ' + id });
  }

  const permissao: Permissao | null = await Permissao.findOneBy({ id });

  if (!permissao) {
    return res.status(404).json({ error: 'Permissão não encontrado!' });
  }

  res.locals.permissao = permissao;

  return next();
}

let router: Router = Router();
let pController: PermissaoController = new PermissaoController();

router.get('/permissao', pController.list);

router.get('/permissao/:id', validarSeExiste, pController.find);

router.post('/permissao', validarPayload, pController.create);

router.put('/permissao/:id', validarSeExiste, pController.update);

router.delete('/permissao/:id',validarSeExiste, pController.delete);

export default router;