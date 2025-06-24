import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { Button, Modal, Space, Table, TableColumnsType } from "antd";
import { Link } from "react-router-dom";
import baseUrl from "../../../components/assets/schemas/baseUrl";
import { useEffect, useState } from "react";

const MeusProjetos = () => {
  const [modal, contextHolder] = Modal.useModal();

  const [dataSource, setDataSource] = useState([]);

  const token = localStorage.getItem("digitalPartnerToken");

  useEffect(() => {
    const options = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    fetch(`${baseUrl}/digital_partners/projects`, options)
      .then((response) => response.json())
      .then((response) => setDataSource(response))
      .catch((err) => console.error(err));
  }, []);

  const handleDelete = (uuid: string) => {
    modal.warning({
      title: 'Deseja realmente excluir o projeto?',
      okText: 'Sim',
      okType: 'danger',
      okCancel: true,
      cancelText: 'Não',
      onOk() {
        console.log('OK', uuid);
        // Make a delete request using our baseUrl
        fetch(`${baseUrl}/projects/${uuid}`, {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
          }
        })
        .then(response => response.json())
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  }

  const columns: TableColumnsType<any> = [{
    title: 'Projeto',
    dataIndex: 'title',
    key: 'title',
  }, {
    title: 'Data de finalização',
    dataIndex: 'endsAt',
    key: 'endsAt',
    render: (_, record) => (<>{new Date(record.endsAt).toLocaleDateString()}</>)
  }, {
    title: 'Membros',
    key: 'users',
    render: (_, record) => (<>{record.users.length}</>)
  }, {
    title: 'Ações',
    key: 'actions',
    render: (_, record) => (
      <Space size="middle">
        <Link to={`/parceiro-digital/meus-projetos/${record.uuid}/editar`}>
          <EditOutlined />
        </Link>
        <Button variant="link" color="danger" onClick={() => handleDelete(record.uuid)}>
          <DeleteOutlined />
        </Button>
      </Space>
    )
  }]

  return (
    <div style={{ padding: '16px 48px', backgroundColor: '#fafafa' }}>
      {contextHolder}
      <h1>Meus Projetos</h1>

      <Table  columns={columns}  dataSource={dataSource}/>
    </div>
  );
};

export default MeusProjetos;