import styled from 'styled-components';
import logo from '../../../components/assets/logos/nobis_horizontal.png';
import UF from '../../../components/assets/schemas/UF.json';
import InputMask from 'react-input-mask';
import { Typography, FormProps, Form, Input, Button, message, Select, Upload } from 'antd';
import { useState } from 'react';
import { UploadOutlined } from '@ant-design/icons';
import baseUrl from '../../../components/assets/schemas/baseUrl';

const { Title } = Typography;

const CenteredContainer = styled.div`
  width: 80%;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const FormContent = styled.div`
  width: 80%;
  @media only screen and (max-width: 600px) {
    width: 100%;
  }
`;

type CompanyInfo = {
  responsibleName: string;
  email: string;
  password: string;
  confirmPassword: string;
  image: any;
  orgName: string;
  companyReason: string;
  cnpj: string;
  site: string;
  activitiesCategory: string;
  role: string;
  cep: string;
  address: string;
  number: string;
  complement: string;
  neighborhood: string;
  city: string;
  uf: string;
  facebook: string;
  instagram: string;
  youtube: string;
  linkedin: string;
};


const Cadastrar = () => {
  const [form] = Form.useForm();

  const [messageApi, contextHolder] = message.useMessage();

  const [cepLoading, setCepLoading] = useState(false);

  const handleCEPSubmit = (event: any) => {
    setCepLoading(true)
    const { value } = event.target;

    const viaCepBaseUrl = `https://viacep.com.br/ws/${value}/json/`;

    fetch(viaCepBaseUrl).then((response) => response.json())
      .then(data => {
        console.log(data)
        setCepLoading(true)
        form.setFieldValue("city", data.localidade)
        form.setFieldValue("address", data.logradouro)
        form.setFieldValue("neighborhood", data.bairro)
        form.setFieldValue("uf", data.uf)
      })
  }

  const onFinish: FormProps<CompanyInfo>['onFinish'] = (values) => {
    console.log(values)

    console.log('Success:', values);

    const form = new FormData();

    form.append("responsibleName", values.responsibleName);
    form.append("email", values.email);
    form.append("password", values.password);
    form.append("orgName", values.orgName);
    form.append("companyReason", values.companyReason);
    form.append("cnpj", values.cnpj);
    form.append("actitivitiesCategory", values.activitiesCategory);
    form.append("role", values.role);
    form.append("cep", values.cep);
    form.append("address", values.address);
    form.append("number", values.number);
    form.append("neighborhood", values.neighborhood);
    form.append("city", values.city);
    form.append("uf", values.uf);
    form.append("image", values.image.file);

    const options = {
      method: 'POST',
      body: form
    };

    fetch(baseUrl + '/digital_partners/', options)
      .then(response => response.json())
      .then(response => {
        console.log(response)

        window.location.href = "/parceiro-digital"
      })
      .catch(err => {
        messageApi.open({
          type: 'error',
          content: 'Algo deu errado, por favor revise seus dados',
        });
      });
  }

  return (
    <CenteredContainer>
      {contextHolder}
      <img src={logo} style={{ width: '300px', margin: '20px' }} />
      <Title>
        Cadastro de Parceiro Digital
      </Title>
      <FormContent>
        <Form
          name="basic"
          layout='vertical'
          form={form}
          labelCol={{ span: 8 }}
          initialValues={{ remember: true }}
          onFinish={onFinish}
          autoComplete="off"
        >
          <Form.Item<CompanyInfo>
            label="Nome do responsável"
            name="responsibleName"
            rules={[{ required: true, message: 'Por favor, entre com o nome do responsável!' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item<CompanyInfo>
            label="Email"
            name="email"
            rules={[{ required: true, message: 'Por favor, entre com seu email!' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item<CompanyInfo>
            label="Digite sua senha"
            name="password"
            rules={[{ required: true, message: 'Por favor, entre com sua senha!' }]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item<CompanyInfo>
            label="Confirme sua senha"
            name="confirmPassword"
            rules={[
              { required: true, message: 'Por favor, entre com sua senha!' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('As senhas não são iguais!'));
                },
              }),
            ]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item<CompanyInfo>
            label="Nome da organização"
            name="orgName"
            rules={[{ required: true, message: 'Por favor, entre com o nome da organização!' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item<CompanyInfo>
            label="Razão Social"
            name="companyReason"
            rules={[{ required: true, message: 'Por favor, entre com a razão social!' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item<CompanyInfo>
            label="CNPJ"
            name="cnpj"
            rules={[{ required: false, message: 'Por favor, insira o CNPJ!' }]}
          >
            <InputMask mask="99.999.999/9999-99">
              {(inputProps) => <Input {...inputProps} />}
            </InputMask>
          </Form.Item>

          <Form.Item<CompanyInfo>
            label="Logomarca"
            name="image"
            rules={[{ required: false, message: 'Por favor, selecione uma imagem!' }]}
          >
            <Upload listType='picture' maxCount={1} beforeUpload={() => false} >
              <Button icon={<UploadOutlined />}>Selecione imagem</Button>
            </Upload>
          </Form.Item>

          <Form.Item<CompanyInfo>
            label="Site"
            name="site"
          >
            <Input />
          </Form.Item>

          <Form.Item<CompanyInfo>
            label="Categoria de atividades"
            name="activitiesCategory"
            rules={[{ required: true, message: 'Por favor, seleciona uma categoria de atividades!' }]}
          >
            <Select
              options={[
                { label: 'Indústria', value: 'Indústria' },
                { label: 'Comércio', value: 'Comércio' },
                { label: 'Serviços', value: 'Serviços' },
                { label: 'Terceiro Setor', value: 'Terceiro Setor' }
              ]}
            />
          </Form.Item>

          <Form.Item<CompanyInfo>
            label="Cargo do responsável"
            name="role"
            rules={[{ required: true, message: 'Por favor, selecione o cargo do responsável!' }]}
          >
            <Select
              options={[
                { label: 'C-level', value: 'C-level' },
                { label: 'Diretoria', value: 'Diretoria' },
                { label: 'Superintendência', value: 'Superintendência' },
                { label: 'Gerência', value: 'Gerência' },
                { label: 'Supervisão', value: 'Supervisão' },
                { label: 'Coordenação', value: 'Coordenação' },
              ]}
            />
          </Form.Item>

          <Form.Item<CompanyInfo>
            label="CEP"
            name="cep"
            rules={[{ required: true, message: 'Por favor, insira seu CEP!' }]}
          >
            <Input.Search
              onBlur={handleCEPSubmit}
              loading={cepLoading}
            />
          </Form.Item>

          <Form.Item<CompanyInfo>
            label="Endereço"
            name="address"
            rules={[{ required: true, message: 'Por favor, insira seu endereço!' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item<CompanyInfo>
            label="Numero"
            name="number"
            rules={[{ required: true, message: 'Por favor, insira o numero do endereço!' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item<CompanyInfo>
            label="Complemento"
            name="complement"
          >
            <Input />
          </Form.Item>

          <Form.Item<CompanyInfo>
            label="Bairro"
            name="neighborhood"
            rules={[{ required: true, message: 'Por favor, insira o bairro!' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item<CompanyInfo>
            label="Cidade"
            name="city"
            rules={[{ required: true, message: 'Por favor, insira a cidade!' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item<CompanyInfo>
            label="UF"
            name="uf"
            rules={[{ required: true, message: 'Por favor, selecione o UF!' }]}
          >
            <Select
              options={UF.UF.map((uf) => ({ label: uf.nome, value: uf.sigla }))}
            />
          </Form.Item>

          <Form.Item<CompanyInfo>
            label="Facebook"
            name="facebook"
          >
            <Input />
          </Form.Item>

          <Form.Item<CompanyInfo>
            label="Instagram"
            name="instagram"
          >
            <Input />
          </Form.Item>

          <Form.Item<CompanyInfo>
            label="YouTube"
            name="youtube"
          >
            <Input />
          </Form.Item>

          <Form.Item<CompanyInfo>
            label="LinkedIn"
            name="linkedin"
          >
            <Input />
          </Form.Item>

          <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
            <Button type="primary" htmlType="submit">
              Cadastrar
            </Button>
          </Form.Item>
        </Form>
      </FormContent>

    </CenteredContainer>
  )
}

export default Cadastrar
