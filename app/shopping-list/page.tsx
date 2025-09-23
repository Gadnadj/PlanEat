"use client"
import ActionButton from '@/components/ShoppingList/ActionButtons'
import Headers from '@/components/ShoppingList/Headers'
import CategoryFilters from '@/components/ShoppingList/ShoppingList/CategoryFilters'
import ShoppingItem from '@/components/ShoppingList/ShoppingList/ShoppingItem'
import StatSection from '@/components/ShoppingList/StatSection'
import Summary from '@/components/ShoppingList/Summary'
import ProtectedRoute from '@/components/ProtectedRoute'
import { useAuth } from '@/contexts/AuthContext'
import React, { useState, useEffect, useCallback } from 'react'

interface ShoppingItemData {
  _id: string;
  name: string;
  category: string;
  quantity?: string;
  isCompleted: boolean;
  createdAt: string;
  updatedAt: string;
}

const ShoppingListPage = () => {
    const { token } = useAuth();
    const [items, setItems] = useState<ShoppingItemData[]>([]);
    const [loading, setLoading] = useState(true);
    const [newItemName, setNewItemName] = useState('');
    const [newItemCategory, setNewItemCategory] = useState('Autres');
    const [newItemQuantity, setNewItemQuantity] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('Toutes');
    const [editingItem, setEditingItem] = useState<string | null>(null);
    const [editQuantity, setEditQuantity] = useState('');

    const categories = ['Toutes', 'Fruits & Légumes', 'Viandes & Poissons', 'Produits laitiers', 'Épicerie', 'Boulangerie', 'Boissons', 'Autres'];

    const loadItems = useCallback(async () => {
        if (!token) return;
        
        try {
            const response = await fetch('/api/shopping-list', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            
            if (response.ok) {
                const data = await response.json();
                if (data.success) {
                    setItems(data.items);
                }
            }
        } catch (error) {
            console.error('Erreur lors du chargement des articles:', error);
        } finally {
            setLoading(false);
        }
    }, [token]);

    useEffect(() => {
        if (token) {
            loadItems();
        }
    }, [token, loadItems]);

    const addItem = async () => {
        if (!newItemName.trim() || !token) return;

        try {
            const response = await fetch('/api/shopping-list', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    name: newItemName.trim(),
                    category: newItemCategory,
                    quantity: newItemQuantity.trim() || undefined
                })
            });

            if (response.ok) {
                const data = await response.json();
                if (data.success) {
                    setItems(prev => [data.item, ...prev]);
                    setNewItemName('');
                    setNewItemQuantity('');
                    setNewItemCategory('Autres');
                }
            }
        } catch (error) {
            console.error('Erreur lors de l\'ajout de l\'article:', error);
        }
    };

    const toggleItem = async (id: string, isCompleted: boolean) => {
        if (!token) return;

        try {
            const response = await fetch(`/api/shopping-list/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ isCompleted: !isCompleted })
            });

            if (response.ok) {
                setItems(prev => prev.map(item => 
                    item._id === id ? { ...item, isCompleted: !isCompleted } : item
                ));
            }
        } catch (error) {
            console.error('Erreur lors de la mise à jour de l\'article:', error);
        }
    };

    const deleteItem = async (id: string) => {
        if (!token) return;

        try {
            const response = await fetch(`/api/shopping-list/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                setItems(prev => prev.filter(item => item._id !== id));
            }
        } catch (error) {
            console.error('Erreur lors de la suppression de l\'article:', error);
        }
    };

    const deleteAllItems = async () => {
        if (!token || !confirm('Êtes-vous sûr de vouloir supprimer tous les articles ?')) return;

        try {
            const response = await fetch('/api/shopping-list', {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                setItems([]);
            }
        } catch (error) {
            console.error('Erreur lors de la suppression de tous les articles:', error);
        }
    };

    const startEdit = (item: ShoppingItemData) => {
        setEditingItem(item._id);
        setEditQuantity(item.quantity || '');
    };

    const saveEdit = async (id: string) => {
        if (!token) return;

        try {
            const response = await fetch(`/api/shopping-list/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ quantity: editQuantity.trim() || undefined })
            });

            if (response.ok) {
                setItems(prev => prev.map(item => 
                    item._id === id ? { ...item, quantity: editQuantity.trim() || undefined } : item
                ));
                setEditingItem(null);
                setEditQuantity('');
            }
        } catch (error) {
            console.error('Erreur lors de la modification de l\'article:', error);
        }
    };

    const cancelEdit = () => {
        setEditingItem(null);
        setEditQuantity('');
    };

    const filteredItems = selectedCategory === 'Toutes' 
        ? items 
        : items.filter(item => item.category === selectedCategory);

    const completedCount = items.filter(item => item.isCompleted).length;
    const remainingCount = items.length - completedCount;

    if (loading) {
        return (
            <ProtectedRoute>
                <div className="min-h-screen bg-gradient-to-br from-[#0f172a] to-[#1e293b] flex items-center justify-center">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#3b82f6] mx-auto mb-4"></div>
                        <p className="text-white text-lg">Chargement de votre liste de courses...</p>
                    </div>
                </div>
            </ProtectedRoute>
        );
    }

    return (
        <ProtectedRoute>
            <>
            <Headers />

            <section className='max-w-[1400px] mx-auto pt-0 px-8 pb-8 flex gap-4 items-center justify-between flex-wrap max-md:flex-col max-md:gap-4  max-sm:pl-4 max-sm:pr-4'>
                <StatSection 
                    totalItems={items.length}
                    completedItems={completedCount}
                    remainingItems={remainingCount}
                />
                <ActionButton onDeleteAll={deleteAllItems} />
            </section>

            <div className='max-w-[1400px] mx-auto pt-0 py-8 px-8 grid grid-cols-[1fr_300px] gap-8 max-lg:grid-cols-1 max-md:pt-0 max-md:px-4 max-md:pb-8  max-sm:pl-4 max-sm:pr-4'>
                <section className='bg-[#2a2a2a] rounded-[15px] p-8 shadow-[0_4px_15px_rgba(0,0,0,0.2)]'>
                    <div className='flex justify-between items-center mb-2'>
                        <h2 className='text-[#3b82f6] text-[1.5rem] font-bold'>Ma liste de courses</h2>
                    </div>

                    <div className='flex gap-2 mb-8 max-sm:flex-col'>
                        <input 
                            className='flex-1 bg-[#3a3a3a] border-2 border-[#505050] rounded-[10px] p-[0.8rem] text-[#e0e0e0] text-[1rem] transition-colors duration-300 ease-in-out focus:outline-none focus:border-[#3b82f6]' 
                            type="text" 
                            placeholder="Nom de l'article..." 
                            value={newItemName}
                            onChange={(e) => setNewItemName(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && addItem()}
                        />
                        <select 
                            className='bg-[#3a3a3a] border-2 border-[#505050] rounded-[10px] p-[0.8rem] text-[#e0e0e0] text-[1rem] transition-colors duration-300 ease-in-out focus:outline-none focus:border-[#3b82f6]'
                            value={newItemCategory}
                            onChange={(e) => setNewItemCategory(e.target.value)}
                        >
                            {categories.slice(1).map(category => (
                                <option key={category} value={category}>{category}</option>
                            ))}
                        </select>
                        <input 
                            className='bg-[#3a3a3a] border-2 border-[#505050] rounded-[10px] p-[0.8rem] text-[#e0e0e0] text-[1rem] transition-colors duration-300 ease-in-out focus:outline-none focus:border-[#3b82f6] w-24' 
                            type="text" 
                            placeholder='Qté' 
                            value={newItemQuantity}
                            onChange={(e) => setNewItemQuantity(e.target.value)}
                        />
                        <button 
                            className='bg-gradient-to-br from-[#3b82f6] to-[#64748b] text-white border-none py-[0.8rem] px-6 rounded-[10px] cursor-pointer font-bold transition-all duration-300 ease-in-out hover:scale-105'
                            onClick={addItem}
                            disabled={!newItemName.trim()}
                        >
                            ➕ Ajouter
                        </button>
                    </div>

                    <CategoryFilters 
                        categories={categories}
                        selectedCategory={selectedCategory}
                        onCategoryChange={setSelectedCategory}
                    />

                    <div className='flex flex-col gap-2'>
                        {filteredItems.length === 0 ? (
                            <div className="text-center py-8 text-gray-400">
                                {selectedCategory === 'Toutes' 
                                    ? 'Aucun article dans votre liste' 
                                    : `Aucun article dans la catégorie "${selectedCategory}"`
                                }
                            </div>
                        ) : (
                            filteredItems.map((item) => (
                                <ShoppingItem 
                                    key={item._id}
                                    item={item}
                                    onToggle={() => toggleItem(item._id, item.isCompleted)}
                                    onDelete={() => deleteItem(item._id)}
                                    onEdit={() => startEdit(item)}
                                    isEditing={editingItem === item._id}
                                    editQuantity={editQuantity}
                                    onEditQuantityChange={setEditQuantity}
                                    onSaveEdit={() => saveEdit(item._id)}
                                    onCancelEdit={cancelEdit}
                                />
                            ))
                        )}
                    </div>
                </section>

                <aside className='flex flex-col gap-6 max-lg:grid max-lg:grid-cols-[repaeat(auto-fit,_minmax(250px,_1fr))] max-md:grid-cols-1'>
                    <Summary 
                        totalItems={items.length}
                        completedItems={completedCount}
                    />
                </aside>
            </div>
            </>
        </ProtectedRoute>
    )
}

export default ShoppingListPage