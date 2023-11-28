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
      nome: nome ? ILike(`%${nome}%`) : undefined,
      situacao: 'A'
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

  async update(req: Request, res: Response): Promise<Response> {
    let body = req.body;
    let usuario: Usuario = res.locals.usuario;

    let senha = await bcrypt.hash(body.senha, 10);

    usuario.nome = body.nome;
    usuario.email = body.email;
    usuario.senha = senha;
    await usuario.save();
    let { senha: s, ...usuarioSemSenha } = usuario;

    return res.status(200).json(usuarioSemSenha);
  }

  async delete(req: Request, res: Response): Promise<Response> {
    let usuario: Usuario = res.locals.usuario;

    usuario.situacao = 'I';
    await usuario.save();
    
    let { senha: s, ...usuarioSemSenha } = usuario;

    return res.status(200).json(usuarioSemSenha);
  }

  async listCsv(req: Request, res: Response): Promise<Response> {
    let nome = req.query.nome;

    let users: Usuario[] = await Usuario.findBy({
      nome: nome ? ILike(`${nome}`) : undefined,
    });

    let header = '"ID";"Nome";"Email"\n';
    let csv = header;

    users.forEach((element) => {
      csv += `"${element.id}";"${element.nome}";"${element.email}"\r`;
    });

    res.append("Content-Type", "text/csv");
    res.attachment("usuarios.csv");
    return res.status(200).send(csv);
  }
  async downloadPdf(req: Request, res: Response) {
    let nome = req.query.nome;
    let html: string = `<style>
    *{
      font-family: "Arial";
    }
    table{
      width:100%;
      text-align: left;
      border-collapse: collapse;
      margin-bottom: 10px;
    }
    table td{
      padding: 10px
    }
    table th{
      padding: 10px
    }
    </style>
    <h1>Lista de usuários</h1>
  <table border="1">`;

    let users: Usuario[] = await Usuario.findBy({
      nome: nome ? ILike(`${nome}`) : undefined,
    });
    html += "<tr><th>Nome</th><th>Email</th></tr>";
    users.forEach((element) => {
      html += `<tr><td>${element.nome}</td> <td>${element.email}</td></tr>\r`;
    });
    html += "</table>";
    let today = new Date(Date.now());
    let data = today.toLocaleString(); // "30/1/2022"
    html += `<div>Gerado por: Amanda às ${data}</div>`;

    let pdfBuffer = await UsuariosController.pdf(html);

    res.append("Content-Type", "application/x-pdf");
    res.append("Content-Disposition", 'attachment; filename="output.pdf"');
    res.send(pdfBuffer);
  }

  static async pdf(html: string) {
    const browser = await puppeteer.launch({ headless: "new" });
    const page = await browser.newPage();
    await page.setViewport({ width: 1366, height: 768 });
    await page.setContent(html);

    const pdfBuffer = await page.pdf();
    await page.close();
    await browser.close();

    return pdfBuffer;
  }

}