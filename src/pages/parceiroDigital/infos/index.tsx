import { Divider, Statistic, theme } from "antd";
import { useEffect, useState } from "react";
import L from 'leaflet'
import { MapContainer, Marker, TileLayer, Popup } from 'react-leaflet';
import { Pie, Bar } from '@ant-design/plots';
import { BarChartOutlined, CalendarOutlined, CarryOutOutlined, LikeOutlined, ShopFilled, ShopOutlined, StarFilled, StarOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { Button, message, Card } from 'antd';
import { CopyOutlined } from '@ant-design/icons';
import { Line } from "@ant-design/charts";
import ODS from "../../../components/parceiroDigital/ods";

const icon = (filename: string) => new L.Icon({
  iconUrl: `https://brenno-envoriment-node.1pc5en.easypanel.host/uploads/${filename}`,
  iconSize: [45, 45],
  className: 'map_icon'
})

const CopyLinkButton = ({ link }) => {
  const handleCopy = () => {
    navigator.clipboard.writeText(link).then(() => {
      message.success('Link copiado!');
    }).catch(() => {
      message.error('Falha ao copiar o link.');
    });
  };

  return (
    <Button icon={<CopyOutlined />} onClick={handleCopy} style={{ marginLeft: "1%" }}>
      Copiar link
    </Button>
  );
};

const Infos = () => {

  const [dashboard, setDashboard] = useState(null);

  const dashboardFields = ['age', 'payments', 'totalServicesStatus', 'genre', 'deficiency', 'lookingForJob', 'nationatity', 'scholarship', 'familySize']

  const dashboardFieldsTranslated = [
    { "name": "Faixa Etária", "ods": [10] },
    { "name": "Valores transacionados", "ods": [1, 2, 5, 9, 10, 8] },
    { "name": "Status de serviços", "ods": [1, 4, 7, 8, 11, 12] },
    { "name": "Gênero", "ods": [5, 8, 10] },
    { "name": "PcD", "ods": [3, 10] },
    { "name": "Buscando Emprego", "ods": [8, 10, 17] },
    { "name": "Nacionalidade", "ods": [16] },
    { "name": "Escolaridade", "ods": [4, 8, 10] },
    { "name": "Tamanho das famílias", "ods": [1, 10, 11] }
  ]

  const dashboardFieldsRating = ['rating', 'monthRating']

  const dashboardFieldsTranslatedRating = [
    { name: 'Avaliação de serviços', ods: [8, 10, 11, 12] },
    { name: 'Avaliação de serviços por mês', ods: [8, 10, 11, 12] }
  ]

  const dashboardFieldsFormalization = ['document', 'documentPerMonth']

  const dashboardFieldsTranslatedFormalization = [
    { name: 'Formalização', ods: [8, 9, 10, 11] },
    { name: 'Formalização por Mês', ods: [8, 9, 10, 11] }
  ]

  const token = localStorage.getItem('digitalPartnerToken')
  useEffect(() => {
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`
      }
    };

    fetch('https://brenno-envoriment-node.1pc5en.easypanel.host/digital_partners/create', options)
      .then(response => response.json())
      .then(response => {
        console.log(response)
        setDashboard(response)
      })
      .catch(err => console.error(err));
  }, [])

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  function formatPayments(payments: Record<string, number>) {
    const validKeys = Object.keys(payments).filter(key => key !== "null");
    const totalValue = validKeys.reduce((sum, key) => sum + payments[key], 0);

    return validKeys.map(key => ({
      type: key,
      value: Math.round(((payments[key] / totalValue) * 100) * 1e0) / 1e0
    }));
  }

  const totalValue = () => {
    if (dashboard) {
      const paymentKeys = Object.keys(dashboard.payments);
      const totalValue = paymentKeys.reduce((sum, key) => sum + dashboard.payments[key], 0)

      return totalValue
    }
  }

  const lineConfig = {
    xField: 'date',
    yField: 'price',
    point: {
      shapeField: 'square',
      sizeField: 4,
    },
    interaction: {
      tooltip: {
        marker: false,
      },
    },
    style: {
      lineWidth: 2,
    },
    slider: {
      x: true,
    },
  };

  return (
    <div
      style={{
        padding: 24,
        minHeight: 380,
        background: colorBgContainer,
        borderRadius: borderRadiusLG,
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-evenly'
      }}
    >
      {dashboard && (
        <>
          <Card>
            <div style={{ display: "flex", alignItems: "center" }}>
              <p style={{ fontSize: "15px" }}><b>Cadastro de afiliado:</b> <Link className="digitalPartnerLink" to={`/cadastro/${dashboard.digitalPartner.code}`} target="_blank" rel="noopener noreferrer">https://plataforma.nobisapp.com.br/cadastro/{dashboard.digitalPartner.code}</Link></p>
              <CopyLinkButton link={`https://plataforma.nobisapp.com.br/cadastro/${dashboard.digitalPartner.code}`} />
            </div>
          </Card>
          <div style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            padding: '2%',
            justifyContent: 'space-around'
          }}>
            <Statistic title="Membros associados no dia" value={dashboard.assossiateds} prefix={<CalendarOutlined />} />
            <Statistic title="Membros associados no total" value={dashboard.users.length} prefix={<CarryOutOutlined />} />
            <Statistic title="Total de Serviços efetuados" value={dashboard.totalServices} prefix={<BarChartOutlined />} />

            <Statistic title="Total de Público indireto" value={Object.keys(dashboard.familySize)
              .filter(key => key !== ("Não se aplica" || "0"))
              .map(key => parseInt(key)).reduce((sum, key) => sum + dashboard.familySize[key.toString()], 0)} prefix={<BarChartOutlined />} />
          </div>
          {dashboardFields.map((s, i) => {
            return (
              <div>
                <h1>{dashboardFieldsTranslated[i].name}
                  <div style={{ display: 'flex' }}>
                    {dashboardFieldsTranslated[i].ods.map((ods) => (
                      <ODS number={ods} />
                    ))}
                  </div>
                </h1>
                <Pie {...{

                  width: 350,
                  data: formatPayments(dashboard[s]),
                  angleField: 'value',
                  colorField: 'type',
                  label: {
                    text: 'value',
                    style: {
                      fontWeight: 'b',
                    },
                  },
                  legend: {
                    color: {
                      title: false,
                      position: 'right',
                      rowPadding: 5,
                    },
                  },
                }} />
              </div>)
          })}
          <div style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            padding: '2%',
            justifyContent: 'space-around'
          }}>
            <Statistic title="Media de avaliação" value={((dashboard.rating.price + dashboard.rating.quality + dashboard.rating.punctuality) / 3).toFixed(1)} prefix={<StarOutlined />} />
            <Statistic title="Media de avaliação mensal" value={((dashboard.monthRating.price + dashboard.monthRating.quality + dashboard.monthRating.punctuality) / 3).toFixed(1)} prefix={<StarFilled />} />
          </div>
          {dashboardFieldsRating.map((s, i) => {
            return (
              <div>
                <h1> {dashboardFieldsTranslatedRating[i].name}
                  <div style={{ display: 'flex' }}>
                    {dashboardFieldsTranslatedRating[i].ods.map((ods) => (
                      <ODS number={ods} />
                    ))}
                  </div>
                </h1>

                <Pie {...{
                  width: 300,
                  data: formatPayments(dashboard[s]),
                  angleField: 'value',
                  colorField: 'type',
                  label: {
                    text: 'value',
                    style: {
                      fontWeight: 'b',
                    },
                  },
                  legend: {
                    color: {
                      title: false,
                      position: 'right',
                      rowPadding: 5,
                    },
                  },
                }} />
              </div>)
          })}

          <div style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            padding: '2%',
            justifyContent: 'space-around'
          }}>
            <Statistic title="Formalização" value={dashboard.document.cnpj} prefix={<ShopOutlined />} />
            <Statistic title="Formalização por Mês" value={dashboard.documentPerMonth.cnpj} prefix={<ShopFilled />} />
          </div>
          {dashboardFieldsFormalization.map((s, i) => {
            return (
              <div>
                <h1> {dashboardFieldsTranslatedFormalization[i].name}
                  <div style={{ display: 'flex' }}>
                    {dashboardFieldsTranslatedFormalization[i].ods.map((ods) => (
                      <ODS number={ods} />
                    ))}
                  </div>
                </h1>
                <Pie {...{
                  width: 350,
                  data: formatPayments(dashboard[s]),
                  angleField: 'value',
                  colorField: 'type',
                  label: {
                    text: 'value',
                    style: {
                      fontWeight: 'b',
                    },
                  },
                  legend: {
                    color: {
                      title: false,
                      position: 'right',
                      rowPadding: 5,
                    },
                  },
                }} />
              </div>)
          })}

          <div style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            padding: '2%',
            justifyContent: 'space-around'
          }}>
            <Statistic title="Total valor transacionado" value={`${totalValue()}`} prefix={<b>R$</b>} />

          </div>
          <div style={{
            width: "100%"
          }}>
            <h1>Valores transacionados por Mês</h1>
            <Line {...lineConfig} data={dashboard.services} />
          </div>
          <div style={{
            width: "100%"
          }}>
            <h1>Serviços mais solicitados
              <div style={{ display: "flex" }}>
                <ODS number={8} />
                <ODS number={9} />
                <ODS number={10} />
                <ODS number={11} />
              </div>
            </h1>
            <Bar
              {...{
                data: formatPayments(dashboard.mostSolictedServices),
                xField: 'type',
                yField: 'value',
              }}
            />
          </div>

          <div>
            <h1>Mapa com os prestadores</h1>
            <MapContainer style={{ height: "60vh", width: window.innerWidth >= 600 ? "100em" : "20em" }} center={[-25.4269, -49.2652]} zoom={13}>
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              {dashboard.users.map((usr) => (
                <Marker
                  icon={icon(usr.avatar)}
                  position={[usr.location[0], usr.location[1]]}
                >
                  <Popup>
                    <a target="_blank" href={`/prestador/${usr.uuid}`}><p>{usr.name}</p></a>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>
        </>
      )}

    </div>
  )
}

export default Infos