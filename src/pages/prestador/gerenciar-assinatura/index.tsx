import React, { useState } from 'react';
import Footer from '../../../components/prestador/footer';
import { Divider, Radio, Form, Input, Button, notification, Popover } from 'antd';
import Header from '../../../components/prestador/index/header';
import { useMediaQuery } from 'react-responsive';
import HeaderMobile from '../../../components/prestador/index/headerMobile';
import InputMask from 'react-input-mask';
import baseUrl from '../../../components/assets/schemas/baseUrl';

export default function Inicio() {
  const isMobile = useMediaQuery({ query: '(max-width: 768px)' });

  type SizeType = Parameters<typeof Form>[0]['size'];

  const [componentSize, setComponentSize] = useState<SizeType>('large');
  const [showBillingForm, setShowBillingForm] = useState(false); // Estado para controlar a exibição do formulário de cobrança
  const [showPlanForm, setShowPlanForm] = useState(false); // Estado para controlar a exibição do formulário de plano

  const handleSubmit = (values: any) => {
    const data = {
      card: {
        holdername: values.card_holdername,
        number: values.card_number.replace(/\s/g, ''), // remover espaços do número do cartão
        expMonth: parseInt(values.card_expMonth, 10),
        expYear: parseInt(values.card_expYear, 10),
        cvv: values.card_cvv,
      },
      billing_address: {
        line1: values.address,
        zipCode: values.zipCode.replace('-', ''), // remover traço do CEP
        city: values.city,
        state: values.state,
        country: values.country,
      },
    };

    const options = {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('authToken')}`,
      },
      body: JSON.stringify(data),
    };

    fetch(`${baseUrl}/payments/0`, options)
      .then(response => response.text())
      .then(responseText => {
        if (responseText.includes('success')) {
          notification.success({ message: 'Mudanças salvas com sucesso!' });
        } else {
          notification.error({ message: 'Erro ao salvar', description: responseText });
        }
      })
      .catch(err => {
        notification.error({ message: 'Erro', description: 'Erro ao processar o pedido.' });
        console.error(err);
      });
  };

  const handlePlanSubmit = (values: any) => {
    const data = {
      tier: values.tier,
    };

    const options = {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('authToken')}`,
      },
      body: JSON.stringify(data),
    };

    fetch(`${baseUrl}/payments/plan`, options)
      .then(response => response.text())
      .then(responseText => {
        if (responseText.includes('success')) {
          notification.success({ message: 'Plano atualizado com sucesso!' });
        } else {
          notification.error({ message: 'Erro ao atualizar o plano', description: responseText });
        }
      })
      .catch(err => {
        notification.error({ message: 'Erro', description: 'Erro ao processar o pedido.' });
        console.error(err);
      });
  };

  return (
    <>
      {isMobile ? <HeaderMobile /> : <Header />}
      <div className="container">
        <h2>Gerenciar assinatura</h2>
        <Divider />

        {/* Botão para mostrar o formulário de plano */}
        <Button
          type="default"
          onClick={() => setShowPlanForm(!showPlanForm)}
          style={{ marginBottom: 20 }}
        >
          {showPlanForm ? 'Cancelar' : 'Atualizar Plano'}
        </Button>

        {/* Exibe o formulário de atualização de plano apenas se o usuário clicar no botão */}
        {showPlanForm && (
          <Form
            layout="vertical"
            initialValues={{ size: componentSize }}
            size={componentSize as SizeType}
            onFinish={handlePlanSubmit}
          >
            <Form.Item label="Escolha o Plano" name="tier" rules={[{ required: true, message: 'Escolha um plano!' }]}>
              <Radio.Group>
                <Popover content="Até 30 créditos mensais"><Radio.Button value="basic">Simples - R$ 15,00</Radio.Button></Popover>
                <Popover content="Créditos ilimitados"><Radio.Button value="premium">Ilimitado - R$ 30,00</Radio.Button></Popover>
              </Radio.Group>
            </Form.Item>

            <Button type="primary" htmlType="submit">
              Atualizar Plano
            </Button>
          </Form>
        )}

        <br/>

        {/* Botão para mostrar formulário de pagamento */}
        <Button
          type="default"
          onClick={() => setShowBillingForm(!showBillingForm)}
          style={{ marginBottom: 20 }}
        >
          {showBillingForm ? 'Cancelar' : 'Mudar cartão de cobrança'}
        </Button>

        {/* Exibe o formulário de cobrança apenas se o usuário clicar no botão */}
        {showBillingForm && (
          <Form
            layout="vertical"
            initialValues={{ size: componentSize }}
            size={componentSize as SizeType}
            onFinish={handleSubmit}  // Ação de envio no form de cobrança
          >
            <h2>Dados de cobrança</h2>

            <Form.Item label="Nome impresso no cartão" name="card_holdername" rules={[{ required: true, message: 'Informe o nome no cartão!' }]}>
              <Input />
            </Form.Item>

            <Form.Item label="Número do cartão" name="card_number" rules={[{ required: true, message: 'Informe o número do cartão!' }]}>
              <InputMask mask="9999 9999 9999 9999">
                {(inputProps) => <Input id='cardNumber' {...inputProps} />}
              </InputMask>
            </Form.Item>

            <Form.Item label="Mês de validade" name="card_expMonth" rules={[{ required: true, message: 'Informe o mês de validade!' }]}>
              <InputMask mask="99">
                {(inputProps) => <Input id='card_expMonth' {...inputProps} />}
              </InputMask>
            </Form.Item>

            <Form.Item label="Ano de validade" name="card_expYear" rules={[{ required: true, message: 'Informe o ano de validade!' }]}>
              <InputMask mask="9999">
                {(inputProps) => <Input id='card_expYear' {...inputProps} />}
              </InputMask>
            </Form.Item>

            <Form.Item label="CVV" name="card_cvv" rules={[{ required: true, message: 'Informe o CVV!' }]}>
              <InputMask mask="999">
                {(inputProps) => <Input id='card_cvv' {...inputProps} />}
              </InputMask>
            </Form.Item>

            <Divider />

            <h2>Endereço de cobrança</h2>

            <Form.Item label="Endereço" name="address" rules={[{ required: true, message: 'Informe seu endereço!' }]}>
              <Input placeholder="Ex: Rua Duque de Caxias, 560" />
            </Form.Item>

            <Form.Item label="CEP" name="zipCode" rules={[{ required: true, message: 'Informe o CEP!' }]}>
              <InputMask mask="99999-999">
                {(inputProps) => <Input id='zipCode' {...inputProps} />}
              </InputMask>
            </Form.Item>

            <Form.Item label="Cidade" name="city" rules={[{ required: true, message: 'Informe sua cidade!' }]}>
              <Input />
            </Form.Item>

            <Form.Item label="Estado" name="state" rules={[{ required: true, message: 'Informe seu estado!' }]}>
              <InputMask mask="aa">
                {(inputProps) => <Input id='state' {...inputProps} />}
              </InputMask>
            </Form.Item>

            <Form.Item label="País" name="country" rules={[{ required: true, message: 'Informe seu país!' }]}>
              <InputMask mask="aa">
                {(inputProps) => <Input id='country' {...inputProps} />}
              </InputMask>
            </Form.Item>

            <Button type="primary" htmlType="submit">
              Salvar mudanças
            </Button>
          </Form>
        )}
      </div>
      <br /><br /><br />
      <Footer />
    </>
  );
}
