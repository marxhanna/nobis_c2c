import React, { useState, useEffect } from 'react';
import InputMask from 'react-input-mask';
import { Form, Input, Button, Radio, Select, Checkbox, Upload, InputNumber, Alert, Popover, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import moment from 'moment';
import { validateCNPJ, validateCPF, validateBirthDate, validateMobileNumber } from '../assets/schemas/validateDocuments';
import { Link } from 'react-router-dom';
import { countries, deficiencias, escolaridade, familias, profissoes, racas } from '../assets/schemas/signUpSchemas';

const { TextArea } = Input;
const { Option } = Select;

const RegistrationForm = () => {
  const url = window.location.href;
  const pdCode = url.split('/cadastro/')[1];

  const [form] = Form.useForm();
  const [serviceType, setServiceType] = useState('request');
  const [hasDisability, setHasDisability] = useState(false);
  const [pfp, setPfp] = useState(null);
  const [uploadPortfolioList, setUploadPortfolioList] = useState([]);
  const [checked, setChecked] = useState(false);
  const [budgetDisabled, setBudgetDisabled] = useState(false);
  const [birthdate, setBirthdate] = useState('');
  const [valorCobrado, setValorCobrado] = useState<string>('');
  const [isProvider, setIsProvider] = useState(false);

  useEffect(() => {
    if (pdCode) {
      setIsProvider(true);
      setServiceType('provide');
      form.setFieldsValue({ serviceType: 'request' });
    }
  }, [pdCode]);

  const formatCurrency = (value: string) => {
    let numericValue = value.replace(/[^\d]/g, '');
    let numberValue = parseFloat(numericValue) / 100;

    if (isNaN(numberValue)) {
      return 'R$ 0,00';
    }

    return `${numberValue.toFixed(2).replace('.', ',')}`;
  };

  const handleValueChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    const formattedValue = formatCurrency(value);
    setValorCobrado(formattedValue);
    form.setFieldsValue({ valorCobrado: formattedValue });
  };

  const handleDateChange = (e) => {
    const value = e.target.value;
    const formattedDate = moment(value, 'DD/MM/YYYY').format('YYYY-MM-DD');
    setBirthdate(formattedDate);
  };

  const onServiceTypeChange = e => {
    setServiceType(e.target.value);
  };

  const onDisabilityChange = e => {
    setHasDisability(e.target.value === 'yes');
  };

  const handleCheckboxChange = e => {
    const isChecked = e.target.checked;
    setChecked(isChecked);
    setBudgetDisabled(isChecked);
  };



  const handleSubmitTest = (values) => {
    console.log(values)
  }

  const handleSubmit = values => {
    console.log(values)
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
    formData.append('birthCity', "null");
    formData.append('birthContry', serviceType === 'request' ? '' : values.birthCountry || ''); // Define um valor padrão vazio
    formData.append('birthState', 'null');
    formData.append('operationRadius', serviceType === 'request' ? '' : values.serviceRadius || ''); // Define um valor padrão vazio

    if (values.uploadPortfolio) {
      values.uploadPortfolio.fileList.forEach(file => {
        console.log(file)
        formData.append('documents', file.originFileObj);
      });
    }
    formData.append('isClient', serviceType === 'request' ? 'true' : 'false');
    formData.append('country', values.country);
    formData.append('state', values.estado);
    formData.append('city', values.cidade);
    formData.append('cep', values.cep);
    formData.append('address', values.rua);
    formData.append('number', values.numero);
    formData.append('digitalPartnerCode', pdCode ? pdCode : '');
    formData.append('complement', values.complemento);
    formData.append('isLookingForJob', values.isLookingForJob ? 'false' : 'true');
    formData.append('clubUuid', 'null');
    formData.append('role', serviceType === 'request' ? '' : values.services || '');
    formData.append('badges', values.badge ? 'false' : 'true');
    formData.append('badgesIncluded', values ?? values.badges.join(","))
    formData.append('payments', serviceType === 'request' ? '' : (values.paymentTypes ? values.paymentTypes.join(', ') : ''));
    formData.append('birthdate', values.birthdate ? moment(values.birthdate, 'DD/MM/YYYY').format('YYYY-MM-DD') : 'null');
    formData.append('remoteWork', values.remoteWork ? 'false' : 'true');
    formData.append('families', values.families);
    formData.append('scholarship', values.scholarship);

    const options = {
      method: 'POST',
      body: formData,
    };

    fetch('https://brenno-envoriment-node.1pc5en.easypanel.host/users', options)
      .then(response => response.text())

      .then(response => {
        window.location.href = '/login'
        console.log(response)
      })
      .catch(err => {
        alert("Algo deu errado, revise os campos e tente novamente")
        console.error(err)
      });
  };

  const handleAvatarUpload = ({ file }) => {
    setPfp(file);
  };

  const handlePortfolioUpload = ({ fileList }) => {
    setUploadPortfolioList(fileList);
  };

  const fetchAddress = async (cep: string) => {
    try {
      const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      const data = await response.json();

      if (data.erro) {
        message.error('CEP não encontrado!');
        return;
      }

      // Fill the form with the address response
      form.setFieldsValue({
        rua: data.logradouro,
        complemento: data.complemento,
        cidade: data.localidade,
        estado: data.uf
        // You can set 'numero' and others as needed
      });
    } catch (error) {
      message.error('Erro ao buscar o CEP!');
    }
  };


  const handleCepBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const cep = e.target.value.replace(/\D/g, ''); // Removing non-numeric characters
    if (cep.length === 8) { // Brazilian CEP has 8 digits
      fetchAddress(cep);
    } else {
      message.error('CEP inválido!');
    }
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleSubmit}
      initialValues={{
        serviceType: true,
        profilePicture: { fileList: [] },
        uploadPortfolio: { fileList: [] },
        paymentTypes: [],
        budgetValue: '',
      }}
    >
      {pdCode ? (
        <>
        </>
      ) : (
        <>
          {/* isClient */}
          <Form.Item name="serviceType" label="Tipo de Serviço">
            <Radio.Group onChange={onServiceTypeChange}>
              <Radio value={'request'}>Quero solicitar serviços</Radio>
              <Radio value={'provide'}>Quero prestar serviços</Radio>
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
              disabled={budgetDisabled}
              type="text"
              placeholder="0,00"
              prefix="R$"
              value={valorCobrado}
              onChange={handleValueChange}
            />
          </Form.Item>

          <Form.Item name="uploadPortfolio" label="Upload do Portfólio">
            <Upload
              beforeUpload={(file) => false}
              multiple={true}
            >
              <Button icon={<UploadOutlined />}>Selecionar arquivos</Button>
            </Upload>
          </Form.Item>

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
      <Form.Item>
        <Button type="primary" htmlType="submit">Cadastrar</Button>
      </Form.Item>
    </Form>
  );
};

export default RegistrationForm;