import { Button, Form, Input, Modal } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";
import logo from '../../../components/assets/logos/nobis_horizontal.png';
import baseUrl from "../../../components/assets/schemas/baseUrl";

const CenteredContainer = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  height: 80vh;
  width: 100%; 
`;

const CustomLabel = styled.label`
  font-weight: 300;
`

const RecuperaSenha: React.FC = () => {
  const { code } = useParams()
  const navigate = useNavigate();

  const [modal, contextHolder] = Modal.useModal();

  const [form] = Form.useForm();

  const onFinish = (values: any) => {
    const options = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        password: values.password,
        code: values.code
      })
    };

    fetch(`${baseUrl}/digital_partners/reset/password`, options)
      .then(async response => {
        if (!response.ok) {
          // Handle error response
          const errorText = await response.text(); // read the error message as text

          if (errorText === 'Confirmation code not found')
            modal.error({
              title: "Erro",
              content: <p>Código de redefinição expirado ou inexistente</p>
            })

          throw new Error(errorText); // throw the error to be caught in the catch block
        }
        return response.json(); // return the successful response as JSON
      })
      .then(async response => {
        const confirm = await modal.success({
          title: "Senha redefinida com sucesso",
          content: <p>Senha redefinida com sucesso</p>
        })

        if (confirm) {
          navigate('/parceiro-digital/login');
        }
      })
      .catch(err => console.error(err));
  };

  return (
    <CenteredContainer>
      {contextHolder}
      <h1>Recuperar senha</h1>
      <img src={logo} style={{ width: '300px', margin: '20px' }} />
      <Form
        form={form}
        name="register"
        onFinish={onFinish}
        layout="vertical"
      >
        <Form.Item
          name="code"
          label={<CustomLabel>Código</CustomLabel>}
          rules={[{ required: true, message: 'O código é necessário!' }]}
          initialValue={code}
        >
          <Input.OTP />
        </Form.Item>

        <Form.Item
          name="password"
          label={<CustomLabel>Nova senha</CustomLabel>}
          rules={[
            { required: true, message: 'Por favor coloque a sua senha!' },
            { min: 8, message: 'A senha deve conter ao menos 8 caracteres' }
          ]}
          hasFeedback
        >
          <Input.Password />
        </Form.Item>

        <Form.Item
          name="confirm"
          label={<CustomLabel>Confirme a nova senha</CustomLabel>}
          dependencies={['password']}
          hasFeedback
          rules={[
            { required: true, message: 'Por favor coloque a sua senha!' },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('password') === value) {
                  return Promise.resolve();
                }
                return Promise.reject(
                  new Error('As senhas não coincidem!')
                );
              }
            })
          ]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit">
            Enviar
          </Button>
        </Form.Item>
      </Form>

    </CenteredContainer>
  )};  

export default RecuperaSenha;