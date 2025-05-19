'use client'

import {
  PlusCircleIcon,
  PlusIcon,
  DocumentPlusIcon,
  DocumentMinusIcon,
  PencilSquareIcon,
  MagnifyingGlassIcon,
  PhotoIcon,
  XCircleIcon
} from '@heroicons/react/24/outline'
import { useEffect, useState, Suspense } from 'react'

import Form from 'next/form'
import ProductoList from '@/interface/interface'
import axios from 'axios'


const uri = "https://shopping-py.onrender.com"
// const uri = "http://localhost:8000"
const urlPro = `${uri}/api/product`
const urlProUpdate = `${uri}/api/product/update`
const urlCat = `${uri}/api/categoria`
const urlUnd = `${uri}/api/und`
const urlUndCont = `${uri}/api/und_cont`

// const apiDataProd = fetchData(urlPro);
export default function Productos() {

  // const producto = apiDataProd.read();

  const [producto, setProducto] = useState<ProductoList[]|null>(null);

  const [typeModal, setTypeModal] = useState<string>('');
  const [formPopup, setFormPopup] = useState(false);
  const [formData, setFormData] = useState({
          id: '',
          barcode: '',
          descripcion: '',
          informacion: '',
          imagen: '',
          moneda: '',
          valor_venta: '',
          impuesto: '',
          precio_venta: '',
          incremento: '',
          estado: '',
  });

  const [unidad, setUnidad] = useState([]);
  const [selectedUnidad, setSelectedUnidad] = useState<string>("");
  const [unidadContenido, setUnidadContenido] = useState([]);
  const [selectedUnidadContenido, setSelectedUnidadContenido] = useState<string>("");

  const [dataCategoria, setDataCategoria] = useState([]);
  const [categoria, setCategoria] = useState([]);
  const [selectedCategoria, setSelectedCategoria] = useState<string>("");
  const [subcategoria, setSubcategoria] = useState([]);
  const [selectedSubcategoria, setSelectedSubcategoria] = useState<string>("");

  const [image, setImage] = useState<string>('');

  useEffect(() => {
    // console.log("🟢 Valor actualizado:", valorVenta);
  }, [formData]); 

    useEffect(() => {
    // console.log("🟢 Valor actualizado:", valorVenta);
  }, [selectedCategoria, selectedSubcategoria, selectedUnidad,selectedUnidadContenido]); 

  useEffect(()=>{
    getPro();
    getCat();
    getUnd();
  },[])

  const getPro= async()=>{
    try {
      const response = await axios.get(urlPro);
      const sortedProducts = response.data.sort((a:any, b:any) => b.id - a.id); 
      setProducto(sortedProducts)
    } catch (error:any) {
      console.error("❌ Error en la solicitud:", error ? error.response.data : error.message);
    }
  }

  const postPro= async(data:any)=>{
    try {
      const response = await axios.post(urlPro, data);
      if(response.data){
        if(response.data.message){
          getPro();
          cancelar();
        }
        if(response.data.error){
          console.log(response.data.error)
        }
      }
    } catch (error:any) {
      console.error("❌ Error en la solicitud:", error ? error.response.data : error.message);
    }
  }

  const putPro= async(update:any,id:number)=>{
    try {
      const response = await axios.put(`${urlProUpdate}/${id}`, update);
      console.log(response)
      if(response.data.message=="Producto actualizado correctamente"){
        getPro();
        cancelar()
      } else {
        console.log(response.data.error)
      }
    } catch (error:any) {
      console.error("❌ Error en la solicitud:", error ? error.response.data : error.message);
    }
  }

  const getCat= async()=>{
    try {
      const response = await axios.get(urlCat);
      const sortedCate = response.data.filter((i:any)=>i.indetity==='C').sort((a:any, b:any) => b.id - a.id);  
      setDataCategoria(response.data)
      setCategoria(sortedCate)
    } catch (error:any) {
      console.error("❌ Error en la solicitud:", error ? error.response.data : error.message);
    }
  }

  const getSubCat= async(id:number)=>{
    try {
      const sortedSubCate = dataCategoria.filter((i:any)=>i.indetity==='S' && i.id_categoria===id).sort((a:any, b:any) => b.id - a.id);
      setSubcategoria(sortedSubCate);
    } catch (error:any) {
      console.error("❌ Error en la solicitud:", error ? error.response.data : error.message);
    }
  }

  const getUnd= async()=>{
    try {
      const response = await axios.get(urlUnd);
      const sortedUnd = response.data.sort((a:any, b:any) => b.id - a.id); 
      setUnidad(sortedUnd)
    } catch (error:any) {
      console.error("❌ Error en la solicitud:", error ? error.response.data : error.message);
    }
  }
  const getUndCont= async(id?:number)=>{
    try {
      const response = await axios.get(urlUndCont);
      const sortedUndCont = response.data.filter((i:any)=>i.id_unidad===id).sort((a:any, b:any) => b.id - a.id); 
      setUnidadContenido(sortedUndCont)
    } catch (error:any) {
      console.error("❌ Error en la solicitud:", error ? error.response.data : error.message);
    }
  }

  const pressSelectedCategoria = (value:string) => {
    setSelectedCategoria(value);
    if(value){ getSubCat(parseInt(value)) }
    else { setSubcategoria([]) }
  }

  const pressSelectedUnidad = (value:string) => {
    setSelectedUnidad(value);
    if(value){ getUndCont(parseInt(value)) }
    else{ setUnidadContenido([]) }
  }

  const handleImageChange = async (event:any) => {
      const file = event.target.files[0];
      if (file) { 
        // setImage(URL.createObjectURL(file));
        const base64 = await convertFileToBase64(file)
        setImage(base64);
        console.log(base64)
      }
  };
  const handleRemoveImage = () => { setImage(''); };

  const convertFileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);  // ✅ Convertir a Base64
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  };

    const handleSubmit = async (event:any) => {
        event.preventDefault(); // 🚨 Evita la redirección
        const _formData = new FormData(event.target);
        const values = Object.fromEntries(_formData.entries());
        const base64 = await convertFileToBase64(values.imagen as File);
        const data = {
          barcode: values.codigo,
          descripcion: values.desc,
          informacion: values.informe,
          imagen: base64,
          moneda: 'PEN',
          valor_venta: parseFloat(parseFloat(values.valor_venta as string).toFixed(2)),
          impuesto: parseFloat((parseFloat(values.valor_venta as string)*0.18).toFixed(2)),
          precio_venta: parseFloat((parseFloat(values.valor_venta as string)*1.18).toFixed(2)),
          incremento: parseFloat(0.00.toFixed(2)),
          estado: formData.estado===''?"A":formData.estado,
          id_unidad: parseFloat(values.id_unidad as string),
          id_unidad_contenido: parseFloat(values.id_unidad_contenido as string),
          id_categoria: parseFloat(values.id_categoria as string),
          id_subcategoria: parseFloat(values.id_subcategoria as string),
        }
        if(typeModal==='add'){
          postPro(data);
        } 
        if(typeModal ==='edit'){
          putPro(data,parseInt(formData.id))
        } 
    };

    const cancelar = () => {
      const data = {
          id: '',
          barcode: '',
          descripcion: '',
          informacion: '',
          imagen: '',
          moneda: '',
          valor_venta: '',
          impuesto: '',
          precio_venta: '',
          incremento: '',
          estado: '',
      }
      setFormPopup(false);
      setFormData(data);
      setSelectedUnidad('');
      setSelectedUnidadContenido('');
      setSelectedCategoria('');
      setSelectedSubcategoria('');
      setSubcategoria([]);
      setUnidadContenido([]);
    };

    const editar = async (event:any) => {
        setSelectedCategoria(event.id_categoria)
        setSelectedUnidad(event.id_unidad)
        await getSubCat(parseInt(event.id_categoria));
        await getUndCont(parseInt(event.id_unidad));
        setSelectedSubcategoria(event.id_subcategoria);
        setSelectedUnidadContenido(event.id_unidad_contenido);
        const base64WithPrefix = `data:image/jpeg;base64,${event.imagen}`;
        setImage(base64WithPrefix);
        setFormData((prevState)=>({
          ...prevState, 
          id:event.id,
          barcode:event.barcode,
          descripcion:event.descripcion,
          informacion:event.informacion,
          estado:event.estado,
          valor_venta:parseFloat(event.valor_venta).toFixed(2),
          impuesto:parseFloat(event.impuesto).toFixed(2),
          precio_venta:parseFloat(event.precio_venta).toFixed(2),
          incremento:parseFloat(event.incremento).toFixed(2),
        }))
        setTypeModal('edit');
        setFormPopup(true);
    };
    const baja = async (data:any,id:any) => {
      const update = { estado:data==='A'?'I':'A' }
      putPro(update,id);
    };

    const [selectedProducts, setSelectedProducts] = useState<any>([]);
        // Maneja selección de filas
    const handleSelect = (id:string) => {
        setSelectedProducts((prev:any) =>
            prev.includes(id) ? prev.filter((item:any) => item !== id) : [...prev, id]
        );
    };

  // const [valorVenta, setValorVenta] = useState<string>("");

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    if (/^\d{1,9}(\.\d{0,2})?$/.test(value)|| value === "") { setFormData((prevState)=>({...prevState, valor_venta:value})) }
  };

  const add = () => {
    setFormPopup(true);
    setTypeModal('add');
  }
  return (
    <div className="bg-gray-50">

        <h1 className=''>Productos</h1>
        <div className="w-12 h-12 my-4">
          <button className='cursor-pointer' onClick={()=> add()}>
            <DocumentPlusIcon className="w-12 h-12 text-gray-500"/>
          </button>
        </div>
        <div className='pb-4 relative w-full'>
          <input
            type="text"
            name='buscar'
            className="w-full p-2 pl-10 border rounded"
            placeholder="Buscar"
            required />
            <MagnifyingGlassIcon className="absolute left-3 top-2 w-5 h-5 text-gray-500"/>
        </div>

          <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-300">
                  <thead>
                      <tr className="bg-gray-200">
                        <th className="border border-gray-300 px-4 py-2 text-left">Seleccionar</th>
                        <th className="border border-gray-300 px-4 py-2 text-left">Codigo</th>
                        <th className="border border-gray-300 px-4 py-2 text-left">Descripcion</th>
                        <th className="border border-gray-300 px-4 py-2 text-left">Unidad de Venta</th>
                        <th className="border border-gray-300 px-4 py-2 text-left">Contenido Unidad de Venta</th>
                        <th className="border border-gray-300 px-4 py-2 text-left">Valor de Venta</th>
                        <th className="border border-gray-300 px-4 py-2 text-left">Tasa de impuesto</th>
                        <th className="border border-gray-300 px-4 py-2 text-left">Precio Venta</th>
                        <th className="border border-gray-300 px-4 py-2 text-left">Estado</th>
                        <th className="border border-gray-300 px-4 py-2 text-left">Accion</th>
                      </tr>
                  </thead>
                  <tbody>
                    {
                      producto?(producto.map((i:ProductoList, index:number)=>{
                        return(
                          <tr key={index}>
                            <td className="border border-gray-300 px-4 py-2">
                                <input 
                                    type="checkbox" 
                                    checked={selectedProducts.includes(i.id)}
                                    onChange={() => handleSelect(i.id)}
                                />
                            </td>
                            <td className={`border border-gray-300 px-4 py-2 ${i.estado=='I'?"text-red-500":"text-black"}`}>{i.barcode}</td>
                            <td className={`border border-gray-300 px-4 py-2 ${i.estado=='I'?"text-red-500":"text-black"}`}>{i.descripcion}</td>
                            <td className={`border border-gray-300 px-4 py-2 ${i.estado=='I'?"text-red-500":"text-black"}`}>{i.id_unidad}</td>
                            <td className={`border border-gray-300 px-4 py-2 ${i.estado=='I'?"text-red-500":"text-black"}`}>{i.id_unidad_contenido}</td>
                            <td className={`border border-gray-300 px-4 py-2 ${i.estado=='I'?"text-red-500":"text-black"}`}>{i.valor_venta}</td>
                            <td className={`border border-gray-300 px-4 py-2 ${i.estado=='I'?"text-red-500":"text-black"}`}>{i.impuesto}</td>
                            <td className={`border border-gray-300 px-4 py-2 ${i.estado=='I'?"text-red-500":"text-black"}`}>{i.precio_venta}</td>
                            <td className={`border border-gray-300 px-4 py-2 ${i.estado=='I'?"text-red-500":"text-black"}`}>{i.estado}</td>
                            <td className="border border-gray-300 px-4 py-2">
                              <div className='flex flex-row justify-around'>
                                  <div className="w-6 h-6 cursor-pointer cursor-pointer" onClick={()=>editar(i)}>
                                    <PencilSquareIcon className="w-6 h-6 text-green-500"/>
                                  </div>
                                  <div className="w-6 h-6 cursor-pointer cursor-pointer" onClick={()=>baja(i.estado, i.id)}>
                                    <DocumentMinusIcon className="w-6 h-6 text-red-500"/>
                                  </div>
                              </div>
                            </td>
                          </tr>
                        )
                      })):(<tr><td>Cargando productos...</td></tr>)
                    }
                  </tbody>
              </table>
          </div>

      {/* Modal */}
      {formPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 transition-opacity">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96 sm:w-120 md:w-150 lg:w-240 max-h-screen overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">Registrar producto</h2>
            <Form action="" onSubmit={handleSubmit}>
              <div className='grid md:grid-cols-2'>
                <label className="block mb-2 md:pr-2">
                  Codigo:
                  <input
                    type="text"
                    name='codigo'
                    className="w-full p-2 border rounded"
                    placeholder=""
                    value={formData.barcode}
                    onChange={(e) => setFormData({ ...formData, barcode: e.target.value })}
                    required
                  />
                </label>
                <label className="block mb-2">
                  Descripcion del producto:
                  <input
                    type="text"
                    name='desc'
                    className="w-full p-2 border rounded"
                    placeholder=""
                    value={formData.descripcion}
                    onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                    required
                  />
                </label>
              </div>
              <div className='grid md:grid-cols-2'>
                <label className="block mb-2 md:pr-2">
                  Categoria: 
                  <select name='id_categoria' className="w-full p-2 border rounded h-[42px]" value={selectedCategoria} onChange={(e) => pressSelectedCategoria(e.target.value)} required>
                      <option value="">-- Elige una opción --</option>
                      { categoria && Array.isArray(categoria) &&  categoria.map((cat:any, index) => (
                          <option className='w-full' key={index} value={cat.id}>
                              {cat.descripcion}
                          </option>
                      ))}
                  </select>
                </label>
                <label className="block mb-2">
                  Sub Categoria: 
                  <select name='id_subcategoria' className="w-full p-2 border rounded h-[42px]"  value={selectedSubcategoria} onChange={(e) => setSelectedSubcategoria(e.target.value)} required>
                      <option value="">-- Elige una opción --</option>
                      { subcategoria && Array.isArray(subcategoria) &&  subcategoria.map((cat:any, index) => (
                          <option className='' key={index} value={cat.id}>
                              {cat.descripcion}
                          </option>
                      ))}
                  </select>
                </label>                
              </div>
              <div className='grid md:grid-cols-2'>
                <label className="block mb-2 md:pr-2">
                  Unidad: 
                  <select name='id_unidad' className="w-full p-2 border rounded h-[42px]" value={selectedUnidad} onChange={(e) => pressSelectedUnidad(e.target.value)} required>
                      <option value="">-- Elige una opción --</option>
                      { unidad && Array.isArray(unidad) &&  unidad.map((und:any, index) => (
                          <option className='' key={index} value={und.id}>
                              {und.code}
                          </option>
                      ))}
                  </select>
                </label>
                <label className="block mb-2">
                  Contenido de la unidad: 
                  <select name='id_unidad_contenido' className="w-full p-2 border rounded h-[42px]" value={selectedUnidadContenido} onChange={(e) => setSelectedUnidadContenido(e.target.value)} required>
                      <option value="">-- Elige una opción --</option>
                      { unidadContenido && Array.isArray(unidadContenido) &&  unidadContenido.map((undC:any, index) => (
                          <option className='' key={index} value={undC.id}>
                              {undC.contenido}
                          </option>
                      ))}
                  </select>
                </label>                
              </div>
              <div className='grid md:grid-cols-2'>
                <label className="block mb-2 md:pr-2">
                  Informacion adicional:
                  <input
                    type="text"
                    name='informe'
                    className="w-full p-2 border rounded"
                    placeholder=""
                    value={formData.informacion}
                    onChange={(e) => setFormData({ ...formData, informacion: e.target.value })}
                    required
                  />
                </label>
                <label className="block mb-2 md:pr-2">
                  Valor de venta:
                  <input
                    type="text"
                    name='valor_venta'
                    className="w-full p-2 border rounded"
                    placeholder="00.00"
                    required
                    value={formData.valor_venta}
                    onChange={(e)=>handleChange(e)}
                  />
                </label>              
              </div>

              <div className="w-full max-w-md mx-auto">
                <label className="block text-gray-700 mb-2">Imagen</label>
                <div className="relative flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6 cursor-pointer hover:bg-gray-100 transition-all">
                    {
                        !image?(
                            <>
                                <PhotoIcon className="w-10 h-10 text-gray-500 mb-2" />
                                <p className="text-sm text-gray-600">Haz clic o arrastra una imagen aquí</p>
                            </>
                        ):(
                            <div className="relative w-full h-48 flex justify-center items-center">
                                <img src={image} alt="Vista previa" className="w-full h-full object-cover rounded-lg  bg-red-100" />
                                <button 
                                    onClick={handleRemoveImage} 
                                    className="absolute top-2 right-2 bg-white p-1 rounded-full shadow-lg hover:bg-red-500 hover:text-white transition z-1"
                                >
                                    <XCircleIcon className="w-6 h-6" />
                                </button>
                            </div>
                        )
                    }
                    <input
                        type="file"
                        name="imagen"
                        accept="image/*"
                        className="absolute inset-0 opacity-0 cursor-pointer"
                        onChange={handleImageChange}
                        required
                    />
                </div>
              </div>

              <div className="flex justify-between mt-4">
                <button
                  type="button"
                  onClick={() => cancelar()}
                  className="px-4 py-2 bg-gray-500 text-white rounded"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-500 text-white rounded"
                >
                  {typeModal==='add'?'Enviar':'Guardar'}
                </button>
              </div>
            </Form>
          </div>
        </div>
      )}

    </div>
  )
}
