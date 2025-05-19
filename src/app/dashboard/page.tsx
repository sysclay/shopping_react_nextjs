import Image from "next/image";
import Link from "next/link";

const dashboardBtn = [
  {
    name:'Productos',
    href:'/dashboard/productos',
    icon:'/dashboard/gift.svg',
  },
  {
    name:'Precios',
    href:'/dashboard/precios',
    icon:'/dashboard/dollar.svg',
  },
  {
    name:'Stock',
    href:'/dashboard/stock',
    icon:'/dashboard/stock.svg',
  },
  {
    name:'Categorias',
    href:'/dashboard/categorias',
    icon:'/dashboard/category.svg',
  },
  {
    name:'Subcategoria',
    href:'/dashboard/categorias',
    icon:'/dashboard/subcategory.svg',
  },
]

export default function Dashboard() {
  return (
    <div className="w-full">
      <div className="flex flex-row w-full justify-between">
        {
          dashboardBtn.map((dash, i)=>{
            return(
              <div className="p-2" key={i}>
                <Link
                  className="flex flex-col items-center gap-2 hover:underline hover:underline-offset-4"
                  href={dash.href}
                  rel="noopener noreferrer"
                >
                  <Image
                    aria-hidden
                    src={dash.icon}
                    alt="File icon"
                    width={96}
                    height={96}
                  />
                  {dash.name}
                </Link>
              </div>
            )
          })
        }
      </div>
    </div>
  )
}
