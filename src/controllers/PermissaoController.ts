import { Request, Response } from "express";
import { Permissao } from "../models/Permissao";
import { ILike } from "typeorm";

export class PermissaoController {

  async list(req: Request, res: Response): Promise<Response> {
    let descricao = req.query.descricao;

    let permissoes: Permissao[] = await Permissao.findBy({
      descricao: descricao ? ILike(`%${descricao}%`) : undefined,
    });

    return res.status(200).json(permissoes);
  }

  async find(req: Request, res: Response): Promise<Response> {
    let permissao: Permissao = res.locals.descricao;

    return res.status(200).json(permissao);
  }

  async create(req: Request, res: Response): Promise<Response> {
    let body = req.body;

    let permissao: Permissao = await Permissao.create({
      descricao: body.descricao,
    }).save();

    return res.status(200).json(permissao);
  }

  async update(req: Request, res: Response): Promise<Response> {
    let body = req.body;
    let permissao: Permissao = res.locals.usuario;

    permissao.descricao = body.descricao;
    await permissao.save();

    return res.status(200).json(permissao);
  }

  async delete(req: Request, res: Response): Promise<Response> {
    let permissao: Permissao = res.locals.usuario;

    permissao.remove();

    return res.status(200).json();
  }
}
