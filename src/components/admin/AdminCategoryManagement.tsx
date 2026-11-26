"use client";

import React, { useState, useMemo } from "react";
import {
  Layers,
  Plus,
  Search,
  Edit2,
  Trash2,
  Power,
  ChevronDown,
  ChevronUp,
  Package,
  FolderPlus,
  AlertCircle,
  CheckCircle2,
  X,
  ArrowUpDown,
  Tag,
  ExternalLink,
  Sparkles,
  Info
} from "lucide-react";
import Image from "next/image";

export interface SubcategoryItem {
  id: number;
  name: string;
  slug: string;
  categoryId: number;
  description?: string | null;
  image?: string | null;
  displayOrder: number;
  isActive: boolean;
  _count?: {
    products?: number;
  };
}

export interface CategoryItem {
  id: number;
  name: string;
  slug: string;
  description?: string | null;
  image?: string | null;
  displayOrder: number;
  isActive: boolean;
  subcategories: SubcategoryItem[];
  _count?: {
    products?: number;
  };
}

interface AdminCategoryManagementProps {
  categories: CategoryItem[];
  onAction: (action: string, payload: any) => Promise<void>;
}

export function AdminCategoryManagement({
  categories = [],
  onAction
}: AdminCategoryManagementProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<"ALL" | "ACTIVE" | "INACTIVE">("ALL");
  const [expandedCategories, setExpandedCategories] = useState<Record<number, boolean>>(() => {
    // Expand the first two by default
    const initial: Record<number, boolean> = {};
    categories.slice(0, 2).forEach(c => {
      initial[c.id] = true;
    });
    return initial;
  });

  // Modal States
  const [categoryModal, setCategoryModal] = useState<{
    isOpen: boolean;
    mode: "CREATE" | "EDIT";
    data: Partial<CategoryItem>;
  }>({
    isOpen: false,
    mode: "CREATE",
    data: {}
  });

  const [subcategoryModal, setSubcategoryModal] = useState<{
    isOpen: boolean;
    mode: "CREATE" | "EDIT";
    categoryId: number;
    data: Partial<SubcategoryItem>;
  }>({
    isOpen: false,
    mode: "CREATE",
    categoryId: categories[0]?.id || 1,
    data: {}
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [modalError, setModalError] = useState("");

  // Statistics
  const stats = useMemo(() => {
    const totalCats = categories.length;
    const activeCats = categories.filter(c => c.isActive).length;
    const totalSubs = categories.reduce((sum, c) => sum + (c.subcategories?.length || 0), 0);
    const totalProducts = categories.reduce((sum, c) => {
      const catDirect = c._count?.products || 0;
      const subProducts = (c.subcategories || []).reduce((sSum, s) => sSum + (s._count?.products || 0), 0);
      return sum + Math.max(catDirect, subProducts);
    }, 0);

    return { totalCats, activeCats, totalSubs, totalProducts };
  }, [categories]);

  // Toggle Category Accordion
  const toggleAccordion = (catId: number) => {
    setExpandedCategories(prev => ({
      ...prev,
      [catId]: !prev[catId]
    }));
  };

  // Expand All / Collapse All
  const handleToggleAll = (expand: boolean) => {
    const nextState: Record<number, boolean> = {};
    categories.forEach(c => {
      nextState[c.id] = expand;
    });
    setExpandedCategories(nextState);
  };

  // Filter Categories
  const filteredCategories = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return categories.filter(cat => {
      // Status filter
      if (filterStatus === "ACTIVE" && !cat.isActive) return false;
      if (filterStatus === "INACTIVE" && cat.isActive) return false;

      // Query filter
      if (!q) return true;
      const matchesCat = cat.name.toLowerCase().includes(q) || cat.slug.toLowerCase().includes(q);
      const matchesSub = (cat.subcategories || []).some(
        s => s.name.toLowerCase().includes(q) || s.slug.toLowerCase().includes(q)
      );
      return matchesCat || matchesSub;
    });
  }, [categories, searchQuery, filterStatus]);

  // Open Create Category Modal
  const openCreateCategory = () => {
    setModalError("");
    setCategoryModal({
      isOpen: true,
      mode: "CREATE",
      data: {
        name: "",
        description: "",
        image: "",
        displayOrder: (categories.length + 1),
        isActive: true
      }
    });
  };

  // Open Edit Category Modal
  const openEditCategory = (cat: CategoryItem) => {
    setModalError("");
    setCategoryModal({
      isOpen: true,
      mode: "EDIT",
      data: {
        id: cat.id,
        name: cat.name,
        slug: cat.slug,
        description: cat.description || "",
        image: cat.image || "",
        displayOrder: cat.displayOrder,
        isActive: cat.isActive
      }
    });
  };

  // Submit Category Modal
  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    setModalError("");
    const name = categoryModal.data.name?.trim();
    if (!name) {
      setModalError("Category name is required.");
      return;
    }

    setIsSubmitting(true);
    try {
      if (categoryModal.mode === "CREATE") {
        await onAction("CREATE_CATEGORY", {
          name,
          description: categoryModal.data.description,
          image: categoryModal.data.image,
          displayOrder: Number(categoryModal.data.displayOrder) || 0,
          isActive: categoryModal.data.isActive ?? true
        });
      } else {
        await onAction("UPDATE_CATEGORY", {
          categoryId: categoryModal.data.id,
          name,
          description: categoryModal.data.description,
          image: categoryModal.data.image,
          displayOrder: Number(categoryModal.data.displayOrder) || 0,
          isActive: categoryModal.data.isActive ?? true
        });
      }
      setCategoryModal(prev => ({ ...prev, isOpen: false }));
    } catch (err: any) {
      setModalError(err.message || "Failed to save category.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Open Create Subcategory Modal
  const openCreateSubcategory = (targetCatId?: number) => {
    setModalError("");
    const catId = targetCatId || categories[0]?.id || 1;
    const parentCat = categories.find(c => c.id === catId);
    setSubcategoryModal({
      isOpen: true,
      mode: "CREATE",
      categoryId: catId,
      data: {
        name: "",
        description: "",
        image: "",
        displayOrder: ((parentCat?.subcategories?.length || 0) + 1),
        isActive: true
      }
    });
  };

  // Open Edit Subcategory Modal
  const openEditSubcategory = (sub: SubcategoryItem) => {
    setModalError("");
    setSubcategoryModal({
      isOpen: true,
      mode: "EDIT",
      categoryId: sub.categoryId,
      data: {
        id: sub.id,
        name: sub.name,
        slug: sub.slug,
        categoryId: sub.categoryId,
        description: sub.description || "",
        image: sub.image || "",
        displayOrder: sub.displayOrder,
        isActive: sub.isActive
      }
    });
  };

  // Submit Subcategory Modal
  const handleSaveSubcategory = async (e: React.FormEvent) => {
    e.preventDefault();
    setModalError("");
    const name = subcategoryModal.data.name?.trim();
    if (!name) {
      setModalError("Subcategory name is required.");
      return;
    }
    if (!subcategoryModal.categoryId) {
      setModalError("Parent category is required.");
      return;
    }

    setIsSubmitting(true);
    try {
      if (subcategoryModal.mode === "CREATE") {
        await onAction("CREATE_SUBCATEGORY", {
          categoryId: Number(subcategoryModal.categoryId),
          name,
          description: subcategoryModal.data.description,
          image: subcategoryModal.data.image,
          displayOrder: Number(subcategoryModal.data.displayOrder) || 0,
          isActive: subcategoryModal.data.isActive ?? true
        });
      } else {
        await onAction("UPDATE_SUBCATEGORY", {
          subcategoryId: subcategoryModal.data.id,
          categoryId: Number(subcategoryModal.categoryId),
          name,
          description: subcategoryModal.data.description,
          image: subcategoryModal.data.image,
          displayOrder: Number(subcategoryModal.data.displayOrder) || 0,
          isActive: subcategoryModal.data.isActive ?? true
        });
      }
      setSubcategoryModal(prev => ({ ...prev, isOpen: false }));
    } catch (err: any) {
      setModalError(err.message || "Failed to save subcategory.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner / Header */}
      <div className="bg-white rounded-3xl border border-stone-200/80 p-6 sm:p-8 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#4A1513]/10 text-[#4A1513] text-xs font-bold uppercase tracking-wider mb-2.5">
            <Layers size={13} />
            <span>Single Source of Truth</span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl text-stone-900 tracking-tight">
            Category & Subcategory Management
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 mt-1 max-w-2xl leading-relaxed">
            Manage the dynamic category taxonomy governing the Femazon Shop navigation, dropdown menus, product listings, and vendor product creation forms.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={openCreateCategory}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#4A1513] text-white hover:bg-[#350B0A] text-xs font-bold tracking-wide transition shadow-xs cursor-pointer"
          >
            <Plus size={16} />
            <span>Add Main Category</span>
          </button>
          <button
            type="button"
            onClick={() => openCreateSubcategory()}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-[#4A1513] text-[#4A1513] hover:bg-[#FAF7F5] text-xs font-bold tracking-wide transition shadow-2xs cursor-pointer"
          >
            <FolderPlus size={16} />
            <span>Add Subcategory</span>
          </button>
        </div>
      </div>

      {/* Stats Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-2xs">
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold uppercase tracking-wider text-stone-400">Main Categories</p>
            <Layers size={18} className="text-[#4A1513]" />
          </div>
          <p className="text-2xl sm:text-3xl font-serif text-stone-900 mt-2">{stats.totalCats}</p>
          <p className="text-[11px] text-stone-400 mt-1">{stats.activeCats} Active on Storefront</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-2xs">
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold uppercase tracking-wider text-stone-400">Subcategories</p>
            <Tag size={18} className="text-amber-700" />
          </div>
          <p className="text-2xl sm:text-3xl font-serif text-stone-900 mt-2">{stats.totalSubs}</p>
          <p className="text-[11px] text-stone-400 mt-1">Across all primary departments</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-2xs">
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold uppercase tracking-wider text-stone-400">Total Products</p>
            <Package size={18} className="text-emerald-700" />
          </div>
          <p className="text-2xl sm:text-3xl font-serif text-stone-900 mt-2">{stats.totalProducts}</p>
          <p className="text-[11px] text-stone-400 mt-1">Dynamically linked in database</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-2xs">
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold uppercase tracking-wider text-stone-400">System State</p>
            <CheckCircle2 size={18} className="text-[#C5A059]" />
          </div>
          <p className="text-lg font-serif text-stone-900 mt-2">PostgreSQL Synced</p>
          <p className="text-[11px] text-stone-400 mt-1">Zero hardcoded dependencies</p>
        </div>
      </div>

      {/* Search and Filters Bar */}
      <div className="bg-white rounded-2xl border border-stone-200/80 p-4 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-4">
        
        {/* Search */}
        <div className="relative w-full sm:w-80">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search category or subcategory..."
            className="w-full pl-10 pr-4 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:border-[#4A1513] focus:outline-none transition font-medium"
          />
        </div>

        {/* Status Filters and Expand/Collapse All */}
        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
          <div className="flex items-center bg-stone-100 p-1 rounded-xl text-xs font-bold">
            <button
              type="button"
              onClick={() => setFilterStatus("ALL")}
              className={`px-3 py-1.5 rounded-lg transition ${
                filterStatus === "ALL" ? "bg-white text-stone-900 shadow-2xs" : "text-stone-500 hover:text-stone-900"
              }`}
            >
              All
            </button>
            <button
              type="button"
              onClick={() => setFilterStatus("ACTIVE")}
              className={`px-3 py-1.5 rounded-lg transition ${
                filterStatus === "ACTIVE" ? "bg-white text-emerald-800 shadow-2xs" : "text-stone-500 hover:text-stone-900"
              }`}
            >
              Active
            </button>
            <button
              type="button"
              onClick={() => setFilterStatus("INACTIVE")}
              className={`px-3 py-1.5 rounded-lg transition ${
                filterStatus === "INACTIVE" ? "bg-white text-stone-900 shadow-2xs" : "text-stone-500 hover:text-stone-900"
              }`}
            >
              Inactive
            </button>
          </div>

          <div className="h-4 w-px bg-stone-200 hidden sm:block" />

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => handleToggleAll(true)}
              className="text-[11px] font-bold text-stone-600 hover:text-[#4A1513] transition"
            >
              Expand All
            </button>
            <span className="text-stone-300">|</span>
            <button
              type="button"
              onClick={() => handleToggleAll(false)}
              className="text-[11px] font-bold text-stone-600 hover:text-[#4A1513] transition"
            >
              Collapse
            </button>
          </div>
        </div>

      </div>

      {/* Categories Hierarchy List */}
      <div className="space-y-4">
        {filteredCategories.length === 0 ? (
          <div className="bg-white rounded-3xl border border-stone-200/80 p-12 text-center shadow-xs">
            <Layers size={40} className="mx-auto text-stone-300 mb-3" />
            <h3 className="text-base font-serif text-stone-800 font-bold">No Categories Found</h3>
            <p className="text-xs text-stone-500 mt-1 max-w-sm mx-auto">
              No categories match your current search query. Create a new category or clear your filters.
            </p>
          </div>
        ) : (
          filteredCategories.map(cat => {
            const isExpanded = !!expandedCategories[cat.id];
            const productCount = cat._count?.products || 0;
            const subcategoriesCount = cat.subcategories?.length || 0;

            return (
              <div
                key={cat.id}
                className="bg-white rounded-3xl border border-stone-200/80 shadow-2xs overflow-hidden transition-all duration-200"
              >
                {/* Category Header Row */}
                <div className="p-5 sm:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-stone-100 bg-stone-50/50">
                  
                  {/* Left: Accordion trigger & Info */}
                  <div className="flex items-start sm:items-center gap-4 flex-1">
                    <button
                      type="button"
                      onClick={() => toggleAccordion(cat.id)}
                      className="w-9 h-9 rounded-xl bg-white border border-stone-200 text-stone-600 hover:text-[#4A1513] hover:border-[#4A1513] flex items-center justify-center transition shrink-0 cursor-pointer shadow-2xs mt-1 sm:mt-0"
                    >
                      {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                    </button>

                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="w-6 h-6 rounded-md bg-[#4A1513]/10 text-[#4A1513] text-[11px] font-bold font-mono flex items-center justify-center">
                          #{cat.displayOrder}
                        </span>
                        <h3 className="font-serif text-lg sm:text-xl font-bold text-stone-900 tracking-tight">
                          {cat.name}
                        </h3>
                        <span className="text-xs text-stone-400 font-mono">
                          /{cat.slug}
                        </span>

                        {/* Status Badge */}
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10.5px] font-bold uppercase tracking-wider ${
                            cat.isActive
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                              : "bg-stone-100 text-stone-500 border border-stone-200"
                          }`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${cat.isActive ? "bg-emerald-500" : "bg-stone-400"}`} />
                          {cat.isActive ? "Active" : "Inactive"}
                        </span>
                      </div>

                      {cat.description && (
                        <p className="text-xs text-stone-500 max-w-xl">
                          {cat.description}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Right: Badges & Category Actions */}
                  <div className="flex flex-wrap items-center gap-2.5 justify-end">
                    
                    {/* Subcategories count badge */}
                    <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-stone-200 text-xs font-semibold text-stone-700 shadow-2xs">
                      <Tag size={13} className="text-amber-700" />
                      <span>{subcategoriesCount} Subcategories</span>
                    </div>

                    {/* Products count badge */}
                    <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-stone-200 text-xs font-semibold text-stone-700 shadow-2xs">
                      <Package size={13} className="text-emerald-700" />
                      <span>{productCount} Products</span>
                    </div>

                    {/* Add Subcategory under this Category */}
                    <button
                      type="button"
                      onClick={() => openCreateSubcategory(cat.id)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#4A1513]/10 text-[#4A1513] hover:bg-[#4A1513] hover:text-white text-xs font-bold transition cursor-pointer"
                      title="Add subcategory inside this department"
                    >
                      <Plus size={14} />
                      <span className="hidden sm:inline">Add Subcategory</span>
                    </button>

                    {/* Edit Category */}
                    <button
                      type="button"
                      onClick={() => openEditCategory(cat)}
                      className="w-8 h-8 rounded-xl bg-white border border-stone-200 text-stone-600 hover:text-[#4A1513] hover:border-[#4A1513] flex items-center justify-center transition cursor-pointer shadow-2xs"
                      title="Edit Category Name & Order"
                    >
                      <Edit2 size={14} />
                    </button>

                    {/* Toggle Active Switch */}
                    <button
                      type="button"
                      onClick={() => onAction("TOGGLE_CATEGORY_ACTIVE", { categoryId: cat.id })}
                      className={`w-8 h-8 rounded-xl border flex items-center justify-center transition cursor-pointer shadow-2xs ${
                        cat.isActive
                          ? "bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100"
                          : "bg-stone-50 border-stone-200 text-stone-400 hover:bg-stone-100"
                      }`}
                      title={cat.isActive ? "Deactivate Category" : "Activate Category"}
                    >
                      <Power size={14} />
                    </button>

                    {/* Delete Category (Safe) */}
                    <button
                      type="button"
                      onClick={() => {
                        if (productCount > 0) {
                          alert(`Cannot delete "${cat.name}" because it contains ${productCount} products. Please deactivate the category instead to preserve catalog safety.`);
                          return;
                        }
                        if (confirm(`Are you sure you want to permanently delete category "${cat.name}" and its subcategories?`)) {
                          onAction("DELETE_CATEGORY", { categoryId: cat.id });
                        }
                      }}
                      className="w-8 h-8 rounded-xl bg-white border border-stone-200 text-stone-400 hover:text-rose-600 hover:border-rose-200 flex items-center justify-center transition cursor-pointer shadow-2xs"
                      title={productCount > 0 ? "Cannot delete category with products (deactivate instead)" : "Delete Category"}
                    >
                      <Trash2 size={14} />
                    </button>

                  </div>

                </div>

                {/* Subcategories Expansion */}
                {isExpanded && (
                  <div className="p-5 sm:p-6 bg-white space-y-4">
                    
                    <div className="flex items-center justify-between pb-2 border-b border-stone-100">
                      <div className="flex items-center gap-2">
                        <Tag size={15} className="text-stone-400" />
                        <h4 className="text-xs font-bold uppercase tracking-wider text-stone-600">
                          Subcategories inside {cat.name} ({subcategoriesCount})
                        </h4>
                      </div>
                      <span className="text-[11px] text-stone-400">
                        Order determines sequence in Shop navigation
                      </span>
                    </div>

                    {(!cat.subcategories || cat.subcategories.length === 0) ? (
                      <div className="py-8 text-center text-stone-400 text-xs">
                        No subcategories defined for this department yet.{" "}
                        <button
                          type="button"
                          onClick={() => openCreateSubcategory(cat.id)}
                          className="text-[#4A1513] font-bold hover:underline"
                        >
                          Add the first subcategory
                        </button>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                        {cat.subcategories.map(sub => {
                          const subProdCount = sub._count?.products || 0;
                          return (
                            <div
                              key={sub.id}
                              className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                                sub.isActive
                                  ? "bg-stone-50/70 border-stone-200/90 hover:border-stone-300 hover:bg-stone-50"
                                  : "bg-stone-100/60 border-dashed border-stone-300 opacity-60"
                              }`}
                            >
                              <div className="min-w-0 flex-1">
                                <div className="flex items-center gap-2">
                                  <span className="text-[10px] font-mono text-stone-400">
                                    #{sub.displayOrder}
                                  </span>
                                  <h5 className="text-xs font-bold text-stone-900 truncate">
                                    {sub.name}
                                  </h5>
                                </div>
                                <div className="flex items-center gap-2 mt-1">
                                  <span className="text-[10px] text-stone-400 font-mono truncate">
                                    /{sub.slug}
                                  </span>
                                  <span className="text-stone-300">•</span>
                                  <span className="text-[10.5px] font-semibold text-emerald-700">
                                    {subProdCount} products
                                  </span>
                                </div>
                              </div>

                              {/* Subcategory Action Buttons */}
                              <div className="flex items-center gap-1.5 shrink-0">
                                <button
                                  type="button"
                                  onClick={() => openEditSubcategory(sub)}
                                  className="w-7 h-7 rounded-lg bg-white border border-stone-200 text-stone-600 hover:text-[#4A1513] hover:border-[#4A1513] flex items-center justify-center transition cursor-pointer shadow-2xs"
                                  title="Edit Subcategory"
                                >
                                  <Edit2 size={12} />
                                </button>
                                
                                <button
                                  type="button"
                                  onClick={() => onAction("TOGGLE_SUBCATEGORY_ACTIVE", { subcategoryId: sub.id })}
                                  className={`w-7 h-7 rounded-lg border flex items-center justify-center transition cursor-pointer shadow-2xs ${
                                    sub.isActive
                                      ? "bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100"
                                      : "bg-stone-50 border-stone-200 text-stone-400 hover:bg-stone-100"
                                  }`}
                                  title={sub.isActive ? "Deactivate Subcategory" : "Activate Subcategory"}
                                >
                                  <Power size={12} />
                                </button>

                                <button
                                  type="button"
                                  onClick={() => {
                                    if (subProdCount > 0) {
                                      alert(`Cannot delete subcategory "${sub.name}" because ${subProdCount} products are assigned to it. Deactivate it instead.`);
                                      return;
                                    }
                                    if (confirm(`Are you sure you want to delete subcategory "${sub.name}"?`)) {
                                      onAction("DELETE_SUBCATEGORY", { subcategoryId: sub.id });
                                    }
                                  }}
                                  className="w-7 h-7 rounded-lg bg-white border border-stone-200 text-stone-400 hover:text-rose-600 hover:border-rose-200 flex items-center justify-center transition cursor-pointer shadow-2xs"
                                  title="Delete Subcategory"
                                >
                                  <Trash2 size={12} />
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}

                  </div>
                )}

              </div>
            );
          })
        )}
      </div>

      {/* MODAL 1: ADD / EDIT MAIN CATEGORY */}
      {categoryModal.isOpen && (
        <div className="fixed inset-0 z-50 bg-stone-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-stone-200 relative animate-in fade-in zoom-in-95 duration-150">
            
            <button
              type="button"
              onClick={() => setCategoryModal(prev => ({ ...prev, isOpen: false }))}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-stone-100 text-stone-500 hover:bg-stone-200 flex items-center justify-center transition cursor-pointer"
            >
              <X size={16} />
            </button>

            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-[#4A1513]/10 text-[#4A1513] flex items-center justify-center">
                <Layers size={20} />
              </div>
              <div>
                <h3 className="font-serif text-xl font-bold text-stone-900">
                  {categoryModal.mode === "CREATE" ? "Add Main Category" : "Edit Main Category"}
                </h3>
                <p className="text-xs text-stone-500">
                  {categoryModal.mode === "CREATE"
                    ? "Create a new top-level department for Femazon Shop."
                    : `Editing ${categoryModal.data.name}`}
                </p>
              </div>
            </div>

            {modalError && (
              <div className="mb-4 p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs flex items-center gap-2">
                <AlertCircle size={15} className="shrink-0" />
                <span>{modalError}</span>
              </div>
            )}

            <form onSubmit={handleSaveCategory} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                  Category Name <span className="text-rose-600">*</span>
                </label>
                <input
                  type="text"
                  value={categoryModal.data.name || ""}
                  onChange={e => setCategoryModal(prev => ({
                    ...prev,
                    data: { ...prev.data, name: e.target.value }
                  }))}
                  placeholder="e.g. Bridal & Wedding Couture"
                  className="w-full h-11 px-3.5 text-xs sm:text-sm bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:border-[#4A1513] focus:outline-none transition font-medium"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                  Description
                </label>
                <textarea
                  value={categoryModal.data.description || ""}
                  onChange={e => setCategoryModal(prev => ({
                    ...prev,
                    data: { ...prev.data, description: e.target.value }
                  }))}
                  rows={2}
                  placeholder="Brief summary of products in this category..."
                  className="w-full p-3 text-xs sm:text-sm bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:border-[#4A1513] focus:outline-none transition font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                    Display Order
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={categoryModal.data.displayOrder ?? 1}
                    onChange={e => setCategoryModal(prev => ({
                      ...prev,
                      data: { ...prev.data, displayOrder: Number(e.target.value) }
                    }))}
                    className="w-full h-11 px-3.5 text-xs sm:text-sm bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:border-[#4A1513] focus:outline-none transition font-bold"
                  />
                  <p className="text-[10px] text-stone-400 mt-1">Order in navigation bar</p>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                    Active Status
                  </label>
                  <label className="flex items-center gap-2.5 h-11 px-3 bg-stone-50 border border-stone-200 rounded-xl cursor-pointer">
                    <input
                      type="checkbox"
                      checked={categoryModal.data.isActive ?? true}
                      onChange={e => setCategoryModal(prev => ({
                        ...prev,
                        data: { ...prev.data, isActive: e.target.checked }
                      }))}
                      className="w-4 h-4 accent-[#4A1513] rounded cursor-pointer"
                    />
                    <span className="text-xs font-semibold text-stone-700">
                      Visible in Shop
                    </span>
                  </label>
                </div>
              </div>

              <div className="pt-3 flex items-center justify-end gap-3 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setCategoryModal(prev => ({ ...prev, isOpen: false }))}
                  className="px-4 py-2.5 rounded-xl border border-stone-200 text-stone-600 hover:bg-stone-50 text-xs font-semibold transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2.5 rounded-xl bg-[#4A1513] text-white hover:bg-[#350B0A] text-xs font-bold tracking-wide transition shadow-xs cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? "Saving..." : categoryModal.mode === "CREATE" ? "Create Category" : "Update Category"}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

      {/* MODAL 2: ADD / EDIT SUBCATEGORY */}
      {subcategoryModal.isOpen && (
        <div className="fixed inset-0 z-50 bg-stone-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-stone-200 relative animate-in fade-in zoom-in-95 duration-150">
            
            <button
              type="button"
              onClick={() => setSubcategoryModal(prev => ({ ...prev, isOpen: false }))}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-stone-100 text-stone-500 hover:bg-stone-200 flex items-center justify-center transition cursor-pointer"
            >
              <X size={16} />
            </button>

            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-700 flex items-center justify-center">
                <FolderPlus size={20} />
              </div>
              <div>
                <h3 className="font-serif text-xl font-bold text-stone-900">
                  {subcategoryModal.mode === "CREATE" ? "Add Subcategory" : "Edit Subcategory"}
                </h3>
                <p className="text-xs text-stone-500">
                  {subcategoryModal.mode === "CREATE"
                    ? "Add a new subcategory item under a main department."
                    : `Editing ${subcategoryModal.data.name}`}
                </p>
              </div>
            </div>

            {modalError && (
              <div className="mb-4 p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs flex items-center gap-2">
                <AlertCircle size={15} className="shrink-0" />
                <span>{modalError}</span>
              </div>
            )}

            <form onSubmit={handleSaveSubcategory} className="space-y-4">
              
              {/* Parent Category Selection */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                  Parent Category <span className="text-rose-600">*</span>
                </label>
                <select
                  value={subcategoryModal.categoryId}
                  onChange={e => setSubcategoryModal(prev => ({
                    ...prev,
                    categoryId: Number(e.target.value)
                  }))}
                  className="w-full h-11 px-3.5 text-xs sm:text-sm bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:border-[#4A1513] focus:outline-none transition font-medium cursor-pointer"
                  required
                >
                  {categories.map(c => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Subcategory Name */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                  Subcategory Name <span className="text-rose-600">*</span>
                </label>
                <input
                  type="text"
                  value={subcategoryModal.data.name || ""}
                  onChange={e => setSubcategoryModal(prev => ({
                    ...prev,
                    data: { ...prev.data, name: e.target.value }
                  }))}
                  placeholder="e.g. Anarkali Suits or Handcrafted Bangles"
                  className="w-full h-11 px-3.5 text-xs sm:text-sm bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:border-[#4A1513] focus:outline-none transition font-medium"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                    Display Order
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={subcategoryModal.data.displayOrder ?? 1}
                    onChange={e => setSubcategoryModal(prev => ({
                      ...prev,
                      data: { ...prev.data, displayOrder: Number(e.target.value) }
                    }))}
                    className="w-full h-11 px-3.5 text-xs sm:text-sm bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:border-[#4A1513] focus:outline-none transition font-bold"
                  />
                  <p className="text-[10px] text-stone-400 mt-1">Order in dropdown list</p>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                    Active Status
                  </label>
                  <label className="flex items-center gap-2.5 h-11 px-3 bg-stone-50 border border-stone-200 rounded-xl cursor-pointer">
                    <input
                      type="checkbox"
                      checked={subcategoryModal.data.isActive ?? true}
                      onChange={e => setSubcategoryModal(prev => ({
                        ...prev,
                        data: { ...prev.data, isActive: e.target.checked }
                      }))}
                      className="w-4 h-4 accent-[#4A1513] rounded cursor-pointer"
                    />
                    <span className="text-xs font-semibold text-stone-700">
                      Active
                    </span>
                  </label>
                </div>
              </div>

              <div className="pt-3 flex items-center justify-end gap-3 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setSubcategoryModal(prev => ({ ...prev, isOpen: false }))}
                  className="px-4 py-2.5 rounded-xl border border-stone-200 text-stone-600 hover:bg-stone-50 text-xs font-semibold transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2.5 rounded-xl bg-[#4A1513] text-white hover:bg-[#350B0A] text-xs font-bold tracking-wide transition shadow-xs cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? "Saving..." : subcategoryModal.mode === "CREATE" ? "Create Subcategory" : "Update Subcategory"}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
}
