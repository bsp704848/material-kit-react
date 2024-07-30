'use client';
import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardHeader from '@mui/material/CardHeader';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import type { SxProps } from '@mui/material/styles';
import { ArrowRight as ArrowRightIcon } from '@phosphor-icons/react/dist/ssr/ArrowRight';
import { DotsThreeVertical as DotsThreeVerticalIcon } from '@phosphor-icons/react/dist/ssr/DotsThreeVertical';
import dayjs from 'dayjs';
import DeleteIcon from '@mui/icons-material/Delete';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../../../../server/lib/firebase';

export interface Product {
  id: string;
  imageUrl: string;
  productName: string;
  company: string;
  location: string;
  price: string;
  quantity: string;
  updatedAt: Date;
}

export interface LatestProductsProps {
  sx?: SxProps;
}

export function LatestProducts({ sx }: LatestProductsProps): React.JSX.Element {
  const [products, setProducts] = useState<Product[]>([]);
  const [open, setOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteProduct, setDeleteProduct] = useState<Product | null>(null);


  useEffect(() => {
    const fetchProducts = async () => {
      const querySnapshot = await getDocs(collection(db, 'products'));
      const productsData = querySnapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          updatedAt: data.createdAt ? data.createdAt.toDate() : new Date(), // Convert Firestore timestamp to Date object
        };
      }) as Product[];
      setProducts(productsData);
    };

    fetchProducts();
  }, []);

  const handleClickOpen = (product: Product) => {
    setSelectedProduct(product);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedProduct(null);
    setQuantity(1);
  };

  const handleQuantityChange = (amount: number) => {
    setQuantity((prevQuantity) => Math.max(1, prevQuantity + amount));
  };
  const deleteProductById = async (id: string) => {
    await deleteDoc(doc(db, 'products', id));
    setProducts(products.filter((product) => product.id !== id));
  };

  return (
    <Card sx={sx}>
      <CardHeader title="Latest products" />
      <Divider />
      <List>
        {products.map((product, index) => (
          <ListItem divider={index < products.length - 1} key={product.id} onClick={() => { handleClickOpen(product); }}>
            <ListItemAvatar>
              {product.imageUrl ? (
                <Box component="img" src={product.imageUrl} sx={{ borderRadius: 1, height: '48px', width: '48px' }} />
              ) : (
                <Box
                  sx={{
                    borderRadius: 1,
                    backgroundColor: 'var(--mui-palette-neutral-500)',
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
                <>
                  <Typography component="span" variant="body2" color="text.primary">
                    {product.company}
                  </Typography>
                  <br />
                  <Typography component="span" variant="body2" color="text.secondary">
                    {product.location}
                  </Typography>
                  <br />
                  <Typography component="span" variant="body2" color="text.secondary">
                    {product.quantity}
                  </Typography>
                  <br />
                  <Typography component="span" variant="body2" color="text.secondary">
                    ₹{product.price}
                  </Typography>
                  <br />
                  <Typography component="span" variant="body2" color="text.secondary">
                    Updated {dayjs(product.updatedAt).format('MMM D, YYYY')}
                  </Typography>
                </>
              }
            />
            <IconButton edge="end">
              <DotsThreeVerticalIcon weight="bold" />
            </IconButton>
            <IconButton
              edge="end"
              onClick={(e) => {
                e.stopPropagation();
                setDeleteProduct(product);
                setDeleteOpen(true);
              }}
            >
              <DeleteIcon />
            </IconButton>
          </ListItem>
        ))}
      </List>
      <Divider />
      <CardActions sx={{ justifyContent: 'flex-end' }}>
        <Button
          color="inherit"
          endIcon={<ArrowRightIcon fontSize="var(--icon-fontSize-md)" />}
          size="small"
          variant="text"
        >
          View all
        </Button>
      </CardActions>
      {selectedProduct ? <Dialog open={open} onClose={handleClose}>
          <DialogTitle>Product Details</DialogTitle>
          <DialogContent>
            <Box display="flex" alignItems="center">
              <Box component="img" src={selectedProduct.imageUrl} sx={{ borderRadius: 1, height: '100px', width: '100px' }} />
              <Box ml={2}>
                <Typography variant="h6">{selectedProduct.productName}</Typography>
                <Typography variant="body2">Company: {selectedProduct.company}</Typography>
                <Typography variant="body2">Location: {selectedProduct.location}</Typography>
                <Typography variant="body2">Price: ₹{selectedProduct.price}</Typography>
                <Typography variant='body2'>Quantity: {selectedProduct.quantity}</Typography>
              </Box>
            </Box>
            <Box mt={2} display="flex" alignItems="center">
              <Button variant="outlined" onClick={() => { handleQuantityChange(-1); }}>-</Button>
              <TextField value={quantity} sx={{ width: '50px', textAlign: 'center', mx: 2 }} />
              <Button variant="outlined" onClick={() => { handleQuantityChange(1); }}>+</Button>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Close</Button>
            <Button variant="contained" color="primary">Add to Cart</Button>
          </DialogActions>
        </Dialog> : null}
        <Dialog
          open={deleteOpen}
          onClose={() => setDeleteOpen(false)}
        >
          <DialogTitle>Are you sure you want to delete this product?</DialogTitle>
          <DialogContent>
            <Typography variant="body2">
              Product: {deleteProduct?.productName}
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDeleteOpen(false)}>Cancel</Button>
            <Button
              color="secondary"
              onClick={() => {
                if (deleteProduct) {
                  // Call the function to delete the product here
                  deleteProductById(deleteProduct.id);
                  setDeleteOpen(false);
                }
              }}
            >
              Delete
            </Button>
          </DialogActions>
        </Dialog>

    </Card>
  );
}
