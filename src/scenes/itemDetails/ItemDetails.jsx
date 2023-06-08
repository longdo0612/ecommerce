import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { IconButton, Box, Typography, Button, Tabs, Tab } from '@mui/material';
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { shades } from '../../theme';
import { addToCart } from '../../state';
import { useParams } from 'react-router-dom';
import Item from '../../components/Item';

const ItemDetails = () => {
  const dispatch = useDispatch();
  const { itemId } = useParams();
  const [value, setValue] = useState('description');
  const [count, setCount] = useState(1);
  const [item, setItem] = useState(null);
  const [items, setItems] = useState([]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const getItem = async () => {
    const res = await fetch(
      `https://ecommerce-gced.onrender.com/api/items/${itemId}?populate=image`,
      {
        method: 'GET',
      }
    );

    const item = await res.json();

    setItem(item.data);
  };

  const getItems = async () => {
    const res = await fetch(
      'https://ecommerce-gced.onrender.com/api/items?populate=image',
      {
        method: 'GET',
      }
    );

    const items = await res.json();

    setItems(items.data);
  };

  useEffect(() => {
    getItem();
    getItems();
  }, [itemId]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Box width='80%' m='80px auto'>
      <Box display='flex' flexWrap='wrap' columnGap='40px'>
        <Box flex='1 1 40%' mb='40px'>
          <img
            src={
              item?.attributes?.image?.data?.attributes?.formats?.medium?.url
            }
            alt={item?.name}
            width='100%'
            style={{ objectFit: 'cover' }}
          />
        </Box>

        {/* ACTION */}
        <Box flex='1 1 50%' mb='40px'>
          <Box display='flex' justifyContent='space-between'>
            <Box>Home/Item</Box>
            <Box>Prev Next</Box>
          </Box>

          <Box m='65px 0 25px 0'>
            <Typography variant='h3'>{item?.attributes?.name}</Typography>
            <Typography>${item?.attributes?.price}</Typography>
            <Typography sx={{ mt: '20px' }}>
              {item?.attributes?.longDescription}
            </Typography>
          </Box>

          <Box display='flex' alignItems='center' minHeight='50px'>
            <Box
              display='flex'
              alignItems='center'
              border={`1.5px solid ${shades.neutral[300]}`}
              mr='20px'
              p='2px 5px'
            >
              <IconButton
                onClick={() => setCount((state) => Math.max(state - 1, 1))}
              >
                <RemoveIcon />
              </IconButton>

              <Typography sx={{ p: '0 5px' }}>{count}</Typography>

              <IconButton onClick={() => setCount((state) => state + 1)}>
                <AddIcon />
              </IconButton>
            </Box>

            <Button
              sx={{
                backgroundColor: '#222',
                color: '#fff',
                borderRadius: 0,
                minWidth: '150px',
                padding: '10px 40px',
              }}
              onClick={() => dispatch(addToCart({ item: { ...item, count } }))}
            >
              ADD TO CART
            </Button>
          </Box>

          <Box>
            <Box m='20px 0 5px 0' display='flex'>
              <FavoriteBorderOutlinedIcon />
              <Typography sx={{ ml: '5px' }}>ADD TO WISH LIST</Typography>
            </Box>
            <Typography>CATEGORIES: {item?.attributes?.category}</Typography>
          </Box>
        </Box>
      </Box>

      <Box m='20px 0'>
        <Tabs value={value} onChange={handleChange}>
          <Tab label='DESCRIPTION' value='description'></Tab>
          <Tab label='REVIEWS' value='reviews'></Tab>
        </Tabs>
      </Box>

      <Box display='flex' flexWrap='wrap' gap='15px'>
        {value === 'description' && (
          <div>{item?.attributes?.longDescription}</div>
        )}

        {value === 'reviews' && <div>All reviews (not implemented)</div>}
      </Box>

      <Box mt='50px' width='100%'>
        <Typography variant='h3' fontWeight='bold'>
          Related Products
        </Typography>

        <Box
          mt='20px'
          display='flex'
          flexWrap='wrap'
          columnGap='1.33%'
          justifyContent='space-between'
        >
          {items.slice(0, 4).map((item, index) => (
            <Item key={`${item.name}-${index}`} item={item} />
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default ItemDetails;
