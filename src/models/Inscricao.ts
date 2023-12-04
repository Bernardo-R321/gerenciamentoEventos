import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Usuario } from "./Usuario";
import { Evento } from "./Evento";

@Entity('inscricao')
export class Inscricao extends BaseEntity {
    @PrimaryGeneratedColumn()
    public id: number;

    @CreateDateColumn()
    public data_criacao: Date;

    @Column({ type: 'char', default: 'N' })
    public confirmacao: string

    @Column({ type: "char", default: "A" })
    public situacao: string;

    @ManyToOne(() => Usuario, usuario => usuario.inscricoes, {
        eager: true
    })
    public usuario: Usuario;

    @ManyToOne(() => Evento, evento => evento.inscricoes, {
        eager: true
    })
    public evento: Evento;
}