import { db } from '../../core/lib/db';
import { InsertProduct, Product } from './model';
import { ProductRepo } from './repo'

export type ProductWithVariants = Omit<Product, 'variants'> & {
  variants: {
    name: string;
    linked_products: {
      value: string;
      product: Omit<
        Product,
        | 'description'
        | 'discountPercentage'
        | 'categoryFullPath'
        | 'createdDate'
        | 'updatedDate'
        | 'variants'
      >;
    }[];
  }[];
} | null

class ProductService {
  private repo: ProductRepo = new ProductRepo(db);

  public async getById (productId: number) {
    return await this.repo.getById(productId)
  }

  public async create (payload: InsertProduct) {
    return await this.repo.create(payload)
  }

  public async getAll (
    page: number,
    limit: number,
    columns: (keyof Product)[],
    filters?: Partial<Product>,
  ) {
    return await this.repo.getAll(page, limit, columns, filters)
  }

  public async getProductByIdWithVariants (productId: number) {
    const product = await this.repo.getById(productId) 

    if (!product) return null
    if (!product.variants?.length) return product as unknown as ProductWithVariants

    const linkedIds = product.variants.flatMap((variant) =>
      variant.linked_products.map((lp) => lp.id)
    )

    if (!linkedIds.length) return product as unknown as ProductWithVariants

    const linkedProducts = await this.repo.getAllByIds(
      linkedIds, 
      ['name', 'id', 'images', 'quantity', 'price']
    )

    const productMap = new Map(linkedProducts.map(p => [p.id, p]))

    const enrichedVariants = product.variants.map(({ linked_products, name }) => ({
      name,
      linked_products: linked_products.map(({ value, id }) => ({
        value: value,
        product: productMap.get(id) ?? null
      }))
    }))

    return {
      ...product,
      variants: enrichedVariants
    } as ProductWithVariants
  }
  
  public async updateById (id: number, payload: Partial<InsertProduct>) {
    return await this.repo.updateById(id, payload)
  }

  public async deleteById (productId: number) {
    return await this.repo.deleteById(productId)
  }

  public getCount () {
    return this.repo.getCount()
  }
}

export const productService = new ProductService()