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
  const descricao: Permissao | null = await Permissao.findOneBy({ id });

  if (!descricao) {
    return res.status(404).json({ error: 'Descrição não encontrado!' });
  }

  res.locals.descricao = descricao;

  return next();
}

const router: Router = Router();
const pController: PermissaoController = new PermissaoController();

router.get('/permissoes', pController.list);

router.get('/permissoes/:id', validarSeExiste, pController.find);

router.post('/permissoes', validarPayload, pController.create);

router.put('/permissoes/:id', validarSeExiste, validarPayload, pController.update);

router.delete('/permissoes/:id', validarSeExiste, pController.delete);

export default router;