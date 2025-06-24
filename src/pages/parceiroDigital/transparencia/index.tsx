import { 
    FileOutlined, 
    PlusOutlined 
  } from "@ant-design/icons";
  import { Button, theme, Table, TableColumnsType, Tag, Collapse } from "antd";
  import { useEffect, useState } from "react";
  import { Link } from "react-router-dom";
  import styled from "styled-components";
import baseUrl from "../../../components/assets/schemas/baseUrl";

const { Panel } = Collapse;


  
  const Header = styled.div`
    width: 100%;
    display: flex;
    align-items: center;
    margin: 10px 0;
  
    h1 {
      margin: 0;
    }
  
    a {
      margin-left: auto;
      @media (max-width: 768px) {
        display: none;
      }
    }
  `;
  
  const ListDocuments = () => {
    const [dataSource, setDataSource] = useState([]);

    const token = localStorage.getItem("digitalPartnerToken");

    useEffect(() => {

      const options = {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`
        }
      };

      fetch(`${baseUrl}/digital_partners/transparency`, options)
        .then(response => response.json())
        .then(response => setDataSource(response))
        .catch(err => console.error(err));
    }, [])

    const {
      token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();

    const columns: TableColumnsType<any> = [
      {
        title: 'Descrição',
        dataIndex: 'description',
        key: 'description',
        responsive: ['lg'],
      },
      {
        title: 'Descrição',
        dataIndex: 'description',
        key: 'description_mobile',
        responsive: ['xs'],
        render: (_, record) => (
          <div>
            {record.description} <br/>
            {record.projects.map((project: any) => (
              <Tag key={project.id}>{project.title}</Tag>
            ))}
            <p>Postado em: {new Date(record.createdAt).toLocaleString()}</p>
          </div>
        )
      },
      {
        title: 'Categoria',
        dataIndex: 'category',
        key: 'category',
        responsive: ['md'],
      },
      {
        title: 'Postado em',
        dataIndex: 'createdAt',
        key: 'createdAt',
        responsive: ['md'],
        render: (_, record) => (
          <div>
            {new Date(record.createdAt).toLocaleString()}
          </div>
        )
      },
      {
        title: 'Projetos',
        dataIndex: 'projects',
        key: 'projects',
        responsive: ['md'],
        render: (_, record) => (
          <div>
            {record.projects.map((project: any) => (
              <Tag key={project.id}>{project.title}</Tag>
            ))}
          </div>
        ),
      },
      {
        title: 'Arquivos',
        dataIndex: 'uuid',
        key: 'files',
        render: (_, record) => (
          <>
          <Collapse>
            <Panel header="Arquivos"  key="1">
              {record.files.map((file: { id: number; filename: string; originalFilename: string }) => (
                <div key={file.id}>
                  <a href={`${baseUrl}/uploads/${file.filename}`} download={file.originalFilename} target="_blank" rel="noopener noreferrer">
                    <FileOutlined /> {file.originalFilename}
                  </a>
                </div>
              ))}
          </Panel>
        </Collapse>
        </>
        ),
      },
    ];
  
    return (
      <>
        <div
          style={{
            padding: 24,
            minHeight: "83vh",
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
            display: "flex",
            flexWrap: "wrap",
            flexDirection: "column",
          }}
        >
            <Header>
              <h1>Documentos de Transparência de Projeto</h1>
              <Link to="enviar-documentos">
                <Button type="primary" icon={<PlusOutlined />}>
                    Adicionar arquivo
                </Button>
              </Link>
            </Header>
            <Table  dataSource={dataSource} columns={columns} />
        </div>
      </>
    );
  };
  
  export default ListDocuments;