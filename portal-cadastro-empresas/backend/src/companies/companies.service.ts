import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Company, StatusEmpresa, TipoPessoa } from './entities/company.entity';
import { CreateCompanyDto } from './dto/create-company.dto';

@Injectable()
export class CompaniesService {
  constructor(
    @InjectRepository(Company)
    private readonly companyRepository: Repository<Company>,
  ) { }

  async create(createCompanyDto: CreateCompanyDto, isInternalUser: boolean = false): Promise<Company> {
    this.validateDocuments(createCompanyDto);
    this.validateIdentification(createCompanyDto);

    const company = this.companyRepository.create({
      ...createCompanyDto,
      status: isInternalUser ? StatusEmpresa.APROVADA : StatusEmpresa.PENDENTE,
      razaoSocial: createCompanyDto.tipoPessoa === TipoPessoa.FISICA
        ? createCompanyDto.nome
        : createCompanyDto.razaoSocial,
    });

    return await this.companyRepository.save(company);
  }

  async findAll(): Promise<Company[]> {
    return await this.companyRepository.find({
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Company> {
    const company = await this.companyRepository.findOne({ where: { id } });

    if (!company) {
      throw new NotFoundException('Empresa não encontrada');
    }

    return company;
  }

  async approve(id: string): Promise<Company> {
    const company = await this.findOne(id);
    company.status = StatusEmpresa.APROVADA;
    return await this.companyRepository.save(company);
  }

  async reject(id: string, motivo: string): Promise<Company> {
    const company = await this.findOne(id);
    company.status = StatusEmpresa.REPROVADA;
    company.motivoReprovacao = motivo;
    return await this.companyRepository.save(company);
  }

  async update(id: string, updateData: Partial<CreateCompanyDto>): Promise<Company> {
    const company = await this.findOne(id);

    if (updateData.documentoComprobatorio || updateData.documentoOpcional) {
      this.validateDocuments(updateData as CreateCompanyDto);
    }

    Object.assign(company, updateData);
    return await this.companyRepository.save(company);
  }

  private validateDocuments(dto: CreateCompanyDto | Partial<CreateCompanyDto>) {
    if (dto.documentoComprobatorio && dto.documentoOpcional) {
      if (dto.documentoComprobatorio === dto.documentoOpcional) {
        throw new BadRequestException('Arquivo duplicado');
      }
    }
  }

  private validateIdentification(dto: CreateCompanyDto) {
    if (dto.cnpj && !this.isValidCNPJ(dto.cnpj)) {
      throw new BadRequestException('CNPJ fornecido inválido');
    }

    if (dto.cpf && !this.isValidCPF(dto.cpf)) {
      throw new BadRequestException('CPF inválido');
    }
  }

  private isValidCNPJ(cnpj: string): boolean {
    cnpj = cnpj.replace(/[^\d]/g, '');
    if (cnpj.length !== 14) return false;
    if (/^(\d)\1+$/.test(cnpj)) return false;

    let sum = 0;
    let weight = 5;
    for (let i = 0; i < 12; i++) {
      sum += parseInt(cnpj.charAt(i)) * weight;
      weight = weight === 2 ? 9 : weight - 1;
    }
    let digit = sum % 11 < 2 ? 0 : 11 - (sum % 11);
    if (parseInt(cnpj.charAt(12)) !== digit) return false;

    sum = 0;
    weight = 6;
    for (let i = 0; i < 13; i++) {
      sum += parseInt(cnpj.charAt(i)) * weight;
      weight = weight === 2 ? 9 : weight - 1;
    }
    digit = sum % 11 < 2 ? 0 : 11 - (sum % 11);
    return parseInt(cnpj.charAt(13)) === digit;
  }

  private isValidCPF(cpf: string): boolean {
    cpf = cpf.replace(/[^\d]/g, '');
    if (cpf.length !== 11) return false;
    if (/^(\d)\1+$/.test(cpf)) return false;

    let sum = 0;
    for (let i = 0; i < 9; i++) {
      sum += parseInt(cpf.charAt(i)) * (10 - i);
    }
    let digit = sum % 11 < 2 ? 0 : 11 - (sum % 11);
    if (parseInt(cpf.charAt(9)) !== digit) return false;

    sum = 0;
    for (let i = 0; i < 10; i++) {
      sum += parseInt(cpf.charAt(i)) * (11 - i);
    }
    digit = sum % 11 < 2 ? 0 : 11 - (sum % 11);
    return parseInt(cpf.charAt(10)) === digit;
  }
}