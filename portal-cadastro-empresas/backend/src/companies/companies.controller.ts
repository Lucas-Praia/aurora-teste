import { Controller, Get, Post, Body, Param, Patch, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { CompaniesService } from './companies.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { Company } from './entities/company.entity';

@ApiTags('Empresas')
@Controller('companies')
export class CompaniesController {
  constructor(private readonly companiesService: CompaniesService) { }

  @Post()
  @ApiOperation({ summary: 'Cadastrar nova empresa' })
  @ApiResponse({ status: 201, description: 'Empresa cadastrada com sucesso' })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  async create(
    @Body() createCompanyDto: CreateCompanyDto,
    @Query('internal') internal?: boolean,
  ): Promise<{ message: string; data: Company }> {
    const company = await this.companiesService.create(createCompanyDto, internal === true);
    return {
      message: 'Empresa cadastrada com sucesso',
      data: company,
    };
  }

  @Get()
  @ApiOperation({ summary: 'Listar todas as empresas' })
  @ApiResponse({ status: 200, description: 'Lista de empresas' })
  async findAll(): Promise<Company[]> {
    return await this.companiesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar empresa por ID' })
  @ApiResponse({ status: 200, description: 'Empresa encontrada' })
  @ApiResponse({ status: 404, description: 'Empresa não encontrada' })
  async findOne(@Param('id') id: string): Promise<Company> {
    return await this.companiesService.findOne(id);
  }

  @Patch(':id/approve')
  @ApiOperation({ summary: 'Aprovar empresa' })
  @ApiResponse({ status: 200, description: 'Empresa aprovada com sucesso' })
  async approve(@Param('id') id: string): Promise<{ message: string; data: Company }> {
    const company = await this.companiesService.approve(id);
    return {
      message: 'Empresa aprovada com sucesso',
      data: company,
    };
  }

  @Patch(':id/reject')
  @ApiOperation({ summary: 'Reprovar empresa' })
  @ApiBody({ schema: { properties: { motivo: { type: 'string' } } } })
  @ApiResponse({ status: 200, description: 'Empresa reprovada com sucesso' })
  async reject(
    @Param('id') id: string,
    @Body('motivo') motivo: string,
  ): Promise<{ message: string; data: Company }> {
    const company = await this.companiesService.reject(id, motivo);
    return {
      message: 'Empresa reprovada com sucesso',
      data: company,
    };
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar empresa' })
  @ApiResponse({ status: 200, description: 'Empresa atualizada com sucesso' })
  async update(
    @Param('id') id: string,
    @Body() updateData: Partial<CreateCompanyDto>,
  ): Promise<{ message: string; data: Company }> {
    const company = await this.companiesService.update(id, updateData);
    return {
      message: 'Empresa atualizada com sucesso',
      data: company,
    };
  }
}