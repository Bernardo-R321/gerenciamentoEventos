import { BaseEntity, Column, Entity, JoinColumn, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn, JoinTable } from "typeorm";


@Entity('funcionario')
export class Funcionario extends BaseEntity {
   @PrimaryGeneratedColumn()
   public id: number;

   @Column()
   public nome: string;

   @Column()
   public email: string;
   
   @Column()
   public senha: string;

   @Column()
   public cpf: number;

 
}