import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, IsString, IsBoolean, ValidateIf, Length, Matches } from 'class-validator';
import { TipoPessoa, PerfilEmpresa } from '../entities/company.entity';

export class CreateCompanyDto {
  @ApiProperty({ enum: TipoPessoa, description: 'Tipo de pessoa' })
  @IsEnum(TipoPessoa)
  @IsNotEmpty({ message: 'Tipo de pessoa é obrigatório' })
  tipoPessoa: TipoPessoa;

  @ApiPropertyOptional({ description: 'Razão Social (obrigatório para Jurídica e Estrangeira)' })
  @ValidateIf(o => o.tipoPessoa === TipoPessoa.JURIDICA || o.tipoPessoa === TipoPessoa.ESTRANGEIRA)
  @IsNotEmpty({ message: 'Razão Social é obrigatória' })
  @IsString()
  @Length(3, 255, { message: 'Mínimo de 3 caracteres' })
  razaoSocial?: string;

  @ApiPropertyOptional({ description: 'CNPJ (obrigatório para Jurídica)' })
  @ValidateIf(o => o.tipoPessoa === TipoPessoa.JURIDICA)
  @IsNotEmpty({ message: 'CNPJ é obrigatório' })
  @Length(14, 14, { message: 'CNPJ inválido' })
  @Matches(/^\d{14}$/, { message: 'CNPJ inválido' })
  cnpj?: string;

  @ApiPropertyOptional({ description: 'Nome (obrigatório para Física)' })
  @ValidateIf(o => o.tipoPessoa === TipoPessoa.FISICA)
  @IsNotEmpty({ message: 'Nome é obrigatório' })
  @IsString()
  @Length(3, 255, { message: 'Mínimo de 3 caracteres' })
  nome?: string;

  @ApiPropertyOptional({ description: 'CPF (obrigatório para Física)' })
  @ValidateIf(o => o.tipoPessoa === TipoPessoa.FISICA)
  @IsNotEmpty({ message: 'CPF é obrigatório' })
  @Length(11, 11, { message: 'CPF inválido' })
  @Matches(/^\d{11}$/, { message: 'CPF inválido' })
  cpf?: string;

  @ApiPropertyOptional({ description: 'Identificador Estrangeiro (obrigatório para Estrangeira)' })
  @ValidateIf(o => o.tipoPessoa === TipoPessoa.ESTRANGEIRA)
  @IsNotEmpty({ message: 'Identificador estrangeiro é obrigatório' })
  @IsString()
  @Length(3, 100, { message: 'Mínimo de 3 caracteres' })
  identificadorEstrangeiro?: string;

  @ApiProperty({ description: 'Nome Fantasia' })
  @IsNotEmpty({ message: 'Nome Fantasia é obrigatório' })
  @IsString()
  @Length(3, 255, { message: 'Mínimo de 3 caracteres' })
  nomeFantasia: string;

  @ApiProperty({ enum: PerfilEmpresa, description: 'Perfil da empresa' })
  @IsEnum(PerfilEmpresa, { message: 'Selecione um perfil para a empresa' })
  @IsNotEmpty({ message: 'Perfil é obrigatório' })
  perfil: PerfilEmpresa;

  @ApiPropertyOptional({ description: 'Faturamento Direto', default: false })
  @IsOptional()
  @IsBoolean()
  faturamentoDireto?: boolean;

  @ApiProperty({ description: 'Documento comprobatório (base64)' })
  @IsNotEmpty({ message: 'É necessário enviar os arquivos obrigatórios para prosseguir' })
  @IsString()
  documentoComprobatorio: string;

  @ApiPropertyOptional({ description: 'Documento opcional (base64)' })
  @IsOptional()
  @IsString()
  documentoOpcional?: string;

  @ApiPropertyOptional({ description: 'Usuário responsável (apenas para usuário interno)' })
  @IsOptional()
  @IsString()
  usuarioResponsavel?: string;
}