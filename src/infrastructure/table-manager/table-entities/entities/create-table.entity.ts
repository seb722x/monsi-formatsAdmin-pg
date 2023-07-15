import { BeforeInsert, BeforeUpdate, Column, Entity, ManyToOne, OneToMany, OneToOne, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'materia' })
export class BaseTemplate {

    @PrimaryColumn()
    id: string;

    @Column('text', {
        unique: true,
    })
    name: string;

}