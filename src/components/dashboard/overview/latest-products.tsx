'use client';
import React, { useReducer, useEffect, useMemo, useCallback } from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';
import {
  Box, Button, Card, CardActions, CardHeader, Divider, IconButton,
  List, ListItem, ListItemAvatar, ListItemText, Dialog, DialogActions,
  DialogContent, DialogTitle, Typography, TextField, TablePagination,
  CircularProgress
} from '@mui/material';
import { ArrowRight, DotsThreeVertical } from '@phosphor-icons/react';
import DeleteIcon from '@mui/icons-material/Delete';
import dayjs from 'dayjs';
import { collection, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from '../../../../server/lib/firebase';
import { paths } from '@/paths';

const initialState = {
  products: [],
  loading: true,
  page: 0,
  rowsPerPage: 5,
  selectedProduct: null,
  deleteProduct: null,
  quantity: 1,
};

function productsReducer(state, action) {
  switch (action.type) {
    case 'SET_PRODUCTS':
      return { ...state, products: action.payload };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_PAGE':
      return { ...state, page: action.payload };
    case 'SET_ROWS_PER_PAGE':
      return { ...state, rowsPerPage: action.payload };
    case 'SET_SELECTED_PRODUCT':
      return { ...state, selectedProduct: action.payload, quantity: action.payload ? action.payload.quantity : 1 };
    case 'SET_DELETE_PRODUCT':
      return { ...state, deleteProduct: action.payload };
    case 'SET_QUANTITY':
      return { ...state, quantity: action.payload };
    default:
      return state;
  }
}

const ProductListItem = React.memo(({ product, onUpdate, onDelete, onEdit }) => {
  return (
    <ListItem divider sx={{ display: 'flex', alignItems: 'center' }}>
      <ListItemAvatar>
        {product.imageUrl ? (
          <Box
            component="img"
            src={product.imageUrl}
            sx={{ borderRadius: 1, height: '48px', width: '48px' }}
          />
        ) : (
          <Box
            sx={{
              borderRadius: 1,
              backgroundColor: 'neutral.500',
              height: '48px',
              width: '48px',
            }}
          />
        )}
      </ListItemAvatar>
      <ListItemText
        primary={product.productName}
        primaryTypographyProps={{ variant: 'subtitle1' }}
        secondary={
          <Box display="flex" flexDirection="column">
            <Box display="flex" gap="20px" alignItems="center">
              <Typography variant="body2" color="text.primary">
                Company: {product.company}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Quantity: {product.quantity}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {product.location}
              </Typography>
            </Box>
            <Box display="flex" gap="20px" alignItems="center">
              <Typography variant="body2" color="text.secondary">
                ${product.price}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Updated {dayjs(product.updatedAt).format('MMM D, YYYY')}
              </Typography>
            </Box>
          </Box>
        }
      />
      <Button variant="outlined" onClick={() => onUpdate(product)}>
        Update stock
      </Button>
      <Link href={`/dashboard/products/edit?id=${product.id}`} passHref>
        <IconButton edge="end" onClick={() => onEdit(product.id)}>
          <DotsThreeVertical weight="bold" />
        </IconButton>
      </Link>
      <IconButton edge="end" onClick={() => onDelete(product)}>
        <DeleteIcon />
      </IconButton>
    </ListItem>
  );
});

const UpdateQuantityDialog = ({ product, open, onClose, onUpdate, quantity, setQuantity }) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Product Details</DialogTitle>
      <DialogContent>
        <TextField
          margin="dense"
          label="Quantity"
          type="number"
          fullWidth
          value={quantity}
          onChange={(e) => setQuantity(parseInt(e.target.value, 10))}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={() => onUpdate(product.id, quantity)}>
          Update
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const DeleteConfirmationDialog = ({ product, open, onClose, onDelete }) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Delete Product</DialogTitle>
      <DialogContent>
        Are you sure you want to delete this product: {product?.productName}?
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={() => onDelete(product.id)}>
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export function LatestProducts({ sx, searchTerm, limit, paginate = false }) {
  const [state, dispatch] = useReducer(productsReducer, initialState);
  const { products, loading, page, rowsPerPage, selectedProduct, deleteProduct, quantity } = state;

  useEffect(() => {
    const fetchProducts = async () => {
      dispatch({ type: 'SET_LOADING', payload: true });
      const querySnapshot = await getDocs(collection(db, 'products'));
      const productsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        quantity: doc.data().quantity || 1,
        updatedAt: doc.data().createdAt ? doc.data().createdAt.toDate() : new Date(),
      }));
      dispatch({ type: 'SET_PRODUCTS', payload: productsData });
      dispatch({ type: 'SET_LOADING', payload: false });
    };

    fetchProducts();
  }, []);

  const filteredProducts = useMemo(() =>
    products.filter(product =>
      product.productName.toLowerCase().includes(searchTerm.toLowerCase())
    ),
    [products, searchTerm]
  );

  const paginatedProducts = useMemo(() =>
    filteredProducts.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
    [filteredProducts, page, rowsPerPage]
  );

  const handleUpdateProduct = useCallback(async (productId, newQuantity) => {
    const productRef = doc(db, 'products', productId);
    await updateDoc(productRef, { quantity: newQuantity });
    dispatch({ type: 'SET_PRODUCTS', payload: products.map(p =>
      p.id === productId ? { ...p, quantity: newQuantity } : p
    )});
    dispatch({ type: 'SET_SELECTED_PRODUCT', payload: null });
  }, [products]);

  const handleDeleteProduct = useCallback(async (productId) => {
    await deleteDoc(doc(db, 'products', productId));
    dispatch({ type: 'SET_PRODUCTS', payload: products.filter(p => p.id !== productId) });
    dispatch({ type: 'SET_DELETE_PRODUCT', payload: null });
  }, [products]);

  const handlePageChange = (_, newPage) => {
    dispatch({ type: 'SET_PAGE', payload: newPage });
  };

  const handleRowsPerPageChange = (event) => {
    dispatch({ type: 'SET_ROWS_PER_PAGE', payload: parseInt(event.target.value, 10) });
    dispatch({ type: 'SET_PAGE', payload: 0 });
  };

  return (
    <Card sx={sx}>
      <CardHeader
        title="Latest products"
        action={
          <Typography variant="subtitle1" color="text.secondary">
            {searchTerm ? `${filteredProducts.length} items found` : `${products.length} items`}
          </Typography>
        }
      />
      <Divider />
      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" height="100%">
          <CircularProgress />
        </Box>
      ) : (
        <>
          <List>
            {paginatedProducts.length === 0 ? (
              <ListItem>
                <ListItemText primary="No items found" />
              </ListItem>
            ) : (
              paginatedProducts.map((product) => (
                <ProductListItem
                  key={product.id}
                  product={product}
                  onUpdate={() => dispatch({ type: 'SET_SELECTED_PRODUCT', payload: product })}
                  onDelete={() => dispatch({ type: 'SET_DELETE_PRODUCT', payload: product })}
                  onEdit={() => {/* handle edit */}}
                />
              ))
            )}
          </List>
          {!paginate && (
            <>
              <Divider />
              <CardActions sx={{ justifyContent: 'flex-end' }}>
                <Button
                  color="inherit"
                  endIcon={<ArrowRight fontSize="small" />}
                  size="small"
                  variant="text"
                  component={Link}
                  href={paths.dashboard.products}
                >
                  View all
                </Button>
              </CardActions>
            </>
          )}
          {paginate && (
            <TablePagination
              component="div"
              count={filteredProducts.length}
              page={page}
              onPageChange={handlePageChange}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={handleRowsPerPageChange}
              rowsPerPageOptions={[5, 10, 25]}
            />
          )}
        </>
      )}
      <UpdateQuantityDialog
        product={selectedProduct}
        open={!!selectedProduct}
        onClose={() => dispatch({ type: 'SET_SELECTED_PRODUCT', payload: null })}
        onUpdate={handleUpdateProduct}
        quantity={quantity}
        setQuantity={(newQuantity) => dispatch({ type: 'SET_QUANTITY', payload: newQuantity })}
      />
      <DeleteConfirmationDialog
        product={deleteProduct}
        open={!!deleteProduct}
        onClose={() => dispatch({ type: 'SET_DELETE_PRODUCT', payload: null })}
        onDelete={handleDeleteProduct}
      />
    </Card>
  );
}

LatestProducts.propTypes = {
  sx: PropTypes.object,
  searchTerm: PropTypes.string.isRequired,
  limit: PropTypes.number,
  paginate: PropTypes.bool,
};
