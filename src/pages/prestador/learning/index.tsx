import React, { useEffect } from 'react';
import { Breadcrumb, ConfigProvider, Layout, Menu, Popover } from 'antd';
import styled from 'styled-components';
//import Footer from '../../../components/prestador/footer';
import logo from '../../../components/assets/logos/nobis_horizontal_branca.png';
import { Outlet, redirect, useLocation, useNavigate } from 'react-router-dom';
import baseUrl from '../../../components/assets/schemas/baseUrl';
import { Link } from 'react-router-dom';
import home from '../../../components/assets/icons/home.png';
import chat from '../../../components/assets/icons/chat.png';
import config from '../../../components/assets/icons/configuracoes.png';
import broadcast from '../../../components/assets/icons/broadcast.png';
import { HistoryOutlined } from '@ant-design/icons';

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
  const token = localStorage.getItem('authToken')

  useEffect(() => {
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`
      }
    };

    fetch(baseUrl + '/learning', options)
      .then(response => response.json())
      .then(response => {
        console.log(response.digitalPartner.profilePicture)
        setImage(response.digitalPartner.profilePicture)
      })
      .catch(err => console.error(err));
  }, [])
  const navigate = useNavigate();

  const items = [{
    key: '/learning',
    label: 'Learning',
  }, {
    key: 'learning/comunicados',
    label: 'Mensagens',
  }].map((e) => ({ ...e, onClick: ({ key }) => navigate(key) }))

  const location = useLocation()

  return (
    <>
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
        <Footer style={{ backgroundColor: 'white', padding: "2% 0.5% 3.5% 0.5%", bottom: "0", position: "fixed", height: "50px", width: "100vw", boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)" }}>
          <div className='icons'>
            <Popover content={"Página Inicial"}><Link to='/inicio'><img src={home} /></Link></Popover>
            <Popover content={"Projetos"}><Link to='/learning'><img src={broadcast} /></Link></Popover>
            <Popover content={"Chats de serviços"}><Link to='/chats'><img src={chat} /></Link></Popover>
            <Popover content={"Histórico de serviços"}><Link to='/historico' style={{ color: "black", fontSize: "21px" }}><HistoryOutlined /></Link></Popover>
            <Popover content={"Configurações"}><Link to='/configuracoes'><img src={config} /></Link></Popover>
          </div>
        </Footer>
      </Layout>
    </ConfigProvider>
    
    </>
  );
};

export default Dashboard;