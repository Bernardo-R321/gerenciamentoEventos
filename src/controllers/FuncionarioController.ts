import { Funcionario} from '../models/Funcionario';
import { Request, Response } from 'express';
import { ILike } from "typeorm";
import * as nodemailer from "nodemailer";

export class FuncionarioController {

    async list (req: Request, res: Response): Promise<Response> {
        let funcionario: Funcionario[] = await Funcionario.find();

        return res.status(200).json(funcionario);
    }

    async create (req: Request, res: Response): Promise<Response> {
        let body = req.body;
       
        let funcionario: Funcionario = await Funcionario.create({
            nome: body.nome,
            email: body.email,
            senha: body.senha,
            cpf: body.cpf,
        }).save();
    
        return res.status(200).json(funcionario);
    }

    async delete (req: Request, res: Response): Promise<Response> {
        let funcionario: Funcionario = res.locals.funcionario;
    
        funcionario.remove();
        
        return res.status(200).json();
    }

    async find (req: Request, res: Response): Promise<Response> {
        let funcionario: Funcionario = res.locals.funcionario;
  
        return res.status(200).json(funcionario);
    }

   
    async update (req: Request, res: Response): Promise<Response> {
        let body = req.body;
        let funcionario: Funcionario = res.locals.funcionario;
    
        funcionario.nome = body.nome,
        funcionario.email = body.email,
        funcionario.senha = body.senha, 
        funcionario.cpf = body.cpf,
        await funcionario.save();
    
        return res.status(200).json(funcionario);
    } 

    async enviarEmail(req: Request, res: Response): Promise<Response> {
        let id = Number(req.params.id);

        let funcionario: Funcionario | null = await Funcionario.findOneBy({id});
        if (! funcionario) {
            return res.status(401).send("Erro ao enviar email");
        }
    
        let emailConfig = {
          host: "smtp.office365.com",
          port: 587,
          secure: false,
          tls: {
            rejectUnauthorized: false,
            ciphers: "SSLv3",
          },
          auth: {
            user: process.env.EMAIL_ADDRESS,
            pass: process.env.PASS,
          },
        };
    
        let mailOptions = {
          from: process.env.EMAIL_ADDRESS,
          to: funcionario.email,
          subject: "Email enviado pelo node",
          html: `Email para: ${funcionario.nome}`,
        };
    
        let transporter = nodemailer.createTransport(emailConfig);
    
        transporter.sendMail(mailOptions, async function (error, info) {
          if (error) {
            console.log("Erro ao enviar email:" + error);
            return res.status(401).send("Erro ao enviar email" + error);
          } else {
            console.log("Email enviado: " + info.response);
            return res.status(200).send("Email enviado: " + info.response);
          }
        });
    
        return res.status(401);
      }

}