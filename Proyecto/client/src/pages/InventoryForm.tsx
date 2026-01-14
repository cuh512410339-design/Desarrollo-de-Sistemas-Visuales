import React, { useState } from 'react';
import './InventoryForm.css';

const InventoryForm: React.FC = () => {
    const [itemName, setItemName] = useState('');
    const [itemQuantity, setItemQuantity] = useState('');
    const [itemDescription, setItemDescription] = useState('');
    const [items, setItems] = useState<{ name: string, quantity: number, description: string }[]>([]);
    const [errors, setErrors] = useState({
        itemName: '',
        itemQuantity: '',
        itemDescription: ''
    });

    const validateForm = () => {
        const newErrors = { itemName: '', itemQuantity: '', itemDescription: '' };
        let isValid = true;

        if (!itemName.trim()) {
            newErrors.itemName = 'Item name is required.';
            isValid = false;
        }

        if (!itemQuantity.trim() || isNaN(Number(itemQuantity))) {
            newErrors.itemQuantity = 'Quantity must be a number.';
            isValid = false;
        }

        if (!itemDescription.trim()) {
            newErrors.itemDescription = 'Description is required.';
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleAddItem = () => {
        if (validateForm()) {
            const existingItemIndex = items.findIndex(item => item.name === itemName);

            if (existingItemIndex !== -1) {
                const updatedItems = [...items];
                updatedItems[existingItemIndex].quantity += parseInt(itemQuantity, 10);
                setItems(updatedItems);
            } else {
                setItems([...items, { name: itemName, quantity: parseInt(itemQuantity, 10), description: itemDescription }]);
            }

            setItemName('');
            setItemQuantity('');
            setItemDescription('');
            setErrors({ itemName: '', itemQuantity: '', itemDescription: '' });
        }
    };

    const handleClearForm = () => {
        setItemName('');
        setItemQuantity('');
        setItemDescription('');
        setErrors({ itemName: '', itemQuantity: '', itemDescription: '' });
    };

    const handleClearList = () => {
        setItems([]);
    };

    return (
        <div className="inventory-form">
            <h1>Formulario de inventario</h1>
            <div className="form-group">
                <label htmlFor="item-name">Nombre del objeto:</label>
                <input
                    type="text"
                    id="item-name"
                    value={itemName}
                    onChange={(e) => setItemName(e.target.value)}
                />
                {errors.itemName && <div className="error">{errors.itemName}</div>}
            </div>
            <div className="form-group">
                <label htmlFor="item-quantity">Cantidad:</label>
                <input
                    type="text"
                    id="item-quantity"
                    value={itemQuantity}
                    onChange={(e) => setItemQuantity(e.target.value)}
                />
                {errors.itemQuantity && <div className="error">{errors.itemQuantity}</div>}
            </div>
            <div className="form-group">
                <label htmlFor="item-description">Descripción:</label>
                <textarea
                    id="item-description"
                    value={itemDescription}
                    onChange={(e) => setItemDescription(e.target.value)}
                ></textarea>
                {errors.itemDescription && <div className="error">{errors.itemDescription}</div>}
            </div>
            <div className="button-group">
                <button onClick={handleAddItem}>Añadir objeto</button>
                <button onClick={handleClearForm}>Limpiar formulario</button>
                <button onClick={handleClearList}>Limpiar lista</button>
            </div>
            <table>
                <thead>
                    <tr>
                        <th>Cantidad</th>
                        <th>Nombre</th>
                        <th>Descripción</th>
                    </tr>
                </thead>
                <tbody>
                    {items.map((item, index) => (
                        <tr key={index}>
                            <td>{item.quantity}</td>
                            <td>{item.name}</td>
                            <td>{item.description}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default InventoryForm;