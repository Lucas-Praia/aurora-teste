'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { companyApi } from '@/lib/api';
import { Loader2, Upload, X } from 'lucide-react';

const formSchema = z.object({
  tipoPessoa: z.enum(['JURIDICA', 'FISICA', 'ESTRANGEIRA']),
  razaoSocial: z.string().optional(),
  cnpj: z.string().optional(),
  nome: z.string().optional(),
  cpf: z.string().optional(),
  identificadorEstrangeiro: z.string().optional(),
  nomeFantasia: z.string().min(3, 'Mínimo de 3 caracteres'),
  perfil: z.enum(['DESPACHANTE', 'BENEFICIARIO', 'CONSIGNATARIO', 'ARMADOR', 'AGENTE_CARGA', 'TRANSPORTADORA']),
  faturamentoDireto: z.boolean().default(false),
  documentoComprobatorio: z.string().min(1, 'É necessário enviar os arquivos obrigatórios para prosseguir'),
  documentoOpcional: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface CompanyFormProps {
  onSuccess?: () => void;
}

export default function CompanyForm({ onSuccess }: CompanyFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [docFileName, setDocFileName] = useState('');
  const [optionalDocFileName, setOptionalDocFileName] = useState('');
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      tipoPessoa: 'JURIDICA',
      faturamentoDireto: false,
    },
  });

  const tipoPessoa = form.watch('tipoPessoa');

  const handleFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
    fieldName: 'documentoComprobatorio' | 'documentoOpcional'
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validTypes = ['application/pdf', 'image/png', 'image/jpeg', 'image/jpg'];
    if (!validTypes.includes(file.type)) {
      toast({
        title: 'Arquivo inválido',
        description: 'São válidos somente arquivos do tipo: pdf, png, jpg ou jpeg.',
        variant: 'destructive',
      });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: 'Arquivo inválido',
        description: 'Tamanho de arquivo não suportado.',
        variant: 'destructive',
      });
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result as string;
      form.setValue(fieldName, base64);

      if (fieldName === 'documentoComprobatorio') {
        setDocFileName(file.name);
      } else {
        setOptionalDocFileName(file.name);
      }
    };
    reader.readAsDataURL(file);
  };

  const removeFile = (fieldName: 'documentoComprobatorio' | 'documentoOpcional') => {
    form.setValue(fieldName, '');
    if (fieldName === 'documentoComprobatorio') {
      setDocFileName('');
    } else {
      setOptionalDocFileName('');
    }
  };

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    try {
      await companyApi.create(data);
      toast({
        title: 'Sucesso',
        description: 'Empresa cadastrada com sucesso',
      });
      form.reset();
      setDocFileName('');
      setOptionalDocFileName('');
      onSuccess?.();
    } catch (error: any) {
      const message = error.response?.data?.message || 'Erro ao cadastrar empresa';
      toast({
        title: 'Erro',
        description: Array.isArray(message) ? message[0] : message,
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="tipoPessoa"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tipo de Pessoa *</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="bg-white">
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className='bg-white'>
                  <SelectItem value="JURIDICA">Jurídica</SelectItem>
                  <SelectItem value="FISICA">Física</SelectItem>
                  <SelectItem value="ESTRANGEIRA">Estrangeira</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {tipoPessoa === 'JURIDICA' && (
          <>
            <FormField
              control={form.control}
              name="razaoSocial"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Razão Social *</FormLabel>
                  <FormControl>
                    <Input placeholder="Digite a razão social" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="cnpj"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>CNPJ *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="00000000000000"
                      maxLength={14}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        )}

        {tipoPessoa === 'FISICA' && (
          <>
            <FormField
              control={form.control}
              name="nome"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome *</FormLabel>
                  <FormControl>
                    <Input placeholder="Digite o nome completo" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="cpf"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>CPF *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="00000000000"
                      maxLength={11}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        )}

        {tipoPessoa === 'ESTRANGEIRA' && (
          <>
            <FormField
              control={form.control}
              name="razaoSocial"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Razão Social *</FormLabel>
                  <FormControl>
                    <Input placeholder="Digite a razão social" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="identificadorEstrangeiro"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Identificador Estrangeiro *</FormLabel>
                  <FormControl>
                    <Input placeholder="Digite o identificador" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        )}

        <FormField
          control={form.control}
          name="nomeFantasia"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome Fantasia *</FormLabel>
              <FormControl>
                <Input placeholder="Digite o nome fantasia" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="perfil"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Perfil *</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger className="bg-white">
                    <SelectValue placeholder="Selecione o perfil" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className='bg-white'>
                  <SelectItem value="DESPACHANTE">Despachante</SelectItem>
                  <SelectItem value="BENEFICIARIO">Beneficiário</SelectItem>
                  <SelectItem value="CONSIGNATARIO">Consignatário</SelectItem>
                  <SelectItem value="ARMADOR">Armador</SelectItem>
                  <SelectItem value="AGENTE_CARGA">Agente de Carga</SelectItem>
                  <SelectItem value="TRANSPORTADORA">Transportadora</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="faturamentoDireto"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
              <FormControl>
                <Checkbox
                  className='bg-white'
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>Faturamento Direto</FormLabel>
              </div>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="documentoComprobatorio"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Documento Comprobatório *</FormLabel>
              <FormControl>
                <div className="space-y-2">
                  <label className="flex items-center justify-center w-full h-32 px-4 border-2 border-dashed rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                    <div className="flex flex-col items-center">
                      <Upload className="w-8 h-8 text-gray-400" />
                      <span className="mt-2 text-sm text-gray-600">
                        Clique para selecionar arquivo
                      </span>
                      <span className="text-xs text-gray-400 mt-1">
                        PDF, PNG, JPG ou JPEG (máx. 5MB)
                      </span>
                    </div>
                    <input
                      type="file"
                      className="hidden"
                      accept=".pdf,.png,.jpg,.jpeg"
                      onChange={(e) => handleFileChange(e, 'documentoComprobatorio')}
                    />
                  </label>
                  {docFileName && (
                    <div className="flex items-center justify-between p-2 bg-gray-100 rounded">
                      <span className="text-sm truncate">{docFileName}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFile('documentoComprobatorio')}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  )}
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="documentoOpcional"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Documento Opcional</FormLabel>
              <FormControl>
                <div className="space-y-2">
                  <label className="flex items-center justify-center w-full h-32 px-4 border-2 border-dashed rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                    <div className="flex flex-col items-center">
                      <Upload className="w-8 h-8 text-gray-400" />
                      <span className="mt-2 text-sm text-gray-600">
                        Clique para selecionar arquivo
                      </span>
                      <span className="text-xs text-gray-400 mt-1">
                        PDF, PNG, JPG ou JPEG (máx. 5MB)
                      </span>
                    </div>
                    <input
                      type="file"
                      className="hidden"
                      accept=".pdf,.png,.jpg,.jpeg"
                      onChange={(e) => handleFileChange(e, 'documentoOpcional')}
                    />
                  </label>
                  {optionalDocFileName && (
                    <div className="flex items-center justify-between p-2 bg-gray-100 rounded">
                      <span className="text-sm truncate">{optionalDocFileName}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFile('documentoOpcional')}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  )}
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full bg-white" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Cadastrar Empresa
        </Button>
      </form>
    </Form>
  );
}