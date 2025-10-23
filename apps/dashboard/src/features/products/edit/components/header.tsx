
import { useParams } from "next/navigation"

function EditProductHeader() {
  return (
    <div className='mb-10'>
      <h3 className='text-3xl mb-1 font-semibold'>Edit Product</h3>
      <p className='text-white/60 w-5/6'>Edit product and define its details, pricing, and availability.</p>
    </div>
  )
}

export default EditProductHeader