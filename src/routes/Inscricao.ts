import { NextFunction, Request, Response, Router } from 'express';
import * as yup from 'yup';
import { Inscricao } from '../models/Inscricao';
import { InscricaoController } from '../controllers/InscricaoController';

async function validarPayload(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    let schema = yup.object({
        confirmacao: yup.string().min(1).max(1)
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

async function validarSeExiste(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    let id = Number(req.params.id);
    let inscricao: Inscricao | null = await Inscricao.findOneBy({ id });
    if (!inscricao) {
        return res.status(422).json({ error: 'Inscrição não encontrada!' });
    }

    res.locals.inscricao = inscricao;

    return next();
}


let router: Router = Router();

let inscricaoController: InscricaoController = new InscricaoController();

router.get('/inscricao', inscricaoController.list);

router.get('/inscricao/:id', validarSeExiste, inscricaoController.find);

// router.post('/funcionario/email/:id', validarSeExiste, FuncionarioController.enviarEmail);

router.post('/inscricao', inscricaoController.create);

router.put('/inscricao/:id', validarSeExiste, inscricaoController.update);

router.delete('/inscricao/:id', validarSeExiste, inscricaoController.delete);

export default router;