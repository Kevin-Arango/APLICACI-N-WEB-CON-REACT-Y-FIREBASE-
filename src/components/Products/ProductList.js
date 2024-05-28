import React, { useEffect, useState } from 'react';
import { firestore } from '../../firebase/config';
import { collection, onSnapshot, doc, deleteDoc } from 'firebase/firestore';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import './ProductList.css'; 

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const productsCollection = collection(firestore, 'products');
    const unsubscribe = onSnapshot(productsCollection, (snapshot) => {
      const productsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setProducts(productsData);
    }, (error) => {
      console.error("Error fetching products: ", error);
    });

    return unsubscribe;
  }, []);

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm('¿Está seguro de que desea eliminar este producto?');
    if (confirmDelete) {
      try {
        const productDoc = doc(firestore, 'products', id);
        await deleteDoc(productDoc);
        toast.success('Producto eliminado satisfactoriamente');
      } catch (error) {
        console.error("Error deleting product: ", error);
        toast.error('Error al eliminar el producto');
      }
    }
  };

  const filteredProducts = products.filter(product => {
    return product.name.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <div className="product-list-container">
      <h1>Lista de Productos</h1>
      <div className="search-container">
        <input
          type="text"
          placeholder="Buscar por nombre"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <Link to="/add-product" className="add-product-button">Agregar Producto</Link>
      {filteredProducts.length > 0 ? (
        <table className="product-table">
          <thead>
            <tr>
              <th>Imagen</th>
              <th>Nombre</th>
              <th>Descripción</th>
              <th>Cantidad</th>
              <th>Precio</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map(product => (
              <tr key={product.id}>
                <td><img src={product.imageUrl} alt={product.name} className="product-image" /></td>
                <td>{product.name}</td>
                <td>{product.description}</td>
                <td>{product.quantity}</td>
                <td>${product.price}</td>
                <td>
                  <div className="action-buttons">
                    <Link to={`/edit-product/${product.id}`} className="edit-button">Editar</Link>
                    <button onClick={() => handleDelete(product.id)} className="delete-button">Eliminar</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No hay productos disponibles.</p>
      )}
    </div>
  );
};

export default ProductList;
