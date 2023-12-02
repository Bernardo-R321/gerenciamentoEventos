import { Request, Response } from 'express';
import { Evento } from '../models/Evento';
import { ILike } from 'typeorm';
import * as puppeteer from "puppeteer";


export class EventoController {

  async list(req: Request, res: Response): Promise<Response> {

    let eventos = await Evento.find({
      where: {
        situacao: 'A'
      }
    });

    return res.status(200).json(eventos);
  }

  async find(req: Request, res: Response): Promise<Response> {
    let id = Number(req.params.id);

    let evento = await Evento.findOneBy({ id });
    return res.status(200).json(evento);
  }

  async create(req: Request, res: Response): Promise<Response> {
    let body = req.body;

    let evento: Evento = await Evento.create({
      nome: body.nome,
      descricao: body.descricao,
      data_evento: body.data_evento,
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
      evento.data_evento = body.data_evento;
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
  async listCsv(req: Request, res: Response): Promise<Response> {
    let evento = req.query.evento;

    let users: Evento[] = await Evento.findBy({
      data_evento: evento ? ILike(`${evento}`) : undefined,
    });

    let header = '"Nome";"Descrição","Data","Cidade","Situação",\n';
    let csv = header;

    users.forEach((element) => {
      csv += `"${element.nome}";"${element.descricao}";"${element.data_evento}";"${element.cidade}";"${element.situacao}",\r`;
    });

    res.append("Content-Type", "text/csv");
    res.attachment("evento.csv");
    return res.status(200).send(csv);
  }
  async downloadPdf(req: Request, res: Response) {
    let evento = req.query.evento;
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

    let users: Evento[] = await Evento.findBy({
      data_evento: evento ? ILike(`${evento}`) : undefined,
    });
    html += "<tr><th>Nome</th><th>Email</th></tr>";
    users.forEach((element) => {
      html += `<tr><td>${element.nome}</td> <td>${element.descricao}</td><td>${element.data_evento}</td><td>${element.cidade}</td><td>${element.situacao}</td></tr>\r`;
    });
    html += "</table>";
    let today = new Date(Date.now());
    let data = today.toLocaleString(); // "30/1/2022"
    html += `<div>Gerado por: Amanda às ${data}</div>`;

    let pdfBuffer = await EventoController.pdf(html);

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