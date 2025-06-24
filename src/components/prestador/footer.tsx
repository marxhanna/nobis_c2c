import React, { useEffect, useState } from 'react';
import home from '../../components/assets/icons/home.png';
import chat from '../../components/assets/icons/chat.png';
import config from '../../components/assets/icons/configuracoes.png';
import broadcast from '../../components/assets/icons/broadcast.png';
import { Popover } from 'antd';
import { Link } from 'react-router-dom';
import { HistoryOutlined } from '@ant-design/icons';

const Sidebar = () => (
  <div className='sidebar'>
    <div className='icons'>
      <Link to='/inicio'><img src={home} />Inicio</Link>
      <Link to='/comunicados'><img src={broadcast} />Comunicados</Link>
      <Link to='/chats'><img src={chat} />Chats</Link>
      <Link to='/historico'><HistoryOutlined style={{ color: "black", fontSize: "21px" }} />Histórico</Link>
      <Link to='/configuracoes'><img src={config} />Configurações</Link>
    </div>
  </div>
);

const Footer = () => (
  <div className='footer'>
    <div className='icons'>
      <Popover content={"Página Inicial"}><Link to='/inicio'><img src={home} /></Link></Popover>
      <Popover content={"Projetos"}><Link to='/learning'><img src={broadcast} /></Link></Popover>
      <Popover content={"Chats de serviços"}><Link to='/chats'><img src={chat} /></Link></Popover>
      <Popover content={"Histórico de serviços"}><Link to='/historico' style={{ color: "black", fontSize: "21px" }}><HistoryOutlined /></Link></Popover>
      <Popover content={"Configurações"}><Link to='/configuracoes'><img src={config} /></Link></Popover>
    </div>
  </div>
)



const ResponsiveFooter: React.FC = () => {
  /*
  const [isMobile, setIsMobile] = useState<boolean>(false);

  const handleResize = () => {
    setIsMobile(window.matchMedia("(max-width: 1224px)").matches);
  };

  useEffect(() => {
    // Check on mount
    handleResize();

    // Add event listener to update on window resize
    window.addEventListener('resize', handleResize);

    // Clean up the event listener on unmount
    return () => window.removeEventListener('resize', handleResize);
  }, []);
*/
  return (
    <>
      <>
        {true ? <Footer /> : <Sidebar />}
      </>
    </>
  )
};

export default ResponsiveFooter;