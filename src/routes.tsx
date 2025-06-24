// src/components/Routes.tsx
import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Login from './pages/login';
import Cadastro from './pages/cadastro';
import Inicio from './pages/';
import Busca from './pages/cliente/busca';
import PerfilPessoalCliente from './pages/cliente/perfil';
import PerfilPessoalPrestador from './pages/prestador/perfil';
import Prestadores from './pages/cliente/listagem-prestadores';
import Chats from './pages/chats';
import Chat from './pages/chat';
import Finalizado from './pages/prestador/finalizar-servico';
import Historico from './pages/historico';
import Configuracoes from './pages/configuracoes';
import Perfil from './pages/cliente/perfil-prestador';
import PerfilCliente from './pages/prestador/perfil-cliente';
import AvaliacaoCliente from './pages/prestador/avaliacao-cliente';
import AvaliacaoServico from './pages/cliente/servico-finalizado';
import ConteudoPDL from './pages/parceiroDigital/meu-conteudo';
import Playlist from './pages/parceiroDigital/criar-playlist';
import PostarVideo from './pages/parceiroDigital/postar-video';
import Forum from './pages/forum';
import ForumPost from './pages/forum/post';
import CriarPost from './pages/forum/criar-post';
import LoginParceiroDigital from './pages/parceiroDigital/login';
import Dashboard from './pages/parceiroDigital/dashboard';
import Infos from './pages/parceiroDigital/infos';
import Mensageria from './pages/parceiroDigital/mensagens';
import LogOut from './pages/parceiroDigital/logout';
import CriarProjeto from './pages/parceiroDigital/criar-projeto';
import useAuthDigitalPartner from './hooks/useAuthDigitalPartner';
import Videos from './pages/parceiroDigital/learning/video';
import NovoVideo from './pages/parceiroDigital/learning/video/novo-video/novo-video';
import EditarVideo from './pages/parceiroDigital/learning/video/editar-video/editar-video';
import CreatePlaylist from './pages/parceiroDigital/learning/playlist';
import Cadastrar from './pages/parceiroDigital/cadastrar';
import Comunicados from './pages/prestador/learning/comunicados';
import MeusVideos from './pages/parceiroDigital/meus-videos';
import Playlists from './pages/parceiroDigital/minhas-playlists';
import Documents from './pages/parceiroDigital/learning/documents';
import ListDocuments from './pages/parceiroDigital/learning/documents/list-documents';
import Transparencia from './pages/parceiroDigital/transparencia';
import EDTransparencia from './pages/parceiroDigital/transparencia/enviar-documento';
import Cartao from './pages/cartao';
import VideosPrestador from './pages/prestador/videos';
import CompraCreditos from './pages/prestador/compra-creditos';
import Notificacoes from './pages/notificacoes';
import GerenciarAssinatura from './pages/prestador/gerenciar-assinatura';
import VideoPlayer from './pages/videos';
import FAQ from './pages/faq';
import ForgotPassword from './pages/forgot-password';
import LearningIndex from './pages/prestador/learning';
import PrestadorVideos from './pages/prestador/learning/videos';
import TransparenciaPrestador from './pages/prestador/transparencia';
import MensageriaTodas from './pages/parceiroDigital/mensageria-todas';
import MeusProjetos from './pages/parceiroDigital/meus-projetos';
import EditarProjeto from './pages/parceiroDigital/editar-projeto';
import RecuperaSenha from './pages/parceiroDigital/recuperar-senha';


const Routes: React.FC = () => {

  const router = createBrowserRouter([
    {
      path: "/",
      element: <Login />,
    },
    {
      path: "/esqueci-senha/:code?",
      element: <ForgotPassword />,
    },
    {
      path: "/inicio",
      element: <Inicio />
    },
    {
      path: "/busca",
      element: <Busca />
    },
    {
      path: "/FAQ",
      element: <FAQ />
    },
    {
      path: "/prestadores",
      element: <Prestadores />
    },
    {
      path: "/historico",
      element: <Historico />
    },
    {
      path: "/compra-creditos",
      element: <CompraCreditos />
    },
    {
      path: "/gerenciar-assinatura",
      element: <GerenciarAssinatura />
    },
    {
      path: "/notificacoes",
      element: <Notificacoes />
    },
    {
      path: "/configuracoes",
      element: <Configuracoes />
    },
    {
      path: "/prestador/videos",
      element: <VideosPrestador />
    },
    {
      path: "/video/:uuid",
      element: <VideoPlayer />
    },
    {
      path: "/chats",
      element: <Chats />
    },
    {
      path: "/chat/:uuid",
      element: <Chat />
    },
    {
      path: "/servico-finalizado/:uuid",
      element: <Finalizado />
    },
    {
      path: "/avaliar-cliente/:uuid",
      element: <AvaliacaoCliente />
    },
    {
      path: "/avaliar-servico/:uuid",
      element: <AvaliacaoServico />
    },
    {
      path: "/prestador/:uuid",
      element: <Perfil />
    },
    {
      path: "/meu-perfil/:uuid",
      element: <PerfilPessoalCliente />
    },
    {
      path: "/perfil-prestador/:uuid",
      element: <PerfilPessoalPrestador />
    },
    {
      path: "/cliente/:uuid",
      element: <PerfilCliente />
    },
    {
      path: "/nobis-learning",
      element: <ConteudoPDL />
    },
    {
      path: "/criar-playlist",
      element: <Playlist />
    },
    {
      path: "/postar-video",
      element: <PostarVideo />
    },
    {
      path: "/login",
      element: <Login />
    },
    {
      path: "/login/:code",
      element: <Login />
    },
    {
      path: "/cadastro",
      element: <Cadastro />
    },
    {
      path: "/cartao",
      element: <Cartao />
    },
    {
      path: "/cadastro/:code",
      element: <Cadastro />
    },
    {
      path: "/forum",
      element: <Forum />
    },
    {
      path: "/post/:uuid",
      element: <ForumPost />
    },
    {
      path: "/criar-post",
      element: <CriarPost />
    },
    {
      path: "/parceiro-digital",
      element: <Dashboard />,
      loader: useAuthDigitalPartner,
      children: [
        {
          path: "",
          element: <Infos />
        },
        {
          path: "mensageria",
          element: <Mensageria />
        },
        {
          path: "mensageria/todas",
          element: <MensageriaTodas />
        },
        {
          path: "transparencia",
          element: <Transparencia />
        },
        {
          path: "transparencia/enviar-documentos",
          element: <EDTransparencia />
        },
        {
          path: "criar-projeto",
          element: <CriarProjeto />
        },
        {
          path: "meus-projetos",
          element: <MeusProjetos />
        },
        {
          path: "meus-projetos/:uuid/editar",
          element: <EditarProjeto />
        },
        {
          path: "logout",
          element: <LogOut />
        },
        {
          path: "learning/videos",
          element: <Videos />
        },
        {
          path: "learning/videos/todos",
          element: <MeusVideos />
        },
        {
          path: "learning/playlists",
          element: <Playlists />
        },
        {
          path: "learning/videos/novo",
          element: <NovoVideo />
        },
        {
          path: "learning/videos/:uuid/editar",
          element: <EditarVideo />
        },
        {
          path: "learning/playlists/novo",
          element: <CreatePlaylist />
        },
        {
          path: "learning/documentos/novo",
          element: <Documents />
        },
        {
          path: "learning/documentos",
          element: <ListDocuments />
        }
      ]
    },
    {
      path: "/learning",
      element: <LearningIndex />,
      //loader: useAuthDigitalPartner,
      children: [
        {
          path: "",
          element: <PrestadorVideos />
        },
        {
          path: "mensageria",
          element: <Mensageria />
        },
        {
          path: "learning/videos/todos",
          element: <MeusVideos />
        },
        {
          path: "learning/playlists",
          element: <Playlists />
        },
        {
          path: "learning/documentos",
          element: <ListDocuments />
        },
        {
          path: "learning/comunicados",
          element: <Comunicados />
        }
      ]
    },
    {
      path: "/parceiro-digital/login",
      element: <LoginParceiroDigital />
    },
    {
      path: "/parceiro-digital/recuperar-senha/:code?",
      element: <RecuperaSenha />
    },
    {
      path: "/parceiro-digital/cadastrar",
      element: <Cadastrar />
    }
  ]);

  return (
    <RouterProvider router={router} />
  );
};

export default Routes;
