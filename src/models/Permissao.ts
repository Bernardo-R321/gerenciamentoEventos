import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('permissoes')
export class Permissao extends BaseEntity {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column()
  public descricao: string;
}
