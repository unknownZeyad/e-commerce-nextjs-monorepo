"use client";

import { useEffect, useState } from "react";
import {
  getSubCategoriesAction,
  createCategoryAction,
  deleteCategoryAction,
  updateCategoryAction,
  getCategoriesFullPathAction,
} from "../server/features/categories/actions";

type Category = {
  id: number;
  name: string;
  parentPath: string;
};

function CategoryNode({
  category,
  parentPath,
}: {
  category: Category;
  parentPath: string;
}) {
  const [children, setChildren] = useState<Category[] | null>(null);
  const [expanded, setExpanded] = useState(false);
  const [newChildName, setNewChildName] = useState("");
  const [editing, setEditing] = useState(false);
  const [editName, setEditName] = useState(category.name);

  const fullPath = parentPath + category.id + "/";

  const toggleExpand = async () => {
    if (!expanded) {
      const subs = await getSubCategoriesAction(fullPath);
      setChildren(subs);
    }
    setExpanded(!expanded);
  };

  const handleAddChild = async () => {
    if (!newChildName) return;
    await createCategoryAction({
      name: newChildName,
      parentPath: fullPath,
    });
    const subs = await getSubCategoriesAction(fullPath);
    setChildren(subs);
    setNewChildName("");
    setExpanded(true);
  };

  const handleDelete = async () => {
    await deleteCategoryAction(category.id);
    if (expanded) {
      const subs = await getSubCategoriesAction(fullPath);
      setChildren(subs);
    }
  };

  const handleUpdate = async () => {
    await updateCategoryAction(category.id, {
      name: editName,
      parentPath: category.parentPath,
    });
    setEditing(false);
  };

  return (
    <div className="ml-4">
      <div className="flex items-center gap-2">
        <button onClick={toggleExpand} className="text-xs">
          {expanded ? "▼" : "▶"}
        </button>
        {editing ? (
          <>
            <input
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              className="border rounded px-1 text-sm"
            />
            <button onClick={handleUpdate} className="text-green-600 text-xs">
              Save
            </button>
          </>
        ) : (
          <span>
            {category.name}{" "}
            <span className="text-gray-500 text-xs">({fullPath})</span>
          </span>
        )}
        <button
          onClick={() => setEditing(!editing)}
          className="text-blue-600 text-xs"
        >
          {editing ? "Cancel" : "Edit"}
        </button>
        <button onClick={handleDelete} className="text-red-600 text-xs">
          Delete
        </button>
      </div>

      {expanded && (
        <div className="ml-6 mt-1 space-y-1">
          {children?.map((child) => (
            <CategoryNode
              key={child.id}
              category={child}
              parentPath={fullPath}
            />
          ))}
          <div className="flex items-center gap-2 mt-1">
            <input
              value={newChildName}
              onChange={(e) => setNewChildName(e.target.value)}
              className="border rounded px-1 text-sm"
              placeholder="Add child"
            />
            <button
              onClick={handleAddChild}
              className="text-purple-600 text-xs"
            >
              +
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function CategoryTree() {
  const [roots, setRoots] = useState<Category[]>([]);
  const [newRootName, setNewRootName] = useState("");
  const [searchPath, setSearchPath] = useState("");
  const [searchResult, setSearchResult] = useState<Category[]>([]);

  const loadRoots = async () => {
    const cats = await getSubCategoriesAction(""); // root
    setRoots(cats);
  };

  useEffect(() => {
    loadRoots();
  }, []);

  const handleAddRoot = async () => {
    if (!newRootName) return;
    await createCategoryAction({
      name: newRootName,
      parentPath: "",
    });
    await loadRoots();
    setNewRootName("");
  };

  const handleSearch = async () => {
    if (!searchPath) return;
    const sequence = await getCategoriesFullPathAction(searchPath);
    setSearchResult(sequence); // ✅ just set result, no highlight
  };

  return (
    <div className="p-4 border rounded space-y-6">
      <h2 className="font-bold">Category Tree</h2>

      {/* Root add */}
      <div className="flex gap-2">
        <input
          value={newRootName}
          onChange={(e) => setNewRootName(e.target.value)}
          className="border rounded px-2 py-1 text-sm"
          placeholder="New root category"
        />
        <button
          onClick={handleAddRoot}
          className="bg-blue-500 text-white px-2 rounded text-sm"
        >
          Add Root
        </button>
      </div>

      {/* Search */}
      <div>
        <div className="flex gap-2">
          <input
            value={searchPath}
            onChange={(e) => setSearchPath(e.target.value)}
            className="border rounded px-2 py-1 text-sm"
            placeholder="Search by full path (e.g. 1/2/3/)"
          />
          <button
            onClick={handleSearch}
            className="bg-green-500 text-white px-2 rounded text-sm"
          >
            Search
          </button>
        </div>

        {/* Search result display */}
        {searchResult.length > 0 && (
          <ul className="mt-2 list-disc pl-6 text-sm">
            {searchResult.map((c) => (
              <li key={c.id}>
                {c.name}{" "}
                <span className="text-gray-500">
                  (id: {c.id}, parentPath: {c.parentPath})
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Tree */}
      <div>
        {roots.map((root) => (
          <CategoryNode key={root.id} category={root} parentPath="" />
        ))}
      </div>
    </div>
  );
}
