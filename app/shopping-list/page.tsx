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
  id: string;
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
    const [newItemCategory, setNewItemCategory] = useState('Other');
    const [newItemQuantity, setNewItemQuantity] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [editingItem, setEditingItem] = useState<string | null>(null);
    const [editQuantity, setEditQuantity] = useState('');

    const categories = ['All', 'Fruits & Vegetables', 'Meat & Fish', 'Dairy Products', 'Groceries', 'Bakery', 'Beverages', 'Other'];

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
            console.error('Error loading items:', error);
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
                    setNewItemCategory('Other');
                }
            }
        } catch (error) {
            console.error('Error adding item:', error);
        }
    };

    const toggleItem = async (id: string, isCompleted: boolean) => {
        if (!token || !id) return;

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
                    item.id === id ? { ...item, isCompleted: !isCompleted } : item
                ));
            }
        } catch (error) {
            console.error('Error updating item:', error);
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
                setItems(prev => prev.filter(item => item.id !== id));
            }
        } catch (error) {
            console.error('Error deleting item:', error);
        }
    };

    const deleteAllItems = async () => {
        if (!token || !confirm('Are you sure you want to delete all items?')) return;

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
            console.error('Error deleting all items:', error);
        }
    };

    const startEdit = (item: ShoppingItemData) => {
        setEditingItem(item.id);
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
                    item.id === id ? { ...item, quantity: editQuantity.trim() || undefined } : item
                ));
                setEditingItem(null);
                setEditQuantity('');
            }
        } catch (error) {
            console.error('Error updating item:', error);
        }
    };

    const cancelEdit = () => {
        setEditingItem(null);
        setEditQuantity('');
    };

    const printList = () => {
        const printWindow = window.open('', '_blank');
        if (!printWindow) return;

        const completedItems = items.filter(item => item.isCompleted);
        const remainingItems = items.filter(item => !item.isCompleted);

        const printContent = `
            <!DOCTYPE html>
            <html>
            <head>
                <title>Shopping List - Plan Eat</title>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        margin: 20px;
                        background: white;
                        color: black;
                    }
                    .header {
                        text-align: center;
                        margin-bottom: 30px;
                        border-bottom: 2px solid #3b82f6;
                        padding-bottom: 20px;
                    }
                    .header h1 {
                        color: #3b82f6;
                        margin: 0;
                        font-size: 28px;
                    }
                    .header p {
                        color: #666;
                        margin: 10px 0 0 0;
                    }
                    .stats {
                        display: flex;
                        justify-content: space-around;
                        margin-bottom: 30px;
                        padding: 15px;
                        background: #f5f5f5;
                        border-radius: 8px;
                    }
                    .stat {
                        text-align: center;
                    }
                    .stat-value {
                        font-size: 24px;
                        font-weight: bold;
                        color: #3b82f6;
                    }
                    .stat-label {
                        font-size: 14px;
                        color: #666;
                    }
                    .section {
                        margin-bottom: 30px;
                    }
                    .section-title {
                        font-size: 20px;
                        font-weight: bold;
                        margin-bottom: 15px;
                        padding: 10px;
                        background: #3b82f6;
                        color: white;
                        border-radius: 5px;
                    }
                    .item {
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        padding: 8px 0;
                        border-bottom: 1px solid #eee;
                    }
                    .item-name {
                        font-weight: bold;
                    }
                    .item-quantity {
                        color: #666;
                        font-style: italic;
                    }
                    .item-category {
                        background: #e3f2fd;
                        color: #1976d2;
                        padding: 2px 8px;
                        border-radius: 12px;
                        font-size: 12px;
                        margin-right: 10px;
                    }
                    .completed {
                        text-decoration: line-through;
                        opacity: 0.6;
                    }
                    .footer {
                        margin-top: 40px;
                        text-align: center;
                        color: #666;
                        font-size: 12px;
                    }
                    @media print {
                        body { margin: 0; }
                        .no-print { display: none; }
                    }
                </style>
            </head>
            <body>
                <div class="header">
                    <h1>🛒 My Shopping List</h1>
                    <p>Generated on ${new Date().toLocaleDateString('en-US', { 
                        weekday: 'long', 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                    })}</p>
                </div>

                <div class="stats">
                    <div class="stat">
                        <div class="stat-value">${items.length}</div>
                        <div class="stat-label">Total</div>
                    </div>
                    <div class="stat">
                        <div class="stat-value">${completedItems.length}</div>
                        <div class="stat-label">Purchased</div>
                    </div>
                    <div class="stat">
                        <div class="stat-value">${remainingItems.length}</div>
                        <div class="stat-label">Remaining</div>
                    </div>
                </div>

                ${remainingItems.length > 0 ? `
                <div class="section">
                    <div class="section-title">📝 To Buy (${remainingItems.length})</div>
                    ${remainingItems.map(item => `
                        <div class="item">
                            <div>
                                <span class="item-category">${item.category}</span>
                                <span class="item-name">${item.name}</span>
                            </div>
                            ${item.quantity ? `<span class="item-quantity">${item.quantity}</span>` : ''}
                        </div>
                    `).join('')}
                </div>
                ` : ''}

                ${completedItems.length > 0 ? `
                <div class="section">
                    <div class="section-title">✅ Already Purchased (${completedItems.length})</div>
                    ${completedItems.map(item => `
                        <div class="item completed">
                            <div>
                                <span class="item-category">${item.category}</span>
                                <span class="item-name">${item.name}</span>
                            </div>
                            ${item.quantity ? `<span class="item-quantity">${item.quantity}</span>` : ''}
                        </div>
                    `).join('')}
                </div>
                ` : ''}

                <div class="footer">
                    <p>Generated by Plan Eat - Your personal nutrition assistant</p>
                </div>
            </body>
            </html>
        `;

        printWindow.document.write(printContent);
        printWindow.document.close();
        printWindow.focus();
        printWindow.print();
        printWindow.close();
    };

    const filteredItems = selectedCategory === 'All' 
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
                        <p className="text-white text-lg">Loading your shopping list...</p>
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
                {/* <StatSection 
                    totalItems={items.length}
                    completedItems={completedCount}
                    remainingItems={remainingCount}
                /> */}
                <ActionButton onDeleteAll={deleteAllItems} onPrint={printList} />
            </section>

            <div className='max-w-[1400px] mx-auto pt-0 py-8 px-8 grid grid-cols-[1fr_300px] gap-8 max-lg:grid-cols-1 max-md:pt-0 max-md:px-4 max-md:pb-8  max-sm:pl-4 max-sm:pr-4'>
                <section className='bg-[#2a2a2a] rounded-[15px] p-8 shadow-[0_4px_15px_rgba(0,0,0,0.2)]'>
                    <div className='flex justify-between items-center mb-2'>
                        <h2 className='text-[#3b82f6] text-[1.5rem] font-bold'>My Shopping List</h2>
                    </div>

                    <div className='flex gap-2 mb-8 max-sm:flex-col'>
                        <input 
                            className='flex-1 bg-[#3a3a3a] border-2 border-[#505050] rounded-[10px] p-[0.8rem] text-[#e0e0e0] text-[1rem] transition-colors duration-300 ease-in-out focus:outline-none focus:border-[#3b82f6]' 
                            type="text" 
                            placeholder="Item name..." 
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
                            placeholder='Qty' 
                            value={newItemQuantity}
                            onChange={(e) => setNewItemQuantity(e.target.value)}
                        />
                        <button 
                            className='bg-gradient-to-br from-[#3b82f6] to-[#64748b] text-white border-none py-[0.8rem] px-6 rounded-[10px] cursor-pointer font-bold transition-all duration-300 ease-in-out hover:scale-105'
                            onClick={addItem}
                            disabled={!newItemName.trim()}
                        >
                            ➕ Add
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
                                {selectedCategory === 'All' 
                                    ? 'No items in your list' 
                                    : `No items in category "${selectedCategory}"`
                                }
                            </div>
                        ) : (
                            filteredItems.map((item) => (
                                <ShoppingItem 
                                    key={item.id}
                                    item={item}
                                    onToggle={() => toggleItem(item.id, item.isCompleted)}
                                    onDelete={() => deleteItem(item.id)}
                                    onEdit={() => startEdit(item)}
                                    isEditing={editingItem === item.id}
                                    editQuantity={editQuantity}
                                    onEditQuantityChange={setEditQuantity}
                                    onSaveEdit={() => saveEdit(item.id)}
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