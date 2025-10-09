import { Category } from "../model";

export class CategoryLocalRepo {
  private fullPathCachedMap: Map<string, Category> = new Map();
  private parentPathCachedMap: Map<string, Category[]> = new Map();

  private getFullPath (cat: Category) {
    return cat.parentPath + cat.id + '/';
  }

  public async reload (categories: Category[]) {
    const newFullMap = new Map<string, Category>();
    const newParentMap = new Map<string, Category[]>();

    categories.forEach((cat) => {
      const fullPath = cat.parentPath + cat.id + '/';
      newFullMap.set(fullPath, cat);
      newParentMap.set(
        cat.parentPath,
        [...(newParentMap.get(cat.parentPath) || []), cat]
      );
    });

    this.fullPathCachedMap = newFullMap;
    this.parentPathCachedMap = newParentMap;
  }

  public async getSubCategories(parentPath?: string): Promise<Category[]> {
    return this.parentPathCachedMap.get(parentPath || "") || [];
  }

  public async getCategoriesFullPath(fullPath: string): Promise<Category[]> {
    const sequence: Category[] = [];
    let parentPath = ''
    fullPath.split("/").forEach((id) => {
      parentPath += `${id}/`
      const cat = this.fullPathCachedMap.get(parentPath);
      if (cat) sequence.push(cat);
    });
    return sequence;
  }

  public async create(category: Category) {
    const fullPath = this.getFullPath(category);

    this.fullPathCachedMap.set(fullPath, category);
    this.parentPathCachedMap.set(
      category.parentPath,
      [...(this.parentPathCachedMap.get(category.parentPath) || []), category]
    ); 
  }

  public async update(category: Category) {
    const fullPath = this.getFullPath(category);

    this.fullPathCachedMap.set(fullPath, category);

    const parentPathMap = (this.parentPathCachedMap.get(category.parentPath)||[])
    for (let i = 0; i < parentPathMap?.length; i++) {
      if (parentPathMap[i].id === category.id) {
        parentPathMap[i] = category
        this.parentPathCachedMap.set(category.parentPath,parentPathMap)
        break;
      }
    }
  }

  public async delete(category: Category) {
    const fullPath = this.getFullPath(category);
    const oldParentCache = this.parentPathCachedMap.get(category.parentPath) || []

    this.fullPathCachedMap.delete(fullPath);
    this.parentPathCachedMap.delete(fullPath);
    this.parentPathCachedMap.set(
      category.parentPath,
      oldParentCache.filter(c => c.id !== category.id)
    ); 
  }
}

