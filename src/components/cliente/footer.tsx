import React, { useEffect, useState } from 'react';
import home from '../../components/assets/icons/home.png';
import busca from '../../components/assets/icons/busca.png';
import chat from '../../components/assets/icons/chat.png';
import historico from '../../components/assets/icons/historico.png';
import config from '../../components/assets/icons/configuracoes.png';
import { Link } from 'react-router-dom';
import { Popover } from 'antd';

const Footer = () => (
  <div className='footer'>
    <div className='icons' style={{ display: 'flex', justifyContent: 'space-around' }}>
      <div style={{ textAlign: 'center' }}>
        <Link to='/inicio'><img src={home} /></Link>
        <p>Início</p>
      </div>

      <div style={{ textAlign: 'center' }}>
        <Link to='/busca'><img src={busca} /></Link>
        <p>Serviços</p>
      </div>

      <div style={{ textAlign: 'center' }}>
        <Link to='/chats'><img src={chat} /></Link>
        <p>Chats</p>
      </div>

      <div style={{ textAlign: 'center' }}>
        <Link to='/historico'><img src={historico} /></Link>
        <p>Histórico</p>
      </div>

      <div style={{ textAlign: 'center' }}>
        <Link to='/configuracoes'><img src={config} /></Link>
        <p>Configurações</p>
      </div>
    </div>
  </div>
)

const Sidebar = () => (
  <div className='sidebar'>
    <div className='icons'>
      <Link to='/inicio'><img src={home} />Inicio</Link>
      <Link to='/busca'><img src={busca} />Buscar</Link>
      <Link to='/chats'><img src={chat} />Chats</Link>
      <Link to='/historico'><img src={historico} />Histórico</Link>
      <Link to='/configuracoes'><img src={config} />Configurações</Link>
    </div>
  </div>
)

const App: React.FC = () => {
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

export default App;