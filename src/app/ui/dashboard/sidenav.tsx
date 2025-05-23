'use client'
import Link from "next/link"
import { usePathname } from "next/navigation"

const links = [
  {
    name:'Home',
    href:'/dashboard'
  },
  {
    name:'Productos',
    href:'/dashboard/productos'
  },
  {
    name:'Categorías',
    href:'/dashboard/categorias'
  },
  {
    name:'Precios',
    href:'/dashboard/precios'
  },
  {
    name:'Stock',
    href:'/dashboard/stock'
  }
]

export default function NavLinks() {
  const  pathname = usePathname()
  return (
    <>
    <div className="bg-gray-50 h-full">
      {
        links.map((link)=>{
          return(
            <Link key={link.name} href={link.href} className={`flex h-[48px] grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3 
            ${pathname === link.href?'bg-sky-100 text-blue-600':''}`}><p className="hidden md:block">{link.name}</p>
            </Link>
          )
        })
      }
    </div>

    </>
  )
}
