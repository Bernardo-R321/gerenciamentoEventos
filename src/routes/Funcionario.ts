import { NextFunction, Request, Response, Router } from 'express';
import { FuncionarioController } from '../controllers/FuncionarioController';
import * as yup from 'yup';
import { Funcionario } from '../models/Funcionario';

async function validarPayload (req: Request, res: Response, next: NextFunction): Promise<Response|void> {
  let schema = yup.object({
    nome: yup.string().min(3).max(255).required(),
    email: yup.string().email().required(),
    senha: yup.string().min(6).max(16).required(),
    cpf: yup.string().min(3).max(255).required(),
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
  let funcionario: Funcionario|null = await Funcionario.findOneBy({ id });
  if (! funcionario) {
    return res.status(422).json({ error: 'Funcionario não encontrado!' });
  }

  res.locals.funcionario = funcionario;

  return next();
}


let router: Router = Router();

let funcionarioController: FuncionarioController = new FuncionarioController();

router.get('/funcionario', funcionarioController.list);

router.get('/funcionario/:id', validarSeExiste, funcionarioController.find);

router.post('/funcionario/email/:id', validarSeExiste, FuncionarioController.enviarEmail);

router.post('/funcionario', validarPayload, funcionarioController.create);

router.put('/funcionario/:id', validarSeExiste, funcionarioController.update);

router.delete('/funcionario/:id',validarSeExiste, funcionarioController.delete);

export default router;