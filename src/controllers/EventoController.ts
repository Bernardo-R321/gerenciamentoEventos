import { Request, Response } from 'express';
import { Evento } from '../models/Evento';
import { ILike } from 'typeorm';
import * as puppeteer from "puppeteer";


export class EventoController {

    async list(req: Request, res: Response): Promise<Response> {

        let eventos = await Evento.find();

        return res.status(200).json(eventos);
    }

    async find(req: Request, res: Response): Promise<Response> {
        let nome = req.query.nome;

        let eventos: Evento[] = await Evento.findBy({
            nome: nome ? ILike(`%${nome}%`) : undefined,
            situacao: 'A'
        });
        return res.status(200).json(eventos);
    }

    async create(req: Request, res: Response): Promise<Response> {
        let body = req.body;

        let evento: Evento = await Evento.create({
            nome: body.nome,
            descricao: body.descricao,
            data_evento: body.data,
            cidade: body.cidade,
            situacao: 'A'
        }).save();

        return res.status(200).json(evento);
    }

    async update(req: Request, res: Response): Promise<Response> {
        let body = req.body;
        let id = Number(req.params.id);
        console.log(id);
        let evento = await Evento.findOneBy({ id });

        if (evento != null) {

            evento.nome = body.nome;
            evento.descricao = body.descricao;
            evento.data_evento = body.data;
            evento.cidade = body.cidade;
            evento.situacao = body.situacao;
            await evento.save();
            return res.status(200).json('Evento atualizado com sucesso!');
        } else {
            return res.status(422).json({ error: 'Evento não encontrado!' });
        }


    }

    async delete(req: Request, res: Response): Promise<Response> {
        let idEvento = req.params.id

        let evento = await Evento.findOneBy({ id: Number(idEvento) });

        if (evento) {
            evento.situacao = 'I'
            await evento.save();
            return res.status(200).json(evento);
        } else {
            return res.status(422).json({ error: 'Evento não encontrado!' });
        }
    }
}