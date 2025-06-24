import React, { useState, useEffect } from 'react';
import { Button, Form, Input, Avatar, message, Select, Row, Col, Card, Checkbox, InputNumber, Upload } from 'antd';
import Footer from '../../../components/prestador/footer';
import moment from 'moment';
import Header from '../../../components/prestador/index/header';
import { useMediaQuery } from 'react-responsive';
import HeaderMobile from '../../../components/prestador/index/headerMobile';
import spinner from '../../../components/assets/loading.gif';
import { PlusOutlined } from '@ant-design/icons';
import baseUrl from '../../../components/assets/schemas/baseUrl';
import { countries, deficiencias, profissoes } from '../../../components/assets/schemas/signUpSchemas';
import InputMask from 'react-input-mask';

const { Option } = Select;
const { TextArea } = Input;

export default function Inicio() {
  const url = window.location.href;
  const uuid = url.split('/perfil-prestador/')[1];
  const authToken = localStorage.getItem('authToken');
  const [dados, setDados] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [birthdate, setBirthdate] = useState(null);

  const isMobile = useMediaQuery({ query: '(max-width: 768px)' });

  const [form] = Form.useForm();
  const [checked, setChecked] = useState(false);
  const [budgetDisabled, setBudgetDisabled] = useState(false);

  const handleCheckboxChange = e => {
    const isChecked = e.target.checked;
    setChecked(isChecked);
    setBudgetDisabled(isChecked);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${baseUrl}/users/profile/${uuid}`);
        if (!response.ok) {
          throw new Error('Failed to fetch profile data');
        }
        const data = await response.json();
        setDados(data[0]);
        setBirthdate(data[0].birthdate); // Definir a data de nascimento inicial
        setLoading(false);
      } catch (error) {
        console.error('Error fetching profile data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, [uuid]);

  const handleEdit = () => setEditMode(true);
  const handleCancel = () => setEditMode(false);

  const handleSave = async (values) => {
    try {
      const formattedBirthdate = moment(values.birthdate, 'DD/MM/YYYY').format('YYYY-MM-DD');

      const response = await fetch(`${baseUrl}/users/${uuid}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          ...values,
          operationRadius: values.serviceRadius,
          birthdate: formattedBirthdate,
          payments: values.paymentTypes ? values.paymentTypes.join(', ') : '',
           isLookingForJob: values.isLookingForJob ?? false,
        }),
      });

      if (!response.ok) {
        throw new Error('Erro ao tentar atualizar perfil. Por favor tente novamente.');
      }

      message.success('Dados atualizados com sucesso!');

      // Atualizar o estado com os dados mais recentes, sem recarregar a página
      const updatedDataResponse = await fetch(`${baseUrl}/users/profile/${uuid}`);
      const updatedData = await updatedDataResponse.json();

      setDados(updatedData[0]); // Atualiza os dados
      setEditMode(false); // Sai do modo de edição
      window.location.reload();
    } catch (error) {
      console.error('Erro ao tentar atualizar perfil:', error);
      message.error('Erro ao tentar atualizar perfil. Por favor tente novamente.');
    }
  };



  if (loading) {
    return <div className='container'><img src={spinner} alt="loading" /></div>;
  }

  if (!dados) {
    return <p>Sem dados disponíveis!</p>;
  }

  const {
    avatar, fullName, clientRatings, email, phone, genre, birthdate: storedBirthdate, address, number, complement, about,
    city, state, cep, role, birthContry, budget, deficiency, operationRadius, portfolioUrl, payments = []
  } = dados;

  // Calculando a média de classificação
  const averageRating = clientRatings?.length
    ? (
      clientRatings.reduce((acc, curr) => acc + curr.helpfulness + curr.respect + curr.payment, 0) / (clientRatings.length * 3)
    ).toFixed(1)
    : 0;

  return (
    <>
      {isMobile ? <HeaderMobile /> : <Header />}
      <br /><br /><br />
      <div className="container" style={{ padding: '20px' }}>
        <h1 className='title'>Meus Dados</h1>
        <Card>
          {editMode ? (
            <Form
              initialValues={{
                fullName,
                email,
                phone,
                genre,
                birthdate: moment(storedBirthdate).add(1, 'days').format('DD/MM/YYYY'),
                address,
                number,
                complement,
                city,
                about,
                state,
                cep,
                role,
                birthContry,
                budget,
                deficiency,
                portfolioUrl,
                isLookingForJob: dados?.isLookingForJob ?? false, 
                serviceRadius: operationRadius,
                payments: payments.map(payment => payment.type)
              }}
              onFinish={handleSave}
              layout="vertical"
              form={form}
            >
              <div style={{
                display: "flex"
              }}>
                <Avatar src={`${baseUrl}/uploads/${avatar}`} size={100} />
                <Upload
                  name="profilePicture"
                  listType="picture-circle"
                  className="avatar-uploader"
                  maxCount={1}
                  action={baseUrl + '/users/update/avatar'}
                  headers={{
                    'Authorization': `Bearer ${authToken}`
                  }}
                  method="PUT"
                >
                  <button style={{ border: 0, background: 'none' }} type="button">
                    <PlusOutlined />
                  </button>
                </Upload>
              </div>
              <Form.Item
                label="Nome Completo"
                name="fullName"
                rules={[{ required: true, message: 'Por favor insira seu nome completo' }]}
              >
                <Input placeholder={fullName} />
              </Form.Item>
              <Form.Item
                label="Email"
                name="email"
                rules={[{ required: true, message: 'Por favor insira seu email' }]}
              >
                <Input placeholder={email} />
              </Form.Item>
              <Form.Item
                label="Descrição"
                name="about"
                rules={[{ required: true, message: 'Por favor insira sua descrição' }]}
              >
                <TextArea placeholder={about} />
              </Form.Item>
              <Form.Item
                label="Telefone"
                name="phone"
                rules={[{ required: true, message: 'Por favor insira seu telefone' }]}
              >
                <Input placeholder={phone} />
              </Form.Item>
              <Form.Item
                label="Gênero"
                name="genre"
                rules={[{ required: true, message: 'Por favor selecione seu gênero' }]}
              >
                <Select placeholder={genre}>
                  <Option value="Masculino">Masculino</Option>
                  <Option value="Feminino">Feminino</Option>
                  <Option value="Outro">Outro</Option>
                </Select>
              </Form.Item>
              <Form.Item
                label="Data de Nascimento"
                name="birthdate"
                rules={[{ required: true, message: 'Por favor selecione sua data de nascimento' }]}
              >
                <InputMask
                  mask="99/99/9999"
                  placeholder="DD/MM/AAAA"
                >
                  {(inputProps: any) => <Input {...inputProps} style={{ width: 400 }} />}
                </InputMask>
              </Form.Item>
              <Form.Item
                label="Endereço"
                name="address"
                rules={[{ required: true, message: 'Por favor insira seu endereço' }]}
              >
                <Input placeholder={address} />
              </Form.Item>
              <Form.Item
                label="Número"
                name="number"
                rules={[{ required: true, message: 'Por favor insira o número do seu endereço' }]}
              >
                <Input placeholder={number} />
              </Form.Item>
              <Form.Item
                label="Complemento"
                name="complement"
              >
                <Input placeholder={complement} />
              </Form.Item>
              <Form.Item
                label="Cidade"
                name="city"
                rules={[{ required: true, message: 'Por favor insira sua cidade' }]}
              >
                <Input placeholder={city} />
              </Form.Item>
              <Form.Item
                label="Estado"
                name="state"
                rules={[{ required: true, message: 'Por favor insira seu estado' }]}
              >
                <Input placeholder={state} />
              </Form.Item>
              <Form.Item
                label="CEP"
                name="cep"
                rules={[{ required: true, message: 'Por favor insira seu CEP' }]}
              >
                <Input placeholder={cep} />
              </Form.Item>
              <Form.Item name="role" label="Serviços Prestados" >
                <Select
                  showSearch
                  placeholder="Selecione um serviço"
                  optionFilterProp="children"
                  defaultValue={role}
                >
                  {profissoes.map(prof => (
                    <Option key={prof} value={prof}>{prof}</Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item name="birthContry" label="País de Nascimento">
                <Select showSearch defaultValue={birthContry}>
                  {countries.map(country => (
                    <Option key={country} value={country}>{country}</Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item name="budget" label="Valor do Orçamento">
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
                  prefix="R$"
                  placeholder="0,00"
                />


              </Form.Item>
              <Form.Item name="portfolioUrl" label="Link do Portfólio">
                <Input placeholder={portfolioUrl || 'https://meuportfolio.com'} />
              </Form.Item>
                  

              <Form.Item
                name="isLookingForJob"
                valuePropName="checked"
                label="Estou atualmente desempregado/trabalhando informalmente e gostaria de entrar para o banco de talentos da Nobis."
              >
                <Checkbox>Sim</Checkbox>
              </Form.Item>



              <Form.Item
                label="Deficiência"
                name="deficiency"
              >
                <Select showSearch defaultValue={deficiency}>
                  {deficiencias.map(country => (
                    <Option key={country} value={country}>{country}</Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item name="serviceRadius" label="Distância que você gostaria de prestar seus serviços (0 - 50km)" rules={[{ required: true, message: 'Por favor, insira um raio de atendimento válido!' },
              ]}>
                <InputNumber min={0} max={50} addonAfter={"KM"} />
              </Form.Item>
              <Form.Item
                name="paymentTypes"
                initialValue={payments.map(p => p.type)}
                label="Tipos de Pagamento Aceitos"
                rules={[{
                  required: true,
                  message: 'Por favor, selecione pelo menos um tipo de pagamento!',
                  validator: (_, value) => value && value.length > 0 ? Promise.resolve() : Promise.reject('Por favor, selecione pelo menos um tipo de pagamento!')
                }]}
              >
                <Checkbox.Group
                  options={['PIX', 'Cartão de Crédito', 'Cartão de Débito', 'Dinheiro', 'Boleto Bancário', 'Permuta']}

                />
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit">Salvar</Button>
                <Button style={{ marginLeft: '10px' }} onClick={handleCancel}>Cancelar</Button>
              </Form.Item>
            </Form>
          ) : (
            <Row gutter={16}>
              <Col xs={24} sm={6} style={{ textAlign: 'center' }}>
                <Avatar src={`${baseUrl}/uploads/${avatar}`} size={100} />
              </Col>
              <Col xs={24} sm={18}>
                <p><strong>Nome:</strong> {fullName}</p>
                <p><strong>Email:</strong> {email}</p>
                <p><strong>Descrição:</strong> {about}</p>
                <p><strong>Telefone:</strong> {phone}</p>
                <p><strong>Gênero:</strong> {genre}</p>
                <p><strong>Data de Nascimento:</strong> {moment(birthdate).add(1, 'days').format('DD/MM/YYYY')}</p>
                <p><strong>Endereço:</strong> {address}, {number} {complement}</p>
                <p><strong>Cidade:</strong> {city}</p>
                <p><strong>Estado:</strong> {state}</p>
                <p><strong>CEP:</strong> {cep}</p>
                <p><strong>Serviço:</strong> {role}</p>
                <p><strong>País de Nascimento:</strong> {birthContry}</p>
                <p><strong>Orçamento: </strong> {typeof budget === 'number' ? `R$ ${budget},00` : budget}</p>
                <p><strong>Deficiência:</strong> {deficiency}</p>
                <p><strong>Raio de Operação:</strong> {operationRadius} km</p>
                <p><strong>Métodos de Pagamento:</strong> {payments.map(payment => payment.type).join(', ')}</p>
                <p><strong>Nota Média:</strong> {averageRating}</p>
                <Button type="primary" onClick={handleEdit}>Editar Informações</Button>
              </Col>
            </Row>
          )}
        </Card>
      </div>
      <br /><br /><br /><br /><br /><br />
      <Footer />
    </>
  );
}