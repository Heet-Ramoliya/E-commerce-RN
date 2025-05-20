// Mock order data
const orders = [
  {
    id: 'ORD-10001',
    userId: '1',
    date: new Date('2023-11-20T14:32:11'),
    status: 'Delivered',
    items: [
      {
        productId: '1',
        name: 'Premium Wireless Headphones',
        price: 299.99,
        quantity: 1,
        image: 'https://images.pexels.com/photos/577769/pexels-photo-577769.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      },
      {
        productId: '9',
        name: 'Wireless Earbuds',
        price: 129.99,
        quantity: 1,
        image: 'https://images.pexels.com/photos/3780681/pexels-photo-3780681.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      }
    ],
    subtotal: 429.98,
    shipping: 10.00,
    tax: 34.40,
    total: 474.38,
    shippingAddress: {
      name: 'John Doe',
      street: '123 Main Street',
      city: 'New York',
      state: 'NY',
      zip: '10001',
      country: 'United States'
    },
    paymentMethod: 'Credit Card (ending in 4242)'
  },
  {
    id: 'ORD-10002',
    userId: '1',
    date: new Date('2023-12-05T09:15:43'),
    status: 'Delivered',
    items: [
      {
        productId: '4',
        name: 'Professional Camera Kit',
        price: 1299.99,
        quantity: 1,
        image: 'https://images.pexels.com/photos/90946/pexels-photo-90946.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      }
    ],
    subtotal: 1299.99,
    shipping: 0.00, // Free shipping
    tax: 104.00,
    total: 1403.99,
    shippingAddress: {
      name: 'John Doe',
      street: '123 Main Street',
      city: 'New York',
      state: 'NY',
      zip: '10001',
      country: 'United States'
    },
    paymentMethod: 'PayPal'
  },
  {
    id: 'ORD-10003',
    userId: '1',
    date: new Date('2024-01-15T16:45:22'),
    status: 'Processing',
    items: [
      {
        productId: '8',
        name: 'Smart Home Security System',
        price: 399.99,
        quantity: 1,
        image: 'https://images.pexels.com/photos/430208/pexels-photo-430208.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      },
      {
        productId: '12',
        name: 'Smart Robot Vacuum',
        price: 349.99,
        quantity: 1,
        image: 'https://images.pexels.com/photos/844874/pexels-photo-844874.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      }
    ],
    subtotal: 749.98,
    shipping: 15.00,
    tax: 60.00,
    total: 824.98,
    shippingAddress: {
      name: 'John Doe',
      street: '123 Main Street',
      city: 'New York',
      state: 'NY',
      zip: '10001',
      country: 'United States'
    },
    paymentMethod: 'Credit Card (ending in 4242)'
  },
  {
    id: 'ORD-10004',
    userId: '2',
    date: new Date('2023-12-15T11:32:11'),
    status: 'Delivered',
    items: [
      {
        productId: '5',
        name: 'Ergonomic Office Chair',
        price: 249.99,
        quantity: 1,
        image: 'https://images.pexels.com/photos/1957478/pexels-photo-1957478.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      },
      {
        productId: '7',
        name: 'Designer Leather Backpack',
        price: 149.99,
        quantity: 1,
        image: 'https://images.pexels.com/photos/934673/pexels-photo-934673.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      }
    ],
    subtotal: 399.98,
    shipping: 10.00,
    tax: 32.00,
    total: 441.98,
    shippingAddress: {
      name: 'Jane Smith',
      street: '456 Oak Avenue',
      city: 'Los Angeles',
      state: 'CA',
      zip: '90001',
      country: 'United States'
    },
    paymentMethod: 'Credit Card (ending in 8888)'
  }
];

export const getUserOrders = (userId) => {
  return orders.filter(order => order.userId === userId);
};

export const getOrderById = (orderId) => {
  return orders.find(order => order.id === orderId);
};

export const createOrder = (order) => {
  // In a real app, this would make an API call
  // For now, we'll just generate an ID and add to our array
  const newOrder = {
    ...order,
    id: `ORD-${10000 + orders.length + 1}`,
    date: new Date(),
  };
  
  orders.push(newOrder);
  return newOrder;
};