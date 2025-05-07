import './index.css';
import { Store } from './lib/store/store';
import { data } from './lib/data/data';
import { useEffect, useState } from 'react';
import { ActiveArrow, InactiveArrow, } from './assets/svgs.jsx';
import LOGO from './assets/tai_logo.png';

const Header = () => {

  const setHotelInfo = Store(state => state.setHotelInfo);
  const [selectedId, setSelecterId] = useState("000");

  const loadInfo = (id) => {
    setSelecterId(id)
    const hotel = data.filter(i => i.id === id);
    setHotelInfo(hotel)
  }

  useEffect(() => {
    loadInfo(selectedId)
  }, [])


  return (
    <div className='flex items-center text-white bg-[#012134] px-5 md:px-20 justify-between min-h-15 w-screen fixed'>
      <div className='z-10'>
        <img src={LOGO} width={100} alt='logo'/>
      </div>
      <div className='flex gap-2'>
        <span onClick={() => loadInfo("000")} className={`cursor-pointer text-bold hover:text-blue-500 ${selectedId === "000" && "text-blue-500"}`}>Riu Ventura</span>
        <span>|</span>
        <span onClick={() => loadInfo("001")} className={`cursor-pointer text-bold hover:text-blue-500 ${selectedId === "001" && "text-blue-500"}`}>Riu Guanacaste</span>
        <span>|</span>
        <span onClick={() => loadInfo("002")} className={`cursor-pointer text-bold hover:text-blue-500 ${selectedId === "002" && "text-blue-500"}`}>Riu Jalisco</span>
      </div>
    </div>
  )
}

const Resumen = () => {

  const hotelInfo = Store(state => state.hotelInfo);
  const [porcentaje, setPorcentaje] = useState(0);

  useEffect(() => {
    try {
      const calcularPorcentaje = async () => {
        if (hotelInfo) {
          const p = await hotelInfo[0].porcentaje;
          const per = await (p.etapa_1 * p.factor_1 + p.etapa_2 * p.factor_2 + p.etapa_3 * p.factor_3 + p.etapa_4 * p.factor_4)
          setPorcentaje(Math.round(per))
        }
      }

      calcularPorcentaje();
    } catch (err) {
      console.log(err.message)
    }
  }, [hotelInfo])

  if (!hotelInfo) return (
    <div>
      Bienvenidos. Por favor indique un hotel para continuar.
    </div>
  )

  return (
    <div>
      <h1 className='text-2xl mt-15 mb-5 text-center'>SISTEMA DE AUTOMATIZACIÓN</h1>
      <div className='border border-gray-300 rounded-xl p-5 shadow-xl mb-10'>
        <h1 className='text-xl mb-2'>Resumen General del proyecto</h1>
        <ul>
          <li>Nombre del hotel: {hotelInfo && hotelInfo[0].hotel}</li>
          <li>Etapa del proyecto: {hotelInfo && hotelInfo[0].etapa}</li>
          <li>Porcentaje de avance: {porcentaje + "%"}</li>
        </ul>
      </div>
    </div>
  )
}

const Recursos = () => {

  const hotelInfo = Store(state => state.hotelInfo);
  const [active, setActive] = useState(null);

  const handleRecursos = (id) => {
    if (active === id) {
      setActive(null)
      return
    }

    setActive(id)
  }

  const handleContent = (e, url) => {
    e.stopPropagation()
    window.open(url, "_blank")
  }

  if (!hotelInfo) return (
    <div className='mt-10'>
      Bienvenidos. Por favor indique un hotel para continuar.
    </div>
  )

  return (
    <div>
      <h1 className='text-xl mb-2'>Acceso a recursos</h1>
      <ul>
        {
          hotelInfo && hotelInfo[0].recursos.map((rec, key) => (
            <li key={key} onClick={() => handleRecursos(key)}
              className={`flex flex-col cursor-pointer ${active === key && 'border border-gray-200'}`}>
              <div className={`flex ${active === key && 'bg-gray-200'}`}>
                <span>
                  {
                    active === key ?
                      <ActiveArrow /> :
                      <InactiveArrow />
                  }
                </span>
                {rec.text}
              </div>
              <div className={`px-6 ${active !== key && 'hidden'}`}>
                <table className='w-full only-desktop'>
                  <tbody>
                    {
                      rec.content.map((con, key) => (
                        <tr onClick={e => handleContent(e, con.url)} className=' my-5 hover:bg-gray-100 border-b-1 border-gray-200' key={key}>
                          <td>{con.id}</td>
                          <td>{con.description}</td>
                          <td className='py-2 text-center'><span className={`rounded-2xl text-white text-bold px-2 ${con.status === "PENDING" ? "bg-red-500" :
                            con.status === "DOING" ? "bg-yellow-500" :
                              "bg-green-500"}
                        `}>{
                              con.status === "PENDING" ? "PENDIENTE" :
                                con.status === "DOING" ? "EN PROCESO" :
                                  "LISTO"
                            }</span></td>
                          <td className='text-center'>Rev. {con.rev}</td>
                          <td className='text-center'>{con.date}</td>
                        </tr>
                      ))
                    }
                  </tbody>
                </table>
                <div className='w-full only-mobile'>
                  {
                    rec.content.map((con, key) => (
                      <div onClick={e => handleContent(e, con.url)} className='flex justify-between my-5 hover:bg-gray-100 border-b-1 border-gray-200' key={key}>
                        <div className='flex flex-col'>
                          <td className='text-bold'>{con.id}</td>
                          <td>{con.description}</td>
                          <td>Rev. {con.rev}</td>
                          <td>{con.date}</td>
                        </div>
                        <div>
                          <div>Estatus:</div>
                          <div className='py-2 text-center'><span className={`rounded-2xl text-white text-bold px-2 ${con.status === "PENDING" ? "bg-red-500" :
                            con.status === "DOING" ? "bg-yellow-500" :
                              "bg-green-500"}
                        `}>{
                              con.status === "PENDING" ? "PENDIENTE" :
                                con.status === "DOING" ? "EN PROCESO" :
                                  "LISTO"
                            }</span></div>
                        </div>

                      </div>
                    ))
                  }
                </div>
              </div>
            </li>
          ))
        }
      </ul>
    </div>
  )
}

const Dashboard = () => {

  return (
    <div className='px-4 md:px-20 mt-10 md:mt-5'>
      <Resumen />
      <Recursos />
    </div>
  )
}

function App() {

  return (
    <div className='flex flex-col h-screen w-screen'>
      <Header />
      <Dashboard />
    </div>
  )
}

export default App
