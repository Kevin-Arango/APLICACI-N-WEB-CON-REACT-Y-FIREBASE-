import React, { useState } from 'react';
import { firestore, storage } from '../../firebase/config';
import { collection, addDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import './ProductForm.css';

const ProductForm = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [quantity, setQuantity] = useState(0);
  const [price, setPrice] = useState(0);
  const [image, setImage] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let imageUrl = '';
      if (image) {
        const storageRef = ref(storage, `products/${image.name}`);
        await uploadBytes(storageRef, image);
        imageUrl = await getDownloadURL(storageRef);
      }
      const productsCollection = collection(firestore, 'products');
      await addDoc(productsCollection, {
        name,
        description,
        quantity,
        price,
        imageUrl,
      });
      setName('');
      setDescription('');
      setQuantity(0);
      setPrice(0);
      setImage(null);
      toast.success('Producto agregado satisfactoriamente');
      navigate('/products');
    } catch (error) {
      console.error("Error adding product: ", error);
      toast.error('Error al agregar el producto');
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
        <div>
          <label>Imagen del Producto</label>
          <input
            type="file"
            onChange={(e) => setImage(e.target.files[0])}
            accept="image/*"
          />
        </div>
        <div className="button-group">
          <button type="submit">Agregar Producto</button>
          <button type="button" className="back-button" onClick={() => navigate('/products')}>
            Regresar a la Lista de Productos
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProductForm;
