import React, { useState, useEffect } from 'react';
import InputMask from 'react-input-mask';
import moment from 'moment';
import baseUrl from '../assets/schemas/baseUrl';
import { Form, Input, Button, Radio, Select, Checkbox, Upload, InputNumber, message, notification, Popover, Alert, RadioChangeEvent } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { CheckboxChangeEvent } from 'antd/lib/checkbox';
import { validateCNPJ, validateCPF } from '../assets/schemas/validateDocuments';
import { countries, deficiencias, escolaridade, familias, profissoes, racas } from '../assets/schemas/signUpSchemas';

const { TextArea } = Input;
const { Option } = Select;

const RegistrationForm = () => {
  const url = window.location.href;
  const pdCode = url.split('/cadastro/')[1];

  const [loading, setLoading] = useState(false);


  const [formErrors, setFormErrors] = useState<string[]>([]);



  const [api, contextHolder] = notification.useNotification();

  const [form] = Form.useForm();
  const [serviceType, setServiceType] = useState('request');
  const [hasDisability, setHasDisability] = useState(false);
  const [pfp, setPfp] = useState<File | null>(null);
  const [checked, setChecked] = useState(false);
  const [birthdate, setBirthdate] = useState('');
  const [valorCobrado, setValorCobrado] = useState('');
  const [isProvider, setIsProvider] = useState(false);
  const [projectCode, setProjectCode] = useState('');
  const [isProjectModalVisible, setIsProjectModalVisible] = useState(false);
  const navigate = useNavigate();

  const handleJoinProject = async (projectCode: string) => {
    const authToken = localStorage.getItem('authToken');

    if (!authToken) {
      message.error("Token de autorização não encontrado.");
      return;
    }

    if (!projectCode.trim()) {
      message.error("Por favor, insira um código válido.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(`${baseUrl}/users/into/project/${projectCode}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const contentType = response.headers.get('content-type');

        // Identifique o formato da resposta
        let responseBody: any;
        if (contentType && contentType.includes('application/json')) {
          responseBody = await response.json(); // Leia como JSON
          message.success("Você entrou no projeto com sucesso!");
          console.log("Resposta do servidor (JSON):", responseBody);
        } else {
          responseBody = await response.text(); // Leia como texto
          message.success(`Você entrou no projeto com sucesso!`);
          console.log("Resposta do servidor (Texto):", responseBody);
        }

        setIsProjectModalVisible(false);
        setLoading(false);
        setProjectCode('');
        navigate('/inicio/');
      } else {
        const errorText = await response.text();
        setLoading(false);
        message.error(`Erro: ${errorText || "Falha ao entrar no projeto."}`);
      }
    } catch (error) {
      console.error("Erro ao entrar no projeto:", error);
      message.error("Erro ao processar a solicitação.");
      setLoading(false);
    }
  };


  useEffect(() => {
    const authToken = localStorage.getItem('authToken');
    if (authToken) {
      const projectCode = pdCode; // Substituir pelo código do projeto necessário
      handleJoinProject(projectCode);
    }
  }, []);


  useEffect(() => {
    if (pdCode) {
      setIsProvider(true);
      setServiceType('provide');
      form.setFieldsValue({ serviceType: 'provide' });
    }
  }, [pdCode, form]);

  const formatCurrency = (value: string) => {
    let numericValue = value.replace(/[^\d]/g, '');
    let numberValue = parseFloat(numericValue) / 100;
    return isNaN(numberValue) ? 'R$ 0,00' : `R$ ${numberValue.toFixed(2).replace('.', ',')}`;
  };

  const handleValueChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const formattedValue = formatCurrency(event.target.value);
    setValorCobrado(formattedValue);
    form.setFieldsValue({ valorCobrado: formattedValue });
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedDate = moment(e.target.value, 'DD/MM/YYYY').format('YYYY-MM-DD');
    setBirthdate(formattedDate);
  };

  const onServiceTypeChange = (e: RadioChangeEvent) => setServiceType(e.target.value);
  const onDisabilityChange = (e: RadioChangeEvent) => setHasDisability(e.target.value === 'yes');
  const handleCheckboxChange = (e: CheckboxChangeEvent) => setChecked(e.target.checked);

  const handleSubmit = async (values: any) => {
    const formData = new FormData();
    formData.append('fullName', values.name);
    formData.append('email', values.email);
    formData.append('about', values.bio);
    formData.append('budget', checked ? 'Não cobro para realizar orçamento' : values.budgetValue);
    formData.append('docNumber', values.cpf);
    formData.append('password', values.password);
    formData.append('deficiency', values.disabilityType || 'Não se aplica');
    formData.append('phone', values.mobile);
    formData.append('avatar', pfp || '');
    formData.append('genre', values.gender);
    formData.append('birthCity', 'null');
    formData.append('birthCountry', serviceType === 'provide' ? values.birthCountry : '');
    formData.append('birthState', 'null');
    formData.append('operationRadius', serviceType === 'provide' ? values.serviceRadius : '');
    if (values.uploadPortfolio) {
      values.uploadPortfolio.fileList.forEach((file: any) => {
        formData.append('documents', file.originFileObj);
      });
    }
    formData.append('portfolioUrl', values.portfolio);
    formData.append('isClient', serviceType === 'request' ? 'true' : 'false');
    formData.append('country', values.country);
    formData.append('state', values.estado);
    formData.append('city', values.cidade);
    formData.append('cep', values.cep);
    formData.append('address', values.rua);
    formData.append('number', values.numero);
    formData.append('projectCode', pdCode || '');
    formData.append('complement', values.complemento);
    formData.append('isLookingForJob', values.isLookingForJob ? 'false' : 'true');
    formData.append('role', serviceType === 'provide' ? values.services : '');
    formData.append('badgesIncluded', values.badges ? values.badges.join(",") : '');
    formData.append('payments', serviceType === 'provide' && values.paymentTypes ? values.paymentTypes.join(', ') : '');
    formData.append('birthdate', values.birthdate ? moment(values.birthdate, 'DD/MM/YYYY').format('YYYY-MM-DD') : 'null');
    formData.append('remoteWork', values.remoteWork ? 'false' : 'true');
    formData.append('families', values.families);
    formData.append('scholarship', values.scholarship);

    try {
      setLoading(true);
      const response = await fetch(`${baseUrl}/users`, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json(); // <- sempre tenta extrair

      if (response.ok) {
        window.location.href = '/login';
      } else if (data.errors) {
        // Exibe erros nos campos do formulário
        form.setFields(
          Object.entries(data.errors).map(([field, message]) => ({
            name: field,
            errors: [message as string],
          }))
        );

        // Exibe no Alert de topo
        notification.error({
          message: 'Erros encontrados no cadastro:',
          description: (
            <ul style={{ margin: 0, paddingLeft: 20 }}>
              {Object.values(data.errors).map((msg, idx) => (
                <li key={idx}>{msg}</li>
              ))}
            </ul>
          ),
          duration: 6,
        });
      } else {
        notification.error({
          message: 'Erro ao cadastrar',
          description: data.message || 'Erro desconhecido. Tente novamente.',
          duration: 5,
        });
      }
    } catch (err: any) {
      console.error("Erro inesperado:", err);
      notification.error({
        message: 'Erro inesperado',
        description: err?.message || 'Erro ao processar a requisição.',
        duration: 5,
      });
    } finally {
      setLoading(false);
    }
  };


  const handleAvatarUpload = ({ file }: any) => setPfp(file);

  const fetchAddress = async (cep: string) => {
    try {
      const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      const data = await response.json();
      if (data.erro) {
        message.error('CEP não encontrado!');
      } else {
        form.setFieldsValue({
          rua: data.logradouro,
          complemento: data.complemento,
          cidade: data.localidade,
          estado: data.uf,
        });
      }
    } catch {
      message.error('Erro ao buscar o CEP!');
    }
  };

  const handleCepBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const cep = e.target.value.replace(/\D/g, '');
    if (cep.length === 8) fetchAddress(cep);
    else message.error('CEP inválido!');
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleSubmit}
      initialValues={{
        serviceType: 'request',
        profilePicture: { fileList: [] },
        uploadPortfolio: { fileList: [] },
        paymentTypes: [],
        budgetValue: '',
      }}
    >
      {contextHolder}


      {formErrors.length > 0 && (
        <Alert
          message="Erros encontrados no cadastro:"
          description={
            <ul style={{ margin: 0, paddingLeft: 20 }}>
              {formErrors.map((msg, idx) => (
                <li key={idx}>{msg}</li>
              ))}
            </ul>
          }
          type="error"
          showIcon
          closable
          onClose={() => setFormErrors([])}
          style={{ marginBottom: '16px' }}
        />
      )}




      {pdCode ? (
        <>
          {/* Elements for registered providers */}
        </>
      ) : (
        <>
          <Form.Item name="serviceType" label="Tipo de Serviço" rules={[{ required: true, message: 'Por favor, escolha o tipo de serviço!' }]}>
            <Radio.Group onChange={onServiceTypeChange}>
              <Radio value="request">Quero solicitar serviços</Radio>
              <Radio value="provide">Quero prestar serviços</Radio>
            </Radio.Group>
          </Form.Item>
        </>
      )}

      {/* fullName */}
      <Form.Item
        name="name"
        label="Nome"
        rules={[{ required: true, message: 'Por favor, insira seu nome!' }]}
      >
        <Input id='nome' />
      </Form.Item>

      {/* avatar */}
      <Form.Item name="profilePicture" label="Foto de perfil">
        <Upload
          name="image"
          listType="picture"
          maxCount={1}
          beforeUpload={(file) => false}
          onChange={handleAvatarUpload}
          accept="image/*"
        >
          <Button icon={<UploadOutlined />}>Selecionar imagem</Button>
        </Upload>
      </Form.Item>

      {/* docNumber */}
      <Form.Item
        name="cpf"
        label="CPF"
        rules={[{ required: true, message: 'Por favor, insira seu documento!' },
        {
          validator: (_, value) =>
            value && !validateCPF(value)
              ? Promise.reject(new Error('CPF inválido!'))
              : Promise.resolve(),
        },]}>
        <InputMask mask="999.999.999-99">
          {(inputProps) => <Input id='cpf' {...inputProps} />}
        </InputMask>
      </Form.Item>

      {/* genre */}
      <Form.Item name="gender" label="Sexo" rules={[{ required: true, message: 'Por favor, selecione uma opção!' }]}>
        <Radio.Group>
          <Radio value="Masculino">Masculino</Radio>
          <Radio value="Feminino">Feminino</Radio>
          <Radio value="Outro">Outro</Radio>
        </Radio.Group>
      </Form.Item>

      {/* email */}
      <Form.Item name="email" label="Email" rules={[{ required: true, message: 'Por favor, insira seu e-mail!' }]}>
        <Input />
      </Form.Item>

      {/* password */}
      <Form.Item name="password" label="Senha" rules={[{ required: true, message: 'Por favor, insira sua senha!' }]}>
        <Input.Password />
      </Form.Item>

      {/* birthdate, deve ser enviada como YYYY-MM-DD */}
      <Form.Item
        name="birthdate"
        label="Data de Nascimento"
        rules={[{ required: true, message: 'Por favor, insira sua data de nascimento!' }]}
      >
        <InputMask
          mask="99/99/9999"
          placeholder="DD/MM/AAAA"
          value={moment(birthdate, 'YYYY-MM-DD').format('DD/MM/YYYY')}
          onChange={handleDateChange}
        >
          {(inputProps: any) => <Input {...inputProps} style={{ width: 400 }} />}
        </InputMask>
      </Form.Item>

      {/* phone */}
      <Form.Item
        name="mobile"
        label="Celular"
        rules={[{ required: true, message: 'Por favor, insira seu celular!' }]}
      >
        <InputMask
          mask="(99) 99999-9999"
          placeholder="(XX) XXXXX-XXXX"
        >
          {(inputProps: any) => <Input {...inputProps} />}
        </InputMask>
      </Form.Item>


      {/* cep */}
      <Form.Item name="cep" label="CEP" rules={[{ required: true, message: 'Por favor, insira seu CEP!' }]}>
        <Input onBlur={handleCepBlur} />
      </Form.Item>

      {/* address */}
      <Form.Item name="rua" label="Endereço" rules={[{ required: true, message: 'Por favor, insira sua rua!' }]}>
        <Input />
      </Form.Item>

      {/* number */}
      <Form.Item name="numero" label="Número" rules={[{ required: true, message: 'Por favor, insira o número!' }]}>
        <Input />
      </Form.Item>

      {/* complement */}
      <Form.Item name="complemento" label="Complemento">
        <Input />
      </Form.Item>

      {/* city */}
      <Form.Item name="cidade" label="Cidade" rules={[{ required: true, message: 'Por favor, insira a cidade!' }]}>
        <Input />
      </Form.Item>

      {/* state */}
      <Form.Item name="estado" label="Estado" rules={[{ required: true, message: 'Por favor, insira o estado!' }]}>
        <Input />
      </Form.Item>

      {serviceType === 'provide' && (
        <>
          {/* birthContry */}
          <Form.Item name="birthCountry" label="País de Nascimento">
            <Select showSearch>
              {countries.map(country => (
                <Option key={country} value={country}>{country}</Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="cnpj"
            label="CNPJ"
            rules={[
              { required: false },
              {
                validator: (_, value) =>
                  value && !validateCNPJ(value)
                    ? Promise.reject(new Error('CNPJ inválido!'))
                    : Promise.resolve(),
              },
            ]}
          >
            <InputMask mask="99.999.999/9999-99">
              {(inputProps) => <Input id='cnpj' {...inputProps} />}
            </InputMask>
          </Form.Item>

          {/* deficiency -> se o usuário selecionar não, enviar o valor do radio de Não */}
          <Form.Item name="disability" label="Possui Deficiência?">
            <Radio.Group onChange={onDisabilityChange}>
              <Radio value="yes">Sim</Radio>
              <Radio value="Não se aplica">Não</Radio>
            </Radio.Group>
          </Form.Item>

          {/* se a resposta acima for sim, enviar o valor da deficiencia selecionada neste select */}
          {hasDisability && (
            <Form.Item name="disabilityType" label="Tipo de Deficiência">
              <Select showSearch>
                {deficiencias.map(country => (
                  <Option key={country} value={country}>{country}</Option>
                ))}
              </Select>
            </Form.Item>
          )}

          <Form.Item name="race" label="Selecione sua etnia">
            <Select showSearch>
              {racas.map(country => (
                <Option key={country} value={country}>{country}</Option>
              ))}
            </Select>
          </Form.Item>

          {/* operationRadius */}
          <Form.Item name="serviceRadius" label="Distância que você gostaria de prestar seus serviços (0 - 50km)" rules={[{ required: true, message: 'Por favor, insira um raio de atendimento válido!' }]}>
            <InputNumber min={0} max={50} addonAfter={"KM"} />
          </Form.Item>

          {/* role */}
          <Form.Item name="services" label="Serviços Prestados" rules={[{ required: true, message: 'Por favor, selecione um serviço!' }]}>
            <Select
              showSearch
              placeholder="Selecione um serviço"
              optionFilterProp="children"
            >
              {profissoes.map(country => (
                <Option key={country} value={country}>{country}</Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item name="families" label="Quantos filhos(a) com menos de 18 anos você tem?" rules={[{ required: true, message: 'Por favor, selecione uma opção!' }]}>
            <Select showSearch placeholder="Selecione a quantidade">
              {familias.map(country => (
                <Option key={country} value={country}>{country}</Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item name="scholarship" label="Grau de escolaridade" rules={[{ required: true, message: 'Por favor, selecione uma opção!' }]}>
            <Select showSearch placeholder="Selecione o grau de escolaridade">
              {escolaridade.map(country => (
                <Option key={country} value={country}>{country}</Option>
              ))}
            </Select>
          </Form.Item>

          {/* about */}
          <Form.Item name="bio" label="Descrição">
            <TextArea
              showCount
              maxLength={300}
              placeholder="Liste os serviços que você presta..."
              style={{ height: 120, resize: 'none' }}
            />
          </Form.Item>

          {/* payments */}
          <Form.Item name="paymentTypes" label="Tipos de Pagamento Aceitos">
            <Checkbox.Group options={['PIX', 'Cartão de Crédito', 'Cartão de Débito', 'Dinheiro', 'Boleto Bancário', 'Permuta']} />
          </Form.Item>

          <Alert message="A cobrança pelos serviços que você presta é de sua responsabilidade." type="info" showIcon />

          <br />

          {/* budget -> deve enviar o valor inserido no input ou o valor do checkbox caso ele seja marcado */}
          <Form.Item name="budgetValue" label="Valor do Orçamento">
            <Input
              addonAfter={
                <Checkbox
                  checked={checked}
                  onChange={handleCheckboxChange}
                  value="Não cobro para realizar orçamento"
                >
                  Não cobro para realizar orçamento
                </Checkbox>
              }
              disabled={checked}
              type="text"
              placeholder="0,00"
              prefix="R$"
              value={valorCobrado}
              onChange={handleValueChange}
            />
          </Form.Item>

          <Form.Item name="portfolio" label="Link do seu portfólio de serviços ou produtos">
            <Input />
          </Form.Item>

          {/*}

          <Form.Item name="uploadPortfolio" label="Upload do Portfólio">
            <Upload
              beforeUpload={(file) => false}
              multiple={true}
            >
              <Button icon={<UploadOutlined />}>Selecionar arquivos</Button>
            </Upload>
          </Form.Item>
            {*/}

          {/* badges -> false por padrão, true se o checkbox for marcado */}
          <Form.Item name="badges" valuePropName="checked" label={
            <div style={{ display: "flex", alignItems: "center" }}>
              <p style={{ flexShrink: 0 }}>Desejo me identificar na plataforma como:</p>
              <Popover content="Inserção em determinados grupos na plataforma. Eles ajudam a destacar suas características, mas não servem como critério de exclusão na hora da contratação de serviços... fique tranquilo!"><div className="hoverQtn" style={{ flexShrink: 0, width: "8%", marginLeft: "5%" }}>?</div></Popover>
            </div>
          }>
            <Checkbox.Group options={[
              { label: 'Pessoa Idosa', value: 'idoso' },
              { label: 'Pessoa com Deficiência', value: 'imigrante' },
              { label: 'Imigrante', value: 'pcd' }
            ]} defaultValue={[]} />
          </Form.Item>

          {/* isLookingForJob -> false por padrão, true se o checkbox for marcado */}
          <Form.Item name="badge" label="">
            <Checkbox value={true}>
              <div style={{ display: "flex", alignItems: "center" }}>
                <p style={{ flexShrink: 0 }}>Estou atualmente desempregado/trabalhando informalmente e gostaria de entrar para o banco de talentos da Nobis.</p><Popover content={<p>Ao optar por fazer parte do nosso Banco de Talentos, você permitirá que empresas parceiras ofereçam vagas exclusivas para você. <br />
                  Você também receberá notificações sobre oportunidades de trabalho na sua área disponíveis!</p>}><div className='hoverQtn'>?</div></Popover>
              </div>
            </Checkbox>
          </Form.Item>
          <Form.Item name="remoteWork" label="">
            <Checkbox value={true}>
              <div style={{ display: "flex", alignItems: "center" }}>
                <p style={{ flexShrink: 0 }}>Presto serviços de forma remota.</p>
              </div>
            </Checkbox>
          </Form.Item>
        </>
      )}
      <Alert
        message={
          <>
            Caso tenha alguma dúvida, visite nosso fórum de
            <a href="/faq" target="_blank" rel="noopener noreferrer"> Perguntas Frequentes!</a>
          </>
        }
        type="info"
        showIcon
      />

      <br />


      <Form.Item
        name="aceitaLGPD"
        valuePropName="checked"
        rules={[{ required: true, message: 'Você precisa aceitar os termos da LGPD!' }]}
      >
        <Checkbox>
          Declaro que li e aceito a <a target="_blank" rel="noopener noreferrer">Política de Privacidade</a> e estou de acordo com a coleta e uso dos meus dados conforme a LGPD.
        </Checkbox>
      </Form.Item>




      <br />
      <Form.Item>
        <Button type="primary" htmlType="submit" loading={loading}>Cadastrar</Button>
      </Form.Item>
    </Form>
  );
};

export default RegistrationForm;
