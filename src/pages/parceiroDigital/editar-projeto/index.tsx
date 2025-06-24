import { UploadOutlined } from "@ant-design/icons";
import { Button, Checkbox, CheckboxOptionType, Form, Image, Input, Upload, UploadProps } from "antd";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import baseUrl from "../../../components/assets/schemas/baseUrl";
import { FormProps } from "antd/lib";

const EditarProjeto = () => {
  const { uuid } = useParams();

  const [form] = Form.useForm();

  const [data, setData] = useState(null);

  const token = localStorage.getItem("digitalPartnerToken");

  const navigate = useNavigate();

  useEffect(() => {
    const options = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    fetch(`${baseUrl}/digital_partners/projects/${uuid}`, options)
      .then((response) => response.json())
      .then((response) => {
        setData(response)
        form.setFieldsValue({
          title: response.title,
          description: response.description,
          duration: response.duration,
          ods: response.ods,
        });
      })
      .catch((err) => console.error(err));
  }, [])

  const props: UploadProps = {
    beforeUpload: (s) => {
      return false;
    },
    onChange(info) {
      console.log(info)
    },
  }

  const options: CheckboxOptionType[] = [
    { label: 'ODS 1', value: 1, style: { borderRadius: '4px', padding: '2px', margin: '1px', background: '#E5243B' } },     // No Poverty
    { label: 'ODS 2', value: 2, style: { borderRadius: '4px', padding: '2px', margin: '1px', background: '#DDA63A' } },     // Zero Hunger
    { label: 'ODS 3', value: 3, style: { borderRadius: '4px', padding: '2px', margin: '1px', background: '#4C9F38' } },     // Good Health and Well-being
    { label: 'ODS 4', value: 4, style: { borderRadius: '4px', padding: '2px', margin: '1px', background: '#C5192D' } },     // Quality Education
    { label: 'ODS 5', value: 5, style: { borderRadius: '4px', padding: '2px', margin: '1px', background: '#FF3A21' } },     // Gender Equality
    { label: 'ODS 6', value: 6, style: { borderRadius: '4px', padding: '2px', margin: '1px', background: '#26BDE2' } },     // Clean Water and Sanitation
    { label: 'ODS 7', value: 7, style: { borderRadius: '4px', padding: '2px', margin: '1px', background: '#FCC30B' } },     // Affordable and Clean Energy
    { label: 'ODS 8', value: 8, style: { borderRadius: '4px', padding: '2px', margin: '1px', background: '#A21942' } },     // Decent Work and Economic Growth
    { label: 'ODS 9', value: 9, style: { borderRadius: '4px', padding: '2px', margin: '1px', background: '#FD6925' } },     // Industry, Innovation and Infrastructure
    { label: 'ODS 10', value: 10, style: { borderRadius: '4px', padding: '2px', margin: '1px', background: '#DD1367' } },   // Reduced Inequality
    { label: 'ODS 11', value: 11, style: { borderRadius: '4px', padding: '2px', margin: '1px', background: '#FD9D24' } },   // Sustainable Cities and Communities
    { label: 'ODS 12', value: 12, style: { borderRadius: '4px', padding: '2px', margin: '1px', background: '#BF8B2E' } },   // Responsible Consumption and Production
    { label: 'ODS 13', value: 13, style: { borderRadius: '4px', padding: '2px', margin: '1px', background: '#3F7E44' } },   // Climate Action
    { label: 'ODS 14', value: 14, style: { borderRadius: '4px', padding: '2px', margin: '1px', background: '#0A97D9' } },   // Life Below Water
    { label: 'ODS 15', value: 15, style: { borderRadius: '4px', padding: '2px', margin: '1px', background: '#56C02B' } },   // Life on Land
    { label: 'ODS 16', value: 16, style: { borderRadius: '4px', padding: '2px', margin: '1px', background: '#00689D' } },   // Peace, Justice and Strong Institutions
    { label: 'ODS 17', value: 17, style: { borderRadius: '4px', padding: '2px', margin: '1px', background: '#19486A' } },   // Partnerships for the Goals
    { label: 'ODS 18', value: 18, style: { borderRadius: '4px', padding: '2px', margin: '1px', background: '#7F3718' } },   // Etnoracial Partnership
  ]

  const onFinish: FormProps<any>['onFinish'] = (values) => {
    console.log('Success:', values);

    const formdata = new FormData();
    formdata.append('title', values.title);
    formdata.append('description', values.description);
    formdata.append('ods', JSON.stringify(values.ods));
    formdata.append('image', values.image.file.originFileObj);

    const options = {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`
      },
      body: formdata
    };

    fetch(`${baseUrl}/digital_partners/projects/${uuid}`, options)
      .then(response => response.json())
      .then(response => {
        navigate("/parceiro-digital/meus-projetos");
      })
      .catch(err => console.error(err));
  };
  

  return (
    <div style={{ padding: '16px 48px', backgroundColor: '#fafafa' }}>
      <h1>Editar Projeto</h1>
      {data ? (
        <Form layout="vertical" form={form} onFinish={onFinish}>
        <Form.Item name="title" label="Título">
          <Input type="text" value={data.title} />
        </Form.Item>
        <Form.Item name="description" label="Descrição">
          <Input type="text" value={data.description} />
        </Form.Item>
        <Form.Item name="ods" label="ODS">
          <Checkbox.Group options={options} />
        </Form.Item>
        {/*}
        <Form.Item name="image" label="Banner">
          {data.image && (
            <>
              <Image
                src={`${baseUrl}/uploads/${data.image}`}
                alt="Imagem de apresentação"
                width={200}
                style={{
                  padding: '9px',
                  border: '1px solid #ccc',
                  borderRadius: '10px'
                }}
              /><br/>
            </>
          )}
          <Upload {...props}>
            <Button icon={<UploadOutlined />} type="default">Upload</Button>
          </Upload>
        </Form.Item>
        */}
        <Form.Item name="mainPictureFilename" label="Imagem de apresentação">
          {data.mainPictureFilename && (
            <>
              <Image
                src={`${baseUrl}/uploads/${data.mainPictureFilename}`}
                alt="Imagem de apresentação"
                width={200}
                style={{
                  padding: '9px',
                  border: '1px solid #ccc',
                  borderRadius: '10px'
                }}
              /><br/>
            </>
          )}
          <Upload {...props}>
            <Button icon={<UploadOutlined />} type="default">Upload</Button>
          </Upload>
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">Salvar</Button>
        </Form.Item>
      </Form>
      ) : (<>Carregando</>)}
      
    </div>
  );
};

export default EditarProjeto;