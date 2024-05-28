import React, { useState } from 'react';
import { firestore } from '../../firebase/config';
import { collection, addDoc } from 'firebase/firestore';
import './ProductForm.css';

const ProductForm = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [quantity, setQuantity] = useState(0);
  const [price, setPrice] = useState(0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const productsCollection = collection(firestore, 'products');
      await addDoc(productsCollection, {
        name,
        description,
        quantity,
        price
      });
      setName('');
      setDescription('');
      setQuantity(0);
      setPrice(0);
    } catch (error) {
      console.error("Error adding product: ", error);
    }
  };

  return (
    <div className="product-form-container">
      <form onSubmit={handleSubmit}>
        <h2>Agregar Producto</h2>
        <div>
          <label>Nombre del Producto</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nombre del Producto"
            required
          />
        </div>
        <div>
          <label>Descripción</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Descripción"
            required
          ></textarea>
        </div>
        <div>
          <label>Cantidad</label>
          <input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            placeholder="Cantidad"
            required
          />
        </div>
        <div>
          <label>Precio</label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="Precio"
            required
          />
        </div>
        <button type="submit">Agregar Producto</button>
      </form>
    </div>
  );
};

export default ProductForm;
