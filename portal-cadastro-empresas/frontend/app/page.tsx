'use client';

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import CompanyForm from '@/components/company-form';
import CompanyList from '@/components/company-list';
import { Building2 } from 'lucide-react';

export default function Home() {
  const [activeTab, setActiveTab] = useState('cadastro');

  return (
    <div className="min-h-screen bg-gray-300">
      <div className="container mx-auto py-8 px-4">
        <div className="flex items-center justify-center mb-8">
          <div className="text-center text-black">
            <div className="flex items-center justify-center gap-3 mb-2">
              <Building2 className="w-10 h-10" />
              <h1 className="text-4xl font-bold">Portal de Cadastro</h1>
            </div>
            <p className="text-lg opacity-90">Sistema de Gestão de Empresas</p>
          </div>
        </div>

        <Card className="max-w-6xl mx-auto shadow-2xl">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger className='hover:bg-gray-100 data-[state=active]:bg-gray-100' value="cadastro">Cadastro de Empresa</TabsTrigger>
              <TabsTrigger className='hover:bg-gray-100 data-[state=active]:bg-gray-100' value="listagem">Listagem de Empresas</TabsTrigger>
            </TabsList>

            <TabsContent value="cadastro" className="p-6">
              <CardHeader>
                <CardTitle>Nova Empresa</CardTitle>
                <CardDescription>
                  Preencha os dados para cadastrar uma nova empresa no sistema
                </CardDescription>
              </CardHeader>
              <CardContent>
                <CompanyForm onSuccess={() => setActiveTab('listagem')} />
              </CardContent>
            </TabsContent>

            <TabsContent value="listagem" className="p-6">
              <CardHeader>
                <CardTitle>Empresas Cadastradas</CardTitle>
                <CardDescription>
                  Visualize e gerencie todas as empresas cadastradas
                </CardDescription>
              </CardHeader>
              <CardContent>
                <CompanyList />
              </CardContent>
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    </div>
  );
}