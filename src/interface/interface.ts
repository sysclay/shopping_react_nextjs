export default interface ProductoList {
    id:string,
    barcode:string, // Valor digitado por el usuario, considerar que puede ser un código de barras EAN 13 o EAN 14
    descripcion:string,
    id_unidad:string, // . CJA, PAQ, BOL, BOT, BAR, SCH, 
    id_categoria:string,
    id_subcategoria:string,
    id_unidad_contenido:string, //  (BOL x 6), PAQ x 15g, BOT x 1000ml
    informacion:string,
    imagen:string,
    moneda:string,
    valor_venta:number,
    impuesto:number,
    precio_venta:number,
    incremento:number,
    estado:string,
}

export default interface unidad {
    id:string,
    unidad:string,
    code:string,
}

export default interface contenido {
    id:string,
    contenido:string,
    id_unidad:string,
}

export default interface CategoriaList {
    id:string,
    indetity:string, // categoría (C) o sub categoría (S)
    descripcion:string,
    imagen:string,
    estado:string,
    id_categoria:string,  // valor para asignar si es categoria o tiene subcategoria
}

export default interface stock {
    id_producto:string,
    stock:string,
    stock_fisico:string,
}

// **************************************************

export default interface inventario {
    id:string, // (Ejm.: CM = Compra de materiales / DC = Devolución del cliente)
    numero_transaccion:number, // . Cada código de transacción deberá tener su propio correlativo
    fecha_transaccion:string,
    operacion:string,
    id_producto:string,
    id_unidad:string,
    cantidad_transaccion:number,
    is_active:boolean,
}

export default interface empresa {
    id:string,
    ruc:string,
    nombre_empresa:string,
    direccion:string,
    ubigeo:string,
    is_active:boolean,
}

export default interface cliente {
    id:string,
    nombre:string,
    apellido_p:string,
    apellido_m:string,
    celular:string,
    email:boolean,
    is_active:boolean,
}

