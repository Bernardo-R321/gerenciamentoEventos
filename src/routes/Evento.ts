import { NextFunction, Request, Response, Router } from 'express';
import { EventoController } from '../controllers/EventoController';
import * as yup from 'yup';
import { Evento } from '../models/Evento';

async function validarPayload(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    let schema = yup.object({
        nome: yup.string().min(3).max(255).required(),
        descricao: yup.string().min(3).max(255).required(),
        cidade: yup.string().min(6).max(16).required(),
        situacao: yup.string().min(1).max(1).required(),
        data: yup.string()
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
    let evento: Evento | null = await Evento.findOneBy({ id });
    if (!evento) {
        return res.status(422).json({ error: 'Evento não encontrado!' });
    }

    res.locals.evento = evento;

    return next();
}


let router: Router = Router();

let eventoController: EventoController = new EventoController();

router.get('/evento', eventoController.list);

router.get('/evento/:id', validarSeExiste, eventoController.find);

// router.post('/funcionario/email/:id', validarSeExiste, FuncionarioController.enviarEmail);

router.post('/evento', validarPayload, eventoController.create);

router.put('/evento/:id', validarSeExiste, eventoController.update);

router.delete('/evento/:id', validarSeExiste, eventoController.delete);

export default router;