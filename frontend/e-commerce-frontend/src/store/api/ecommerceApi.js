import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const ecommerceApi = createApi({
  reducerPath: 'ecommerceApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:8080/api',
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth.token;

      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }

      return headers;
    },
  }),
  tagTypes: ['Producto', 'Categoria', 'Carrito'],
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (credentials) => ({
        url: '/auth/login',
        method: 'POST',
        body: credentials,
      }),
    }),

    register: builder.mutation({
      query: (usuario) => ({
        url: '/auth/register',
        method: 'POST',
        body: usuario,
      }),
    }),

    getProductos: builder.query({
      query: () => '/productos',
      providesTags: ['Producto'],
    }),

    getProductoById: builder.query({
      query: (id) => `/productos/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Producto', id }],
    }),

    getProductosByCategoria: builder.query({
      query: (categoriaId) => `/productos/categoria/${categoriaId}`,
      providesTags: ['Producto'],
    }),

    crearProducto: builder.mutation({
      query: (formData) => ({
        url: '/productos',
        method: 'POST',
        body: formData,
      }),
      invalidatesTags: ['Producto'],
    }),

    editarProducto: builder.mutation({
      query: ({ id, formData }) => ({
        url: `/productos/${id}`,
        method: 'PUT',
        body: formData,
      }),
      invalidatesTags: (_result, _error, { id }) => [{ type: 'Producto', id }, 'Producto'],
    }),

    eliminarProducto: builder.mutation({
      query: (id) => ({
        url: `/productos/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Producto'],
    }),

    checkoutProductos: builder.mutation({
      query: (items) => ({
        url: '/productos/checkout',
        method: 'POST',
        body: items,
        responseHandler: 'text',
      }),
      invalidatesTags: ['Producto'],
    }),

    getCategorias: builder.query({
      query: () => '/categorias',
      providesTags: ['Categoria'],
    }),

    getCarrito: builder.query({
      query: (usuarioId) => `/carrito/${usuarioId}`,
      providesTags: ['Carrito'],
    }),

    agregarAlCarritoBackend: builder.mutation({
      query: ({ usuarioId, productoId, cantidad }) => ({
        url: '/carrito/agregar',
        method: 'POST',
        params: { usuarioId, productoId, cantidad },
        responseHandler: 'text',
      }),
      invalidatesTags: ['Carrito'],
    }),

    eliminarCarritoItem: builder.mutation({
      query: (itemId) => ({
        url: `/carrito/eliminar/${itemId}`,
        method: 'DELETE',
        responseHandler: 'text',
      }),
      invalidatesTags: ['Carrito'],
    }),

    vaciarCarritoBackend: builder.mutation({
      query: (usuarioId) => ({
        url: `/carrito/vaciar/${usuarioId}`,
        method: 'DELETE',
        responseHandler: 'text',
      }),
      invalidatesTags: ['Carrito'],
    }),

    checkoutCarrito: builder.mutation({
      query: (usuarioId) => ({
        url: `/carrito/checkout/${usuarioId}`,
        method: 'POST',
        responseHandler: 'text',
      }),
      invalidatesTags: ['Carrito', 'Producto'],
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useGetProductosQuery,
  useGetProductoByIdQuery,
  useGetProductosByCategoriaQuery,
  useLazyGetProductosQuery,
  useLazyGetProductosByCategoriaQuery,
  useCrearProductoMutation,
  useEditarProductoMutation,
  useEliminarProductoMutation,
  useCheckoutProductosMutation,
  useGetCategoriasQuery,
  useGetCarritoQuery,
  useAgregarAlCarritoBackendMutation,
  useEliminarCarritoItemMutation,
  useVaciarCarritoBackendMutation,
  useCheckoutCarritoMutation,
} = ecommerceApi;
