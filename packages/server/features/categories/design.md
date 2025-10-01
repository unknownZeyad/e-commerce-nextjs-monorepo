##### Why i made caching for categories in memory in the server?

- categories aren't big too much to always hit the database
- categories is a read heavy part of the app so anyways its better to be cached
- writes rarely occur to categories including (deletion, edit, insertion)
- reduce the database calls as much as possible 
- faster calls as everything in memory so queries are super fast

##### Why i made caching as tree in memory and not a flat array?

- categories are designed to be in tree hierarchy as any category can has many nested categories.
- faster queries as if it is stored in flat array it could go to O(n)

#### Why i made a `parentId` field ?
- just to cascade, and to auto delete the nested categories if the parent is deleted.

### why i made the `parentPath` field?

- it shows the full nesting path for the parent category of the child category.
- if the `parentPath` field is empty, that means that this category is from the root nodes categories.

core reasons:

- `parentPath` + `id` represents the full path of the category. so if i needed to get the category full parents as array its so easy to do it as in `getCategoriesFullPath` method by caching them in the `fullPathCachedMap` map which represents all categories but it is cached by its `parentPath + id`.

- also `parentPath` is used in the `parentPathCachedMap`, which caches the siblings categories by the common parent path.


### why caching in maps and not a tree?

- caching in trees is good and it will reduce storage as i use 2 maps for caching but it slower than the maps in lookups `O(n)`.
- caching in maps is super fast, it just `O(1)` for lookups.
