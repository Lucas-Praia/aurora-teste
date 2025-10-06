'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { companyApi, Company } from '@/lib/api';
import { Building2, CheckCircle, XCircle, Clock, Loader2 } from 'lucide-react';

export default function CompanyList() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadCompanies();
  }, []);

  const loadCompanies = async () => {
    try {
      const data = await companyApi.getAll();
      setCompanies(data);
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Erro ao carregar empresas',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id: string) => {
    setActionLoading(true);
    try {
      await companyApi.approve(id);
      toast({
        title: 'Sucesso',
        description: 'Empresa aprovada com sucesso',
      });
      loadCompanies();
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Erro ao aprovar empresa',
        variant: 'destructive',
      });
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async () => {
    if (!selectedCompany || !rejectReason.trim()) {
      toast({
        title: 'Atenção',
        description: 'Informe o motivo da reprovação',
        variant: 'destructive',
      });
      return;
    }

    setActionLoading(true);
    try {
      await companyApi.reject(selectedCompany.id, rejectReason);
      toast({
        title: 'Sucesso',
        description: 'Empresa reprovada com sucesso',
      });
      setShowRejectDialog(false);
      setRejectReason('');
      setSelectedCompany(null);
      loadCompanies();
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Erro ao reprovar empresa',
        variant: 'destructive',
      });
    } finally {
      setActionLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusMap = {
      PENDENTE: { label: 'Pendente', variant: 'secondary' as const, icon: Clock },
      APROVADA: { label: 'Aprovada', variant: 'default' as const, icon: CheckCircle },
      REPROVADA: { label: 'Reprovada', variant: 'destructive' as const, icon: XCircle },
    };

    const config = statusMap[status as keyof typeof statusMap] || statusMap.PENDENTE;
    const Icon = config.icon;

    return (
      <Badge variant={config.variant} className="flex items-center gap-1 w-fit">
        <Icon className="w-3 h-3" />
        {config.label}
      </Badge>
    );
  };

  const getTipoPessoaLabel = (tipo: string) => {
    const map: Record<string, string> = {
      JURIDICA: 'Jurídica',
      FISICA: 'Física',
      ESTRANGEIRA: 'Estrangeira',
    };
    return map[tipo] || tipo;
  };

  const getPerfilLabel = (perfil: string) => {
    const map: Record<string, string> = {
      DESPACHANTE: 'Despachante',
      BENEFICIARIO: 'Beneficiário',
      CONSIGNATARIO: 'Consignatário',
      ARMADOR: 'Armador',
      AGENTE_CARGA: 'Agente de Carga',
      TRANSPORTADORA: 'Transportadora',
    };
    return map[perfil] || perfil;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
      </div>
    );
  }

  if (companies.length === 0) {
    return (
      <div className="text-center py-12">
        <Building2 className="w-16 h-16 mx-auto text-gray-300 mb-4" />
        <p className="text-gray-500">Nenhuma empresa cadastrada</p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-4">
        {companies.map((company) => (
          <Card key={company.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-xl mb-2">{company.nomeFantasia}</CardTitle>
                  <div className="flex flex-wrap gap-2 text-sm text-gray-600">
                    <span className="flex items-center gap-1">
                      <strong>Razão Social:</strong> {company.razaoSocial || company.nomeFantasia}
                    </span>
                  </div>
                </div>
                {getStatusBadge(company.status)}
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-sm text-gray-500">Tipo</p>
                  <p className="font-medium">{getTipoPessoaLabel(company.tipoPessoa)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Perfil</p>
                  <p className="font-medium">{getPerfilLabel(company.perfil)}</p>
                </div>
                {company.cnpj && (
                  <div>
                    <p className="text-sm text-gray-500">CNPJ</p>
                    <p className="font-medium">{company.cnpj}</p>
                  </div>
                )}
                {company.cpf && (
                  <div>
                    <p className="text-sm text-gray-500">CPF</p>
                    <p className="font-medium">{company.cpf}</p>
                  </div>
                )}
                {company.identificadorEstrangeiro && (
                  <div>
                    <p className="text-sm text-gray-500">ID Estrangeiro</p>
                    <p className="font-medium">{company.identificadorEstrangeiro}</p>
                  </div>
                )}
                <div>
                  <p className="text-sm text-gray-500">Faturamento Direto</p>
                  <p className="font-medium">{company.faturamentoDireto ? 'Sim' : 'Não'}</p>
                </div>
              </div>

              {company.motivoReprovacao && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded">
                  <p className="text-sm text-red-800">
                    <strong>Motivo da reprovação:</strong> {company.motivoReprovacao}
                  </p>
                </div>
              )}

              {company.status === 'PENDENTE' && (
                <div className="flex gap-2">
                  <Button
                    onClick={() => handleApprove(company.id)}
                    disabled={actionLoading}
                    className="flex-1"
                  >
                    {actionLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4 mr-2" />}
                    Aprovar
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => {
                      setSelectedCompany(company);
                      setShowRejectDialog(true);
                    }}
                    disabled={actionLoading}
                    className="flex-1"
                  >
                    <XCircle className="w-4 h-4 mr-2" />
                    Reprovar
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reprovar Empresa</DialogTitle>
            <DialogDescription>
              {selectedCompany?.nomeFantasia}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Textarea
              placeholder="Informe o motivo da reprovação..."
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              rows={4}
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowRejectDialog(false);
                setRejectReason('');
                setSelectedCompany(null);
              }}
              disabled={actionLoading}
            >
              Voltar
            </Button>
            <Button
              variant="destructive"
              onClick={handleReject}
              disabled={actionLoading}
            >
              {actionLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Reprovar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}