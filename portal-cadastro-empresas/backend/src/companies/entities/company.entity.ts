import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export enum TipoPessoa {
  JURIDICA = 'JURIDICA',
  FISICA = 'FISICA',
  ESTRANGEIRA = 'ESTRANGEIRA',
}

export enum PerfilEmpresa {
  DESPACHANTE = 'DESPACHANTE',
  BENEFICIARIO = 'BENEFICIARIO',
  CONSIGNATARIO = 'CONSIGNATARIO',
  ARMADOR = 'ARMADOR',
  AGENTE_CARGA = 'AGENTE_CARGA',
  TRANSPORTADORA = 'TRANSPORTADORA',
}

export enum StatusEmpresa {
  PENDENTE = 'PENDENTE',
  APROVADA = 'APROVADA',
  REPROVADA = 'REPROVADA',
}

@Entity('empresas')
export class Company {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'enum', enum: TipoPessoa })
  tipoPessoa: TipoPessoa;

  @Column({ nullable: true })
  razaoSocial: string;

  @Column({ nullable: true })
  cnpj: string;

  @Column({ nullable: true })
  cpf: string;

  @Column({ nullable: true })
  identificadorEstrangeiro: string;

  @Column()
  nomeFantasia: string;

  @Column({ type: 'enum', enum: PerfilEmpresa })
  perfil: PerfilEmpresa;

  @Column({ default: false })
  faturamentoDireto: boolean;

  @Column({ type: 'enum', enum: StatusEmpresa, default: StatusEmpresa.PENDENTE })
  status: StatusEmpresa;

  @Column({ nullable: true })
  documentoComprobatorio: string;

  @Column({ nullable: true })
  documentoOpcional: string;

  @Column({ nullable: true })
  motivoReprovacao: string;

  @Column({ nullable: true })
  usuarioResponsavel: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}