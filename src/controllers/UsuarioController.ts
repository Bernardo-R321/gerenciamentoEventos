import { Request, Response } from 'express';
import { Usuario } from '../models/Usuario';
import { ILike } from 'typeorm';
import bcrypt from 'bcrypt';
import * as puppeteer from "puppeteer";

export class UsuariosController {

  async login(req: Request, res: Response): Promise<Response> {
    let email = req.body.email;
    let senha = req.body.senha;

    let usuario: Usuario | null = await Usuario.findOne({
      where: {
        email: email,
      },
      select: ["id", "email", "senha", "nome"],
    });
    if (!usuario) {
      return res.status(401).json({ mensagem: "Usuário ou senha inválida" });
    }
    let resultado = await bcrypt.compare(senha, usuario.senha);

    if (!resultado) {
      return res.status(401).json({ mensagem: "Usuário ou senha inválida" });
    }

    let token: string = Buffer.from(`${email}:${senha}`).toString("base64");

    return res.status(200).json({
      token,
      type: "Basic",
      id: usuario.id,
      nome: usuario.nome,
      email: usuario.email,
    });
  }

  async list (req: Request, res: Response): Promise<Response> {
    let nome = req.query.nome;

    let users: Usuario[] = await Usuario.findBy({
      nome: nome ? ILike(`%${nome}%`) : undefined
    });

    return res.status(200).json(users);
  }

  async find (req: Request, res: Response): Promise<Response> {
    let usuario: Usuario = res.locals.usuario;

    return res.status(200).json(usuario);
  }

  async create (req: Request, res: Response): Promise<Response> {
    let body = req.body;

    let senha = await bcrypt.hash(body.senha, 10);

    let usuario: Usuario = await Usuario.create({
      nome: body.nome,
      email: body.email,
      senha: senha,
    }).save();

    let { senha: s, ...usuarioSemSenha } = usuario;

    return res.status(200).json(usuarioSemSenha);
  }
}