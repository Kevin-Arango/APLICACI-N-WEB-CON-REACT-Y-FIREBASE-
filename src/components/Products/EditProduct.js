import React, { useState, useEffect } from 'react';
import { firestore, storage } from '../../firebase/config';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import './ProductForm.css';

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [quantity, setQuantity] = useState(0);
  const [price, setPrice] = useState(0);
  const [image, setImage] = useState(null);
  const [imageUrl, setImageUrl] = useState('');

  useEffect(() => {
    const fetchProduct = async () => {
      const productDoc = doc(firestore, 'products', id);
      const productData = await getDoc(productDoc);
      if (productData.exists()) {
        const product = productData.data();
        setName(product.name);
        setDescription(product.description);
        setQuantity(product.quantity);
        setPrice(product.price);
        setImageUrl(product.imageUrl);
      } else {
        toast.error('Producto no encontrado');
        navigate('/products');
      }
    };

    fetchProduct();
  }, [id, navigate]);

  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const productDoc = doc(firestore, 'products', id);
      let updatedProduct = {
        name,
        description,
        quantity,
        price,
      };

      if (image) {
        const imageRef = ref(storage, `products/${image.name}`);
        await uploadBytes(imageRef, image);
        const url = await getDownloadURL(imageRef);
        updatedProduct.imageUrl = url;
      }

      await updateDoc(productDoc, updatedProduct);
      toast.success('Producto actualizado satisfactoriamente');
      navigate('/products');
    } catch (error) {
      console.error('Error updating product: ', error);
      toast.error('Error al actualizar el producto');
    }
  };

  return (
    <div className="product-form-container">
      <form onSubmit={handleSubmit}>
        <h2>Editar Producto</h2>
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
            onChange={handleImageChange}
          />
          {imageUrl && <img src={imageUrl} alt="Product" className="product-image-preview" />}
        </div>
        <div className="button-group">
          <button type="submit">Guardar Cambios</button>
          <button type="button" className="back-button" onClick={() => navigate('/products')}>
            Regresar a la Lista de Productos
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditProduct;
