import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Inscricao } from "./Inscricao";

@Entity('evento')
export class Evento extends BaseEntity {
    @PrimaryGeneratedColumn()
    public id: number;

    @Column()
    public nome: string;

    @Column()
    public descricao: string;

    @Column({ type: 'date' })
    public data_evento: String;

    @CreateDateColumn()
    public data_criacao: Date;

    @Column()
    public cidade: String

    @Column({ type: "char", default: "A" })
    public situacao: string;

    @OneToMany(() => Inscricao, (inscricao) => inscricao.usuario)
    inscricoes: Inscricao[]
}