import styled from 'styled-components';
import { Badge, Button, Card, Form, Input, Select, theme, Upload } from "antd";
import type { FormProps, UploadFile, SelectProps } from 'antd';
import { useState, useEffect } from 'react';
import { UploadChangeParam } from 'antd/es/upload';
import { useNavigate } from 'react-router-dom';
import baseUrl from '../../../../../components/assets/schemas/baseUrl';

const HalfContainer = styled.div`
  width: 50%;
  padding-right: 20px;
  display: grid;
  align-content: space-around;
`

const FlexContainer = styled.div`
  display: flex;
  @media (max-width: 768px) {
    display: contents;
  }
`

type FieldType = {
  projects?: string;
  title?: string;
  videoUrl?: string;
  tags?: string[];
  thumbnail?: UploadFile;
};

const NovoVideo = () => {
  const [loading, setLoading] = useState(false);
  const [projectUuid, setProjectUuid] = useState<string>("");
  const navigate = useNavigate();
  const [projects, setProjects] = useState<SelectProps['options']>([]);
  const authToken = localStorage.getItem('digitalPartnerToken');

  const [imageUrl, setImageUrl] = useState<string | null>('https://t4.ftcdn.net/jpg/05/17/53/57/360_F_517535712_q7f9QC9X6TQxWi6xYZZbMmw5cnLMr279.jpg');

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const { Meta } = Card;
  const onFinish: FormProps<FieldType>['onFinish'] = (values) => {
    setLoading(true)
    console.log(values.thumbnail)
    console.log('Values:', values);

    const form = new FormData();
    form.append("title", values.title);
    form.append("link", values.videoUrl);
    form.append("thumbnail", values.thumbnail.file);
    form.append("tags", JSON.stringify(values.tags));

    const options = {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${authToken}`
      }
    };

    options.body = form;

    fetch(`${baseUrl}/digital_partners/projects/${projectUuid}/videos`, options)
      .then(response => response.json())
      .then(response => {
        setLoading(false);
        navigate('/parceiro-digital/learning/videos')
      })
      .catch(err => {
        console.error(err)
        setLoading(false)
      });
  };

  const handleImageChange = (info: UploadChangeParam) => {
    const file = info.fileList[0].originFileObj;
    if (file) {
      const reader = new FileReader();
      reader.onload = e => {
        setImageUrl(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    const options = {
      method: 'GET',
      headers: {
        'User-Agent': 'insomnia/10.1.1',
        Authorization: `Bearer ${authToken}`,
      }
    };

    fetch(baseUrl + '/digital_partners/projects', options)
      .then(response => response.json())
      .then(response => {
        const projectOptions = response.map((project: Record<string, string>) => ({
          label: project.title,
          value: project.uuid
        }));
        setProjects(projectOptions);
      })
      .catch(err => console.error(err));
  }, [authToken]);

  return (
    <div
      style={{
        padding: 24,
        minHeight: "81vh",
        background: colorBgContainer,
        borderRadius: borderRadiusLG,
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'flex-start',
        flexDirection: 'column'
      }}
    >
      <h1>Postar vídeo</h1>
      <Form
        onFinish={onFinish}
        layout="vertical"
      >
        <FlexContainer>
          <HalfContainer>
            <Form.Item<FieldType>
              label="Titulo do vídeo"
              name="title"
              rules={[{ required: true, message: 'Por favor insira o titulo do vídeo!' }]}
            >
              <Input />
            </Form.Item>

            <Form.Item<FieldType>
            label="Projetos"
            name="projects"
            rules={[{ required: true, message: 'Selecione ao menos um projeto' }]}
          >
            <Select
              allowClear
              mode="multiple"
              notFoundContent="Nenhum projeto encontrado"
              style={{ width: '100%' }}
              placeholder="Selecione o projeto para enviar o vídeo"
              options={projects}
              onChange={(value) => {
                console.log(value);
                if (value.length > 0) {
                  setProjectUuid(value);
                }
              }}
            />
          </Form.Item>

            <Form.Item<FieldType>
              label="Link do vídeo"
              name="videoUrl"
              rules={[{ required: true, message: 'Por favor insira o link do vídeo!' }]}
            >
              <Input />
            </Form.Item>

            <Form.Item<FieldType>
              label="Tags"
              name="tags"
            >
              <Select
                mode="tags"
                style={{ width: '100%' }}
                placeholder="Tags Mode"
              />
            </Form.Item>
          </HalfContainer>
          <HalfContainer>
            <img style={{
              maxWidth: "100%",
              maxHeight: "250px",
              borderRadius: "20px"
            }} src={imageUrl || ''} alt="Thumbnail Preview" />
            <Form.Item<FieldType>
              name="thumbnail"
            >
              <Upload
                beforeUpload={() => false}
                onChange={handleImageChange}
                maxCount={1}
                accept="image/*"
              >
                <Button>Selecione a imagem de capa</Button>
              </Upload>
            </Form.Item>
          </HalfContainer>
        </FlexContainer>

        <Form.Item
          style={{
            display: "flex",
            justifyContent: "center"
          }}
        >
          <Button
            loading={loading}
            size='large' type="primary" htmlType="submit">
            Enviar
          </Button>
        </Form.Item>
      </Form>
    </div>
  )
}

export default NovoVideo