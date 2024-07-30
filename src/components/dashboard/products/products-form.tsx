'use client';
import * as React from 'react';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Divider from '@mui/material/Divider';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import Alert from '@mui/material/Alert';
import IconButton from '@mui/material/IconButton';
import HomeIcon from '@mui/icons-material/Home';
import { useRouter } from 'next/navigation';
import { db, storage } from '../../../../server/lib/firebase'; // Ensure you import storage
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';

export function ProductForm(): React.JSX.Element {
  const [formValues, setFormValues] = React.useState({
    productName: '',
    price: '',
    quantity: '',
    company: '',
    description: '',
    location: '',
    imageUrl: '' // Add imageUrl to formValues
  });
  const [alert, setAlert] = React.useState<string | null>(null);
  const [imageFile, setImageFile] = React.useState<File | null>(null); // State to hold the selected image file
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | { name?: string | undefined; value: unknown; }>) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form values:", formValues); // Debugging line

    if (imageFile) {
      const storageRef = ref(storage, `products/${imageFile.name}`);
      const uploadTask = uploadBytesResumable(storageRef, imageFile);

      uploadTask.on('state_changed',
        (snapshot) => {
          // Progress function ...
        },
        (error) => {
          console.error("Error uploading image: ", error);
          setAlert("Error uploading image!");
        },
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          setFormValues({ ...formValues, imageUrl: downloadURL });

          try {
            const docRef = await addDoc(collection(db, "products"), {
              ...formValues,
              imageUrl: downloadURL, // Save the image URL
              createdAt: serverTimestamp() // Add createdAt field with server timestamp
            });
            console.log("Document written with ID: ", docRef.id);
            setAlert("Product added successfully!");
          } catch (e) {
            console.error("Error adding document: ", e);
            setAlert("Error adding product!");
          }
        }
      );
    } else {
      setAlert("Please upload an image.");
    }
  };

  return (
    <div>
      <IconButton onClick={() => router.push('/')}>
        <HomeIcon />
      </IconButton>
      {alert && <Alert severity={alert.includes("successfully") ? "success" : "error"}>{alert}</Alert>}
      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader subheader="Add a new product" title="Product" />
          <Divider />
          <CardContent>
            <Stack spacing={3} sx={{ maxWidth: 'sm' }}>
              <FormControl fullWidth>
                <InputLabel>Product Name</InputLabel>
                <OutlinedInput
                  label="Product Name"
                  name="productName"
                  value={formValues.productName}
                  onChange={handleChange}
                />
              </FormControl>
              <FormControl fullWidth>
                <InputLabel>Cost</InputLabel>
                <OutlinedInput
                  label="Cost"
                  name="price"
                  value={formValues.price}
                  onChange={handleChange}
                  type="number"
                />
              </FormControl>
              <FormControl fullWidth>
                <InputLabel>Quantity</InputLabel>
                <OutlinedInput
                  label="Quantity"
                  name="quantity"
                  value={formValues.quantity}
                  onChange={handleChange}
                  type="number"
                />
              </FormControl>
              <FormControl fullWidth>
                <InputLabel>Company</InputLabel>
                <OutlinedInput
                  label="Company"
                  name="company"
                  value={formValues.company}
                  onChange={handleChange}
                />
              </FormControl>
              <FormControl fullWidth>
                <InputLabel>Description</InputLabel>
                <OutlinedInput
                  label="Description"
                  name="description"
                  value={formValues.description}
                  onChange={handleChange}
                  multiline
                  rows={4}
                />
              </FormControl>
              <FormControl fullWidth>
                <InputLabel>Location</InputLabel>
                <Select
                  label="Location"
                  name="location"
                  value={formValues.location}
                  onChange={handleChange}
                >
                  <MenuItem value="Location 1">Location 1</MenuItem>
                  <MenuItem value="Location 2">Location 2</MenuItem>
                  <MenuItem value="Location 3">Location 3</MenuItem>
                </Select>
              </FormControl>
              <FormControl fullWidth>
                <InputLabel>Image</InputLabel>
                <OutlinedInput
                  type="file"
                  onChange={handleImageChange}
                />
              </FormControl>
            </Stack>
          </CardContent>
          <Divider />
          <CardActions sx={{ justifyContent: 'flex-end' }}>
            <Button type="submit" variant="contained">Save</Button>
          </CardActions>
        </Card>
      </form>
    </div>
  );
}
