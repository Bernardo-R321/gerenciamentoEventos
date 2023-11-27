import { BaseEntity, Column, Entity, JoinColumn, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Inscricao } from "./Inscricao";

@Entity('usuario')
export class Usuario extends BaseEntity {
   @PrimaryGeneratedColumn()
   public id: number;

   @Column()
   public nome: string;

   @Column()
   public email: string;

   @Column({ select: false })
   public senha: string;

   @Column({ type: "char", default: "A" })
   public situacao: string;

   @OneToMany(() => Inscricao, (inscricao) => inscricao.usuario)
   inscricoes: Inscricao[]
}