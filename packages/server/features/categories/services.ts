import { InsertCategory } from "./model";
import { CategoryLocalRepo } from "./repos/local";
import { CategoryRemoteRepo } from "./repos/remote";
import { db } from '../../core/infrastructure'

class CategoryService {
  private localRepo: CategoryLocalRepo 
  private remoteRepo: CategoryRemoteRepo 

  constructor(localRepo: CategoryLocalRepo, remoteRepo: CategoryRemoteRepo) {
    this.localRepo = localRepo
    this.remoteRepo = remoteRepo

    this.remoteRepo.getAll().then((categories) => {
      this.localRepo.reload(categories)
    })
  }

  public async getSubCategories(parentPath?: string) {
    return this.localRepo.getSubCategories(parentPath)
  }

  public async getCategoriesFullPath(fullPath: string) {
    return this.localRepo.getCategoriesFullPath(fullPath)
  }

  public async create(payload: InsertCategory) {
    const category = await this.remoteRepo.create(payload)
    this.localRepo.create(category)
  }

  public async updateById(id: number, payload: Partial<InsertCategory>) {
    const category = await this.remoteRepo.updateById(id, payload)
    this.localRepo.update(category!)
  }

  public async deleteById(id: number) {
    const deleted = await this.remoteRepo.deleteById(id)
    this.localRepo.delete(deleted)
  }

  public getCategoryByFullPath (fullPath: string) {
    return this.localRepo.getCategoryByFullPath(fullPath)
  }
}

export const categoryService = new CategoryService(
  new CategoryLocalRepo(), 
  new CategoryRemoteRepo(db)
)