import { db, transaction } from '../../core/infrastructure';
import { InsertProduct, Product } from './model';
import { ProductRepo } from './repo'
import { InsertVariant, VariantRepo } from './variants/repo';

class ProductService {
  private productRepo: ProductRepo = new ProductRepo(db);

  public async getById (productId: number) {
    return await this.productRepo.getById(productId)
  }

  public async create (
    product: Omit<InsertProduct, 'mainVariantId'>, 
    variants: Omit<InsertVariant, 'productId'|'name'>[], 
    mainVariantIndex: number
  ) {
    transaction(async (tx) => {
      const variantRepo = new VariantRepo(tx);
      const productRepo = new ProductRepo(tx);
      const createdProduct = await productRepo.create({
        ...product,
        mainVariantId: 0
      })

      const insertedVariants: InsertVariant[] = variants.map((variant) => ({
        ...variant,
        name: product.name + " " + variant.defaultSku.split('-').join(' - '),
        productId: createdProduct.id,
        price: variant.price || product.price,
        defaultSku: createdProduct.id + '_' + variant.defaultSku 
      }))

      const createdVariants = await variantRepo.create(insertedVariants)
      const mainVariant = createdVariants[mainVariantIndex]

      await productRepo.updateById(createdProduct.id, {
        mainVariantId: mainVariant.id
      })
    }, {
      isolationLevel: 'read committed',
    })
  }

  public async getAll (
    page: number,
    limit: number,
    columns: (keyof Product)[],
    filters?: Partial<Product>,
  ) {
    return await this.productRepo.getAll(page, limit, columns, filters)
  }
  
  public async updateById (id: number, payload: Partial<InsertProduct>) {
    return await this.productRepo.updateById(id, payload)
  }

  public async deleteById (productId: number) {
    return await this.productRepo.deleteById(productId)
  }

  public getCount () {
    return this.productRepo.getCount()
  }
}

export const productService = new ProductService()