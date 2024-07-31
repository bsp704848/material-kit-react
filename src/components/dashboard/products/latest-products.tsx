
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
import { collection, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from '../../../../server/lib/firebase';
import Link from 'next/link';
import { type SxProps } from '@mui/material';

export interface Product {
  id: string;
  imageUrl: string;
  productName: string;
  company: string;
  location: string;
  price: string;
  quantity: number;
  updatedAt: Date;
}

export interface LatestProductsProps {
  sx?: SxProps;
  searchTerm: string; // Add searchTerm prop
}

export function LatestProducts({ sx, searchTerm }: LatestProductsProps): React.JSX.Element {
  const [products, setProducts] = useState<Product[]>([]);
  const [open, setOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteProduct, setDeleteProduct] = useState<Product | null>(null);

  useEffect(() => {
    const fetchProducts = async (): Promise<void> => {
      const querySnapshot = await getDocs(collection(db, 'products'));
      const productsData = querySnapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          quantity: data.quantity || 1, // Handle default quantity
          updatedAt: data.createdAt ? data.createdAt.toDate() : new Date(), // Convert Firestore timestamp to Date object
        };
      }) as Product[];
      setProducts(productsData);
    };

    void fetchProducts();
  }, []);

  const handleClickOpen = (product: Product): void => {
    setSelectedProduct(product);
    setQuantity(product.quantity); // Set the initial quantity
    setOpen(true);
  };

  const handleClose = (): void => {
    setOpen(false);
    setSelectedProduct(null);
    setQuantity(1);
  };

  const handleQuantityChange = (amount: number): void => {
    setQuantity((prevQuantity) => Math.max(1, prevQuantity + amount));
  };

  const deleteProductById = async (id: string): Promise<void> => {
    await deleteDoc(doc(db, 'products', id));
    setProducts(products.filter((product) => product.id !== id));
  };

  const updateProductQuantity = async (productId: string, newQuantity: number): Promise<void> => {
    const productRef = doc(db, 'products', productId);
    await updateDoc(productRef, { quantity: newQuantity });
    setProducts((prevProducts) =>
      prevProducts.map((product) =>
        product.id === productId ? { ...product, quantity: newQuantity } : product
      )
    );
  };

  // Filter products based on search term
  const filteredProducts = products.filter((product) =>
    product.productName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Card sx={sx}>
      <CardHeader title="Latest products" />
      <Divider />
      <List>
        {filteredProducts.map((product, index) => (
          <ListItem
            divider={index < filteredProducts.length - 1}
            key={product.id}
            sx={{ display: 'flex', alignItems: 'center' }}
          >
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
                <Box display="flex" alignItems="center" justifyContent="space-between">
                  <Box flexDirection="column">
                    <Box mr={2} display="flex" gap="20px" alignItems="center">
                      <Typography component="span" variant="body2" color="text.primary">
                        Company: {product.company}
                      </Typography>
                      <Typography component="span" variant="body2" color="text.secondary">
                        Quantity: {product.quantity}
                      </Typography>
                      <Typography component="span" variant="body2" color="text.secondary">
                        {product.location}
                      </Typography>
                    </Box>
                    <Box mr={2} display="flex" gap="20px" alignItems="center">
                      <Typography component="span" variant="body2" color="text.secondary">
                        ${product.price}
                      </Typography>
                      <Typography component="span" variant="body2" color="text.secondary">
                        Updated {dayjs(product.updatedAt).format('MMM D, YYYY')}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              }
            />
            <Button variant="outlined" onClick={() => { handleClickOpen(product); }}>
              Update stock
            </Button>
            <Link href={`/dashboard/products/edit?id=${product.id}`}>
              <IconButton edge="end">
                <DotsThreeVerticalIcon weight="bold" />
              </IconButton>
            </Link>
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
      {selectedProduct ? (
  <Dialog open={open} onClose={handleClose} >
    <DialogTitle>Product Details</DialogTitle>
    <DialogContent>
      <Box display="flex" flexDirection="column" alignItems="center" sx={{mx: 'auto', width: 250}}>
        <Box
          component="img"
          src={selectedProduct.imageUrl}
          sx={{ borderRadius: 0.5, height: '150px', width: '200px', mb: 2 ,  }}
        />
        <Typography variant="h6" textAlign="center">
          {selectedProduct.productName}
        </Typography>
        <Typography variant="body2" textAlign="center">
          Company: {selectedProduct.company}
        </Typography>
        <Typography variant="body2" textAlign="center">
          Location: {selectedProduct.location}
        </Typography>
        <Typography variant="body2" textAlign="center">
          Price: ${selectedProduct.price}
        </Typography>
        <Typography variant="body2" textAlign="center" mb={2}>
          Quantity: {selectedProduct.quantity}
        </Typography>
      </Box>
      <Box mt={2} display="flex" justifyContent="center" alignItems="center">
      <Button
        variant="outlined"
        onClick={() => {
          handleQuantityChange(-1);
        }}
        sx={{ width: '40px', height: '40px', minWidth: 'unset', padding: 0 }}
      >
          -
        </Button>
        <TextField
          value={quantity}
          sx={{ width: '50px', textAlign: 'center', mx: 2 }}
          onChange={(e) => { setQuantity(Number(e.target.value)); }}
        />
        <Button
          variant="outlined"
          onClick={() => {
            handleQuantityChange(1);
          }}
          sx={{ width: '40px', height: '40px', minWidth: 'unset', padding: 0 }}
        >
          +
        </Button>
      </Box>
    </DialogContent>
    <DialogActions sx={{ justifyContent: 'center' }}>
      <Button onClick={handleClose}>Close</Button>
      <Button
        variant="contained"
        color="primary"
        onClick={async () => {
          if (selectedProduct) {
            await updateProductQuantity(selectedProduct.id, quantity);
            handleClose();
          }
        }}
      >
        Update stock
      </Button>
    </DialogActions>
  </Dialog>
) : null}

      <Dialog open={deleteOpen} onClose={() => { setDeleteOpen(false); }}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this product?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => { setDeleteOpen(false); }}>Cancel</Button>
          <Button
            variant="contained"
            color="secondary"
            onClick={async () => {
              if (deleteProduct) {
                await deleteProductById(deleteProduct.id);
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
