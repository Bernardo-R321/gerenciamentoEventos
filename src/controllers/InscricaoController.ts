import { Request, Response } from 'express';
import { Inscricao } from '../models/Inscricao';
import { ILike } from 'typeorm';
import * as puppeteer from "puppeteer";
import { Usuario } from '../models/Usuario';
import { Evento } from '../models/Evento';


export class InscricaoController {

    async list(req: Request, res: Response): Promise<Response> {

        let inscricoes = await Inscricao.find();

        return res.status(200).json(inscricoes);
    }

    async find(req: Request, res: Response): Promise<Response> {
        let id = Number(req.params.id);

        let inscricao: Inscricao[] = await Inscricao.findBy({
            id: id,
            situacao: 'A'
        });
        return res.status(200).json(inscricao);
    }

    async create(req: Request, res: Response): Promise<Response> {

        let idEvento = req.body.evento;
        let idUsuario = req.body.usuario;
        console.log(idEvento);
        let evento = await Evento.findOneBy({ id: idEvento });
        let usuario = await Usuario.findOneBy({ id: idUsuario });
        console.log(evento);

        if (evento == null) {
            return res.status(422).json({ error: 'Evento  não encontrado!' });

        }

        if (usuario == null) {
            return res.status(422).json({ error: 'Usuário não encontrado!' });
        }

        if (evento && usuario != null) {
            let inscricao: Inscricao = await Inscricao.create({
                evento,
                usuario,
            }).save();

            return res.status(200).json(inscricao);
        }

        return res.status(500).json({ error: 'Algo deu errado!' });
    }

    async update(req: Request, res: Response): Promise<Response> {
        let body = req.body;
        let id = Number(req.params.id);
        console.log(id);
        let inscricao = await Inscricao.findOneBy({ id });
        let evento = await Evento.findOneBy(body.evento);
        let usuario = await Usuario.findOneBy(body.usuario);

        if (evento == null) {
            return res.status(422).json({ error: 'Evento  não encontrado!' });

        }

        if (usuario == null) {
            return res.status(422).json({ error: 'Usuário não encontrado!' });
        }

        if (inscricao != null && evento != null && usuario != null) {

            inscricao.evento = evento;
            inscricao.usuario = usuario;
            inscricao.situacao = body.situacao;
            inscricao.confirmacao = body.confirmacao;
            await inscricao.save();
            return res.status(200).json('Inscrição atualizada com sucessa!');
        } else {
            return res.status(422).json({ error: 'Inscrição não encontrada!' });
        }


    }

    async delete(req: Request, res: Response): Promise<Response> {
        let id = req.params.id

        let inscricao = await Inscricao.findOneBy({ id: Number(id) });

        if (inscricao) {
            inscricao.situacao = 'I'
            await inscricao.save();
            return res.status(200).json(inscricao);
        } else {
            return res.status(422).json({ error: 'Inscrição não encontrada!' });
        }
    }
}