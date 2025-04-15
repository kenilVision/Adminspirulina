import React, { useState } from "react";
import axios from "axios";

const Home = () => {
  const [product, setProduct] = useState({
    name: "",
    description: "",
    category: "",
    ratings: 0,
    isVariantBased: true,
    variants: [
      {
        label: "",
        price: "",
        stock: "",
        quantity: 1,
        images: [],
        discount: 0,
        originalPrice: ""
      }
    ],
  });

  const handleProductChange = (e) => {
    const { name, value } = e.target;
    setProduct((prev) => ({ ...prev, [name]: value }));
  };

  const handleVariantChange = (index, e) => {
    const { name, value } = e.target;
    setProduct(prev => {
      const updatedVariants = [...prev.variants];
      updatedVariants[index] = { ...updatedVariants[index], [name]: value };
      return { ...prev, variants: updatedVariants };
    });
  };

  const handleAddVariant = () => {
    setProduct(prev => ({
      ...prev,
      variants: [
        ...prev.variants,
        {
          label: "",
          price: "",
          stock: "",
          quantity: 1,
          images: [],
          discount: 0,
          originalPrice: ""
        }
      ]
    }));
  };

  const handleRemoveVariant = (index) => {
    setProduct(prev => ({
      ...prev,
      variants: prev.variants.filter((_, i) => i !== index)
    }));
  };

  const handleImageUpload = async (index, e) => {
    const files = Array.from(e.target.files);
    
    const imagePreviews = await Promise.all(
      files.map(file => {
        return new Promise((resolve) => {
          const reader = new FileReader();
          reader.onload = (e) => resolve({
            file,
            preview: e.target.result,
            name: file.name
          });
          reader.readAsDataURL(file);
        });
      })
    );

    setProduct(prev => {
      const updatedVariants = [...prev.variants];
      updatedVariants[index] = { 
        ...updatedVariants[index], 
        images: [...updatedVariants[index].images, ...imagePreviews]
      };
      return { ...prev, variants: updatedVariants };
    });
  };

  const handleRemoveImage = (variantIndex, imageIndex) => {
    setProduct(prev => {
      const updatedVariants = [...prev.variants];
      updatedVariants[variantIndex] = { 
        ...updatedVariants[variantIndex],
        images: updatedVariants[variantIndex].images.filter((_, i) => i !== imageIndex)
      };
      return { ...prev, variants: updatedVariants };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...product,
        ratings: Number(product.ratings),
        variants: product.variants.map(variant => ({
          ...variant,
          price: Number(variant.price),
          originalPrice: Number(variant.originalPrice),
          discount: Number(variant.discount),
          stock: Number(variant.stock),
          quantity: Number(variant.quantity),
          images: variant.images.map(img => img.name)
        })),
        category: product.category,
        quantity: 1,
        discount: 0,
        originalPrice: 0,
        price: null,
        images: [],
        stock: null,
      };

      const res = await axios.post("/api/products", payload);
      console.log("Product added:", res.data);
      alert("Product added successfully!");
      
      // Reset form
      setProduct({
        name: "",
        description: "",
        category: "",
        ratings: 0,
        isVariantBased: true,
        variants: [{
          label: "",
          price: "",
          stock: "",
          quantity: 1,
          images: [],
          discount: 0,
          originalPrice: ""
        }],
      });
    } catch (err) {
      console.error("Error adding product:", err);
      alert("Something went wrong while adding the product.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="p-6 bg-gradient-to-r from-blue-500 to-indigo-600 text-white">
            <h2 className="text-2xl font-bold">Add New Product</h2>
            <p className="text-blue-100">Fill in the details below to create a new product</p>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Product Information Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-700 border-b pb-2">Product Information</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700">Product Name</label>
                  <input
                    type="text"
                    name="name"
                    value={product.name}
                    onChange={handleProductChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700">Category</label>
                  <input
                    type="text"
                    name="category"
                    value={product.category}
                    onChange={handleProductChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <textarea
                  name="description"
                  value={product.description}
                  onChange={handleProductChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
            </div>

            {/* Variants Section */}
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-700">Product Variants</h3>
                <button
                  type="button"
                  onClick={handleAddVariant}
                  className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <svg className="-ml-0.5 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                  </svg>
                  Add Variant
                </button>
              </div>

              {product.variants.map((variant, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4 shadow-sm">
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="font-medium text-gray-800">Variant #{index + 1}</h4>
                    {product.variants.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveVariant(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                      </button>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="block text-sm font-medium text-gray-700">Label</label>
                      <input
                        type="text"
                        name="label"
                        placeholder="e.g. 100g, 500ml"
                        value={variant.label}
                        onChange={(e) => handleVariantChange(index, e)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="block text-sm font-medium text-gray-700">Price</label>
                      <input
                        type="number"
                        name="price"
                        value={variant.price}
                        onChange={(e) => handleVariantChange(index, e)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="block text-sm font-medium text-gray-700">Original Price</label>
                      <input
                        type="number"
                        name="originalPrice"
                        value={variant.originalPrice}
                        onChange={(e) => handleVariantChange(index, e)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="block text-sm font-medium text-gray-700">Stock</label>
                      <input
                        type="number"
                        name="stock"
                        value={variant.stock}
                        onChange={(e) => handleVariantChange(index, e)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="block text-sm font-medium text-gray-700">Discount (%)</label>
                      <input
                        type="number"
                        name="discount"
                        value={variant.discount}
                        onChange={(e) => handleVariantChange(index, e)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>
                  </div>

                  <div className="mt-4 space-y-1">
                    <label className="block text-sm font-medium text-gray-700">Images</label>
                    <div className="flex items-center gap-2">
                      <label className="flex flex-col items-center justify-center w-full px-4 py-6 bg-white text-blue-500 rounded-lg border-2 border-dashed border-gray-300 cursor-pointer hover:bg-gray-50">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span className="mt-2 text-sm font-medium">Upload Images</span>
                        <input 
                          type="file" 
                          multiple 
                          accept="image/*" 
                          onChange={(e) => handleImageUpload(index, e)} 
                          className="hidden" 
                        />
                      </label>
                    </div>

                    {variant.images.length > 0 && (
                      <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                        {variant.images.map((image, imgIndex) => (
                          <div key={imgIndex} className="relative group">
                            <img 
                              src={image.preview} 
                              alt={image.name} 
                              className="w-full h-32 object-cover rounded-lg border border-gray-200"
                            />
                            <button
                              type="button"
                              onClick={() => handleRemoveImage(index, imgIndex)}
                              className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                              </svg>
                            </button>
                            <div className="text-xs text-gray-500 truncate mt-1">{image.name}</div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-end pt-4">
              <button
                type="submit"
                className="px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                Save Product
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Home;