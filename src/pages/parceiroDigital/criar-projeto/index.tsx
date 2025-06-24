import { Button, Form, Input, InputNumber, notification, Upload } from "antd";
import type { FormProps } from "antd";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UploadOutlined } from "@ant-design/icons";
import baseUrl from "../../../components/assets/schemas/baseUrl";

type FieldType = {
  proj_name?: string;
  proj_duration?: string;
  proj_desc?: string;
  proj_video?: string;
  files?: any;
};

const { TextArea } = Input;

const CriarProjeto = () => {
  const [users, setUsers] = useState(null);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const navigation = useNavigate();
  const token = localStorage.getItem("digitalPartnerToken");


  const youtubeRegex =
  /^(https?:\/\/)?(www\.)?(youtube\.com\/(watch\?v=|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;



  const openNotificationWithSuccess = () => {
    notification.success({
      message: "Projeto Criado!",
      description: "Seu projeto foi criado com sucesso.",
      duration: 3,
    });
  };

  useEffect(() => {
    const options = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    fetch(
      `${baseUrl}/digital_partners/create`,
      options
    )
      .then((response) => response.json())
      .then((response) => {
        setUsers(response.users);
      })
      .catch((err) => console.error(err));
  }, [token]);

  const onFinish: FormProps<FieldType>["onFinish"] = (values) => {
    console.log("Success:", values);

    const form = new FormData();

    // Adiciona os dados do formulário
    form.append("image", values.files?.fileList[0]?.originFileObj); // Primeiro arquivo selecionado
    form.append("title", values.proj_name);
    form.append("description", values.proj_desc);
    form.append("duration", values.proj_duration);
    form.append("videoUrl", values.proj_video);

    const options = {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: form,
    };

    setLoading(true); // Ativa o estado de carregamento

    // Realiza o fetch para criar o projeto
    fetch(
      baseUrl +"/digital_partners/projects",
      options
    )
      .then((response) => response.json())
      .then((response) => {
        setLoading(false);

        // Exibe a notificação de sucesso e redireciona
        openNotificationWithSuccess();
        navigation("/parceiro-digital/");
      })
      .catch((err) => {
        setLoading(false);
        console.error(err);
      });
  };

  return (
    <div
      style={{
        padding: 24,
        minHeight: 380,
        background: "#fff",
        borderRadius: 8,
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "space-evenly",
      }}
    >
      {users && (
        <div
          style={{
            width: "70%",
            margin: "8vh 0 20vh 0",
          }}
        >
          <h1>Criar Novo Projeto</h1>

          <Form onFinish={onFinish} form={form} layout="vertical">
            <Form.Item<FieldType>
              label="Nome"
              name="proj_name"
              rules={[{ required: true, message: "Insira o nome do projeto" }]}
            >
              <Input placeholder="Nome do Projeto" />
            </Form.Item>

            <Form.Item<FieldType>
              label="Duração (em meses)"
              name="proj_duration"
              rules={[
                { required: true, message: "Insira a duração do projeto" },
              ]}
            >
              <InputNumber style={{ width: "100%" }} placeholder="Ex.: 2, 3, etc." />
            </Form.Item>

            <Form.Item<FieldType>
              label="Descrição"
              name="proj_desc"
              rules={[
                { required: true, message: "Insira uma descrição do projeto" },
              ]}
            >
              <TextArea rows={4} placeholder="Descrição do Projeto" />
            </Form.Item>

            <Form.Item<FieldType>
              label="Video de apresentação"
              name="proj_video"
              rules={[
                {
                  required: false,
                  validator: (_, value) => {
                    if (!value || youtubeRegex.test(value)) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error("Insira um link válido do YouTube"));            
                  }
                },
              ]}
            >
              <Input placeholder="Ex: https://youtu.be/link" />
            </Form.Item>

            <Form.Item<FieldType> label="Imagem de Capa do Projeto" name="files">
              <Upload maxCount={1} beforeUpload={() => false}>
                <Button icon={<UploadOutlined />}>Anexar arquivo</Button>
              </Upload>
            </Form.Item>

            <br />
            <Form.Item>
              <Button loading={loading} type="primary" htmlType="submit">
                Criar Projeto
              </Button>
            </Form.Item>
          </Form>
        </div>
      )}
    </div>
  );
};

export default CriarProjeto;
