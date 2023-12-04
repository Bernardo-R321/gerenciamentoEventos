import { Request, Response } from 'express';
import { Inscricao } from '../models/Inscricao';
import { ILike } from 'typeorm';
import * as puppeteer from "puppeteer";
import { Usuario } from '../models/Usuario';
import { Evento } from '../models/Evento';
import nodemailer from 'nodemailer';


export class InscricaoController {

  async list(req: Request, res: Response): Promise<Response> {

    let inscricoes = await Inscricao.find({
      where: {
        situacao: 'A'
      }
    });

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

    let idEvento = req.body.idEvento;
    let idUsuario = req.body.idUsuario;
    console.log(idUsuario);
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

      const transporter = nodemailer.createTransport({
        host: "sandbox.smtp.mailtrap.io",
        port: 2525,
        auth: {
          user: "e6761e1c8a4deb",
          pass: "f51e7191a56a99"
        }

      });

      await transporter.sendMail({
        from: '"Gestor de eventos" <eventoscrie.ti@gmail.com>',
        to: `"${usuario.nome}" <${usuario.email}>`,
        subject: "Sua inscrição foi realizada!",
        text: "Sua inscrição para o evento: " + evento.nome + " foi realizada com sucesso!"
      });

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
  async listCsv(req: Request, res: Response): Promise<Response> {
    let nome = req.query.nome;

    let users: Inscricao[] = await Inscricao.findBy({
      evento: Inscricao ? ILike(`${Inscricao}`) : undefined,
    });

    let header = '"Inscrição";"Evento","Descrição", "Usuario",\n';
    let csv = header;

    users.forEach((element) => {
      csv += `"${element.situacao}";"${element.confirmacao}";"${element.evento}";"${element.usuario}",\r`;
    });

    res.append("Content-Type", "text/csv");
    res.attachment("Inscricao.csv");
    return res.status(200).send(csv);
  }
  async downloadPdf(req: Request, res: Response) {
    let inscricao = req.query.inscricao;
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

    let users: Inscricao[] = await Inscricao.findBy({
      evento: inscricao ? ILike(`${inscricao}`) : undefined,
    });
    html += "<tr><th>Nome</th><th>Email</th></tr>";
    users.forEach((element) => {
      html += `<tr><td>${element.situacao}</td> <td>${element.confirmacao}</td><td>${element.evento}</td><td>${element.usuario}</td></tr>\r`;
    });
    html += "</table>";
    let today = new Date(Date.now());
    let data = today.toLocaleString(); // "30/1/2022"
    html += `<div>Gerado por: Amanda às ${data}</div>`;

    let pdfBuffer = await InscricaoController.pdf(html);

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

  async encontrarInscricao(req: Request, res: Response) {
    let email = req.body.email;
    let idEvento = req.body.idEvento;

    let resposta = await Inscricao.find({
      relations: {
        evento: true,
        usuario: true
      },
      where: {
        evento: {
          id: idEvento
        },
        usuario: {
          email
        },
        situacao: 'A',
        confirmacao: 'N'
      }
    });

    return res.status(200).json(resposta);
  }

  async confirmarInscricao(req: Request, res: Response) {
    let id = Number(req.params.idInscricao)
    let inscricao = await Inscricao.findOneBy({ id });

    if (inscricao != null) {
      inscricao.confirmacao = 'S'
      await inscricao.save();
      return res.status(200).json('Inscrição confirmada!');
    } else {
      return res.status(422).json('Falha ao confirmar!');
    }


  }

}