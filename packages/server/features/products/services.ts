import { db, transaction } from '../../core/infrastructure';
import { categoryService } from '../categories/services';
import { InsertProduct, Product } from './model';
import { ProductRepo } from './repo'
import { InsertVariant, VariantRepo } from './variants/repo';

class ProductService {
  private productRepo: ProductRepo = new ProductRepo(db);
  
  public async getById (productId: number, sku?: string) {
    return await this.productRepo.getById(productId, sku)
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
        price: variant.price,
        defaultSku: createdProduct.id + '_' + variant.defaultSku 
      }))

      const createdVariants = await variantRepo.createMany(insertedVariants)
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
    filters?: Partial<Product>,
  ) {
    return await this.productRepo.getAll(page, limit, filters)
  }

  public async getByIdWithVariants (id: number) {
    const product = await this.productRepo.getWithVariants(id)
    if (product) {
      const category = categoryService.getCategoryByFullPath(product.categoryFullPath+'/')
      return {
        ...product,
        category
      }
    }
  }
  
  public async updateById (
    id: number, 
    payload: Omit<InsertProduct, 'mainVariantId'>,     
    variants: Omit<InsertVariant, 'productId'|'name'|'id'>[],
    mainVariantIndex: number
  ) {
    transaction(async (tx) => {
      const variantRepo = new VariantRepo(tx);
      const productRepo = new ProductRepo(tx);

      let mainVariantId = 0
      const mainVariantSku = variants[mainVariantIndex].defaultSku

      const newSkus = variants.map(c => c.defaultSku)
      const existingVariants = await variantRepo.getAllByProductId(id)
      const existingSkus = existingVariants.map(c => c.defaultSku.split('_')[1])

      const toUpdate = variants.filter(v => existingSkus.includes(v.defaultSku));
      const toInsert = variants.filter(v => !existingSkus.includes(v.defaultSku));
      const toDelete = existingSkus.filter(sku => !newSkus.includes(sku));

      for (const variant of toUpdate) {
        const sku = id + '_' + variant.defaultSku
        const { id: vId } = await variantRepo.updateBySku(sku, {
          ...variant,
          defaultSku: sku,
          name: payload.name + " " + variant.defaultSku.split('-').join(' - '),
        })
        if (mainVariantSku === variant.defaultSku) mainVariantId = vId
      }

      for (const variant of toInsert) { 
        const { id: vId } = await variantRepo.create({
          ...variant,
          name: payload.name + " " + variant.defaultSku.split('-').join(' - '),
          productId: id,
          defaultSku: id + '_' + variant.defaultSku 
        })
        if (variant.defaultSku === mainVariantSku) mainVariantId = vId
      }

      for (const sku of toDelete) {
        await variantRepo.deleteBySku(`${id}_${sku}`);
      }
    
      await productRepo.updateById(id, {
        ...payload,
        mainVariantId
      });
    },{
      isolationLevel: 'repeatable read'
    })
  }

  public async deleteById (productId: number) {
    return await this.productRepo.deleteById(productId)
  }

  public getCount () {
    return this.productRepo.getCount()
  }
}

export const productService = new ProductService()