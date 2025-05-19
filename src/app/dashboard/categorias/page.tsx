'use client'

import {
  DocumentPlusIcon,
  DocumentMinusIcon,
  PencilSquareIcon,
  MagnifyingGlassIcon,
  PhotoIcon,
  XCircleIcon,
} from '@heroicons/react/24/outline'
import { useEffect, useState } from 'react'
import Form from 'next/form'
import axios from 'axios'

import CategoriaList from '@/interface/interface'


// const uri = "http://localhost:8000"
const uri = "https://shopping-py.onrender.com"
const urlCat = `${uri}/api/categoria`
const urlCatUpdate = `${uri}/api/categoria/update`


export default function Categorias() {

    const [typeModal, setTypeModal] = useState<string>('');
    const [formPopup, setFormPopup] = useState(false);
    const [formData, setFormData] = useState({
        id: '',
        indetity: '',
        descripcion: '',
        imagen: '',
        estado: '',
        id_categoria: '',
  });

    const [identity ] = useState<{code:string,name:string}[]>([{code:'C',name:'Categoria'},{ code:'S', name:'Subcategoria' }]);
    const [selectedIdentity, setSelectedIdentity] = useState<string>("");

    const [dataCategoria, setDataCategoria] = useState<any[]>([]);
    const [categoria, setCategoria] = useState<any>([]);
    const [selectedCategoria, setSelectedCategoria] = useState<string>("");

    const [image, setImage] = useState<string>('');
    useEffect(() => {
        // console.log("🟢 Valor actualizado:", valorVenta);
    }, [formData,selectedIdentity]); 

    useEffect(()=>{
        getCat();
    },[])

    const getCat= async()=>{
        try {
        const response = await axios.get(urlCat);
        const sorted = response.data.sort((a:any, b:any) => b.id - a.id);  
        // const sortedCate = response.data.filter((i:any)=>i.indetity==='C').sort((a:any, b:any) => b.id - a.id);  
        setDataCategoria(sorted)
        // setCategoria(sortedCate)
        } catch (error:any) {
            console.error("❌ Error en la solicitud:", error ? error.response.data : error.message);
        }
    }

    const postCat= async(data:any)=>{
        try {
            const response = await axios.post(urlCat, data);
            if(response.data){
                if(response.data.message){
                    getCat();
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

    const putCate= async(update:any,id:number)=>{
        try {
            const response = await axios.put(`${urlCatUpdate}/${id}`, update);
            if(response.data.message=="Categoria actualizado correctamente"){
                getCat();
                cancelar();
            } else {
                console.log(response.data.error)
            }
        } catch (error:any) {
            console.error("❌ Error en la solicitud:", error ? error.response.data : error.message);
        }
    }
    
    const pressSelectedIdentity = (value:string) => {
        setSelectedIdentity(value);
        if(value=='S'){
            const sortedCate = dataCategoria.filter((i:any)=>i.indetity==='C').sort((a:any, b:any) => b.id - a.id);
            setCategoria(sortedCate)
        }else{
            setCategoria([])
        }
    }

    const handleImageChange = async (event:any) => {
        const file = event.target.files[0];
        if (file) {
            // setImage(URL.createObjectURL(file)); // 📌 Muestra vista previa
            const base64 = await convertFileToBase64(file)
            setImage(base64);
            // console.log(base64)
        }
    };

    const handleRemoveImage = () => {
        setImage(''); // 🚨 Resetea el estado
    };

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

        if(typeModal==='add'){
            const data = {
            indetity: values.indetity,
            descripcion: values.desc,
            imagen: base64,
            estado: formData.estado===''?"A":formData.estado,
            id_categoria:values.id_categoria? parseFloat(values.id_categoria as string):1000,
            }
            postCat(data);
        } 
        if(typeModal==='edit'){
            const data = {
                indetity: values.indetity,
                descripcion: values.desc,
                imagen: base64,
                estado: formData.estado===''?"A":formData.estado,
                id_categoria:isNaN(parseFloat(values.id_categoria as string))?formData.id_categoria:parseFloat(values.id_categoria as string),
            }
            putCate(data,parseInt(formData.id))
            console.log(data)
        }
        setFormPopup(false);
    };

    const cancelar = () => {
        const form = {
            id: '',
            indetity: '',
            descripcion: '',
            imagen: '',
            estado: '',
            id_categoria: '',
        }
        setFormData(form);
        setFormPopup(false);
        setSelectedIdentity('')
        setSelectedCategoria('')
        setCategoria([]);
        setImage('')
    };

    const editar = (event:CategoriaList) => {
        // console.log(event)
        setSelectedIdentity(event.indetity)
        if(event.indetity==='S'){
            const sortedCate = dataCategoria.filter((i:any)=>i.indetity==='C');
            const selectCate = dataCategoria.filter((i:any)=>i.id===event.id_categoria);
            setCategoria(sortedCate)
            setSelectedCategoria(selectCate[0].id)
        }
        
        const base64WithPrefix = `data:image/jpeg;base64,${event.imagen}`;
        setImage(base64WithPrefix);
        setFormData((prevState)=>({
          ...prevState, 
          id:event.id,
          indetity:event.indetity,
          descripcion:event.descripcion,
          estado:event.estado,
          id_categoria:event.id_categoria,
        }))
        setTypeModal('edit');
        setFormPopup(true);
    };
    const baja = (data:any,id:any) => {
        const update = { estado:data==='A'?'I':'A' }
        putCate(update,id);
    };
    const add = () => {
        setFormPopup(true);
        setTypeModal('add');
    }
  return (
    <div className="bg-gray-50">
        <h1>Categorias</h1>

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
                        <th className="border border-gray-300 px-4 py-2 text-left">Codigo</th>
                        <th className="border border-gray-300 px-4 py-2 text-left">Tipo categoria</th>
                        <th className="border border-gray-300 px-4 py-2 text-left">Descripcion</th>
                        <th className="border border-gray-300 px-4 py-2 text-left">Estado</th>
                        <th className="border border-gray-300 px-4 py-2 text-left">Accion</th>
                    </tr>
                </thead>
                <tbody>
                     {
                       dataCategoria?(dataCategoria.map((i:CategoriaList, index:number)=>{
                         return(
                           <tr key={index}>
                             <td className={`border border-gray-300 px-4 py-2 ${i.estado=='I'?"text-red-500":"text-black"}`}>{i.id}</td>
                             <td className={`border border-gray-300 px-4 py-2 ${i.estado=='I'?"text-red-500":"text-black"}`}>{i.indetity}</td>
                             <td className={`border border-gray-300 px-4 py-2 ${i.estado=='I'?"text-red-500":"text-black"}`}>{i.descripcion}</td>
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
          <div className="bg-white p-6 rounded-lg shadow-lg w-96 max-h-screen overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">Registrar categoria o subcategoria</h2>
            <Form action="" onSubmit={handleSubmit}>
                <label className="block mb-2 ">
                  Identificador: 
                  <select name='indetity' className="w-full p-2 border rounded h-[42px]" value={selectedIdentity} onChange={(e) => pressSelectedIdentity(e.target.value)} required>
                      <option value="">-- Elige una opción --</option>
                      { identity && Array.isArray(identity) &&  identity.map((cat:any, index) => (
                          <option className='w-full' key={index} value={cat.code}>
                              {cat.name}
                          </option>
                      ))}
                  </select>
                </label>
                {   
                    categoria.length>0 &&
                    <label className="block mb-2 ">
                        Categoria: 
                        <select name='id_categoria' className="w-full p-2 border rounded h-[42px]" value={selectedCategoria} onChange={(e) => setSelectedCategoria(e.target.value)} required>
                            <option value="">-- Elige una opción --</option>
                            { categoria && Array.isArray(categoria) &&  categoria.map((cat:any, index) => (
                                <option className='w-full' key={index} value={cat.id}>
                                    {cat.descripcion}
                                </option>
                            ))}
                        </select>
                    </label>                    
                }

                <label className="block mb-2 ">
                  Descripcion:
                  <input
                    type="text"
                    name='desc'
                    className="w-full p-2 border rounded"
                    placeholder=""
                    required
                    value={formData.descripcion}
                    onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                  />
                </label>
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
