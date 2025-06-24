import React, { useEffect } from 'react';
import { Breadcrumb, ConfigProvider, Layout, Menu, Statistic, theme } from 'antd';
import styled from 'styled-components';
import logo from '../../../components/assets/logos/nobis_horizontal_branca.png';
import { Outlet, redirect, useLocation, useNavigate } from 'react-router-dom';
import baseUrl from '../../../components/assets/schemas/baseUrl';

const { Header, Content, Footer } = Layout;

const ImageContainer = styled.div`
  min-width: 120px;
  height: 39px;
  color: white;
  cursor: pointer;
  font-size: 14px;
  display: flex;
  

  img {
    margin-right: 5px;
  }
`;
const Dashboard: React.FC = () => {

  const [image, setImage] = React.useState(null)
  const token = localStorage.getItem('digitalPartnerToken')

  useEffect(() => {
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`
      }
    };

    fetch(baseUrl + '/digital_partners/create', options)
      .then(response => response.json())
      .then(response => {
        console.log(response.digitalPartner.profilePicture)
        setImage(response.digitalPartner.profilePicture)
      })
      .catch(err => console.error(err));
  }, [])
  const navigate = useNavigate();

  const items = [{
    key: '/parceiro-digital/',
    label: 'Dashboard',
  }, {
    key: 2,
    label: 'Learning',
    children: [{
      key: '/parceiro-digital/learning/videos',
      label: 'Videos',
    }, {
      key: '/parceiro-digital/learning/playlists',
      label: 'Trilhas de Aprendizado',
    }, {
      key: '/parceiro-digital/learning/documentos/',
      label: 'Documentos',
    }]
  }, {
    key: 3,
    label: 'Mensagens',
    children: [{
      key: '/parceiro-digital/mensageria/todas',
      label: 'Mensagens Enviadas',
    }, {
      key: '/parceiro-digital/mensageria',
      label: 'Enviar Mensagem',
    }]
  }, {
    key: 4,
    label: 'Projetos',
    children: [{
      key: '/parceiro-digital/criar-projeto',
      label: 'Criar Projeto',
    }, {
      key: '/parceiro-digital/meus-projetos',
      label: 'Meus Projetos',
    }]
  }, {
    key: '/parceiro-digital/transparencia',
    label: 'Transparência',
  }, {
    key: '/parceiro-digital/logout',
    label: 'Sair',
  }].map((e) => ({ ...e, onClick: ({ key }) => navigate(key) }))

  const location = useLocation()

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#722ed1',
        },
      }}
    >
      <Layout>
        <Header
          style={{
            position: 'sticky',
            top: 0,
            zIndex: 1,
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            backgroundColor: '#0e0029'
          }}
        >
          <ImageContainer>
            {image && (<img src={`${baseUrl}/uploads/${image}`} style={{ height: '100%' }} />)}
            <img src={logo} style={{ height: '100%' }} />
          </ImageContainer>
          <Menu
            mode="horizontal"
            defaultSelectedKeys={[location.pathname]}
            items={items}
            theme='dark'
            style={{ flex: 1, minWidth: 0, backgroundColor: '#0e0029' }}
          />
        </Header>
        <Content style={{ padding: '0 48px' }}>
          <Breadcrumb style={{ margin: '16px 0' }}>
            <Breadcrumb.Item>{items.find((item) => (item.key === location.pathname) || item.children?.find(child => child.key === location.pathname)?.label)?.label}</Breadcrumb.Item>
          </Breadcrumb>
          <Outlet />
        </Content>
        <Footer style={{ textAlign: 'center' }}>
          Plataforma Nobis {new Date().getFullYear()}
        </Footer>
      </Layout>
    </ConfigProvider>
  );
};

export default Dashboard;