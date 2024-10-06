document.addEventListener('DOMContentLoaded', function () {
  const userForm = document.getElementById('userForm');
  const orderForm = document.getElementById('orderForm');
  const userTable = document.getElementById('userTable').querySelector('tbody');
  const orderTable = document.getElementById('orderTable').querySelector('tbody');

  // Funciones globales para manejar CRUD de usuarios
  window.deleteUser = async function (id) {
    console.log('Intentando eliminar usuario con ID:', id);
    try {
      const res = await fetch(`http://localhost:3000/api/users/${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        alert('Usuario eliminado correctamente');
        fetchUsers(); // Actualiza la lista de usuarios
      } else {
        alert('Error al eliminar el usuario');
      }
    } catch (error) {
      console.error('Error al eliminar usuario:', error);
      alert('Hubo un problema al eliminar el usuario');
    }
  };

  window.editUser = async function (id) {
    console.log('Editando usuario con ID:', id);
    const res = await fetch(`http://localhost:3000/api/users/${id}`);
    const user = await res.json();
    
    document.getElementById('userId').value = user._id;
    document.getElementById('userName').value = user.name;
    document.getElementById('userEmail').value = user.email;
    document.getElementById('userPhone').value = user.phone;
    document.getElementById('userAddress').value = user.address;

    document.getElementById('submitUser').textContent = 'Actualizar Usuario';
  };

  async function fetchUsers() {
    const res = await fetch('http://localhost:3000/api/users');
    const users = await res.json();
    console.log(users); // Verifica si los usuarios están siendo recuperados correctamente
    userTable.innerHTML = '';
    users.forEach(user => {
      userTable.innerHTML += `
        <tr>
          <td>${user._id}</td>
          <td>${user.name}</td>
          <td>${user.email}</td>
          <td>${user.phone}</td>
          <td>${user.address}</td>
          <td>
            <button class="edit" onclick="editUser('${user._id}')">Editar</button>
            <button class="delete" onclick="deleteUser('${user._id}')">Eliminar</button>
          </td>
        </tr>
      `;
    });
  }

  // Funciones globales para manejar CRUD de órdenes
  window.deleteOrder = async function (id) {
    console.log('Intentando eliminar orden con ID:', id);
    try {
      const res = await fetch(`http://localhost:3000/api/orders/${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        alert('Orden eliminada correctamente');
        fetchOrders(); // Actualiza la lista de órdenes
      } else {
        alert('Error al eliminar la orden');
      }
    } catch (error) {
      console.error('Error al eliminar orden:', error);
      alert('Hubo un problema al eliminar la orden');
    }
  };

  window.editOrder = async function (id) {
    console.log('Editando orden con ID:', id);
    const res = await fetch(`http://localhost:3000/api/orders/${id}`);
    const order = await res.json();

    document.getElementById('orderId').value = order._id;
    document.getElementById('orderUser').value = typeof order.user === 'string' ? order.user : order.user._id; // Manejo de caso ID o objeto de usuario
    document.getElementById('orderProduct').value = order.products[0].productName;
    document.getElementById('orderQuantity').value = order.products[0].quantity;
    document.getElementById('orderTotal').value = order.total;
    document.getElementById('orderDate').value = new Date(order.deliveryDate).toISOString().substr(0, 10);

    document.getElementById('submitOrder').textContent = 'Actualizar Orden';
  };

  async function fetchOrders() {
    const res = await fetch('http://localhost:3000/api/orders');
    const orders = await res.json();
    console.log(orders); // Verifica si las órdenes están siendo recuperadas correctamente
    orderTable.innerHTML = '';
    orders.forEach(order => {
      const userId = typeof order.user === 'string' ? order.user : order.user._id; // Maneja ambos casos: si `order.user` es un objeto o un ID.
      orderTable.innerHTML += `
        <tr>
          <td>${userId}</td>
          <td>${order.products[0].productName}</td>
          <td>${order.products[0].quantity}</td>
          <td>${order.total}</td>
          <td>${new Date(order.deliveryDate).toLocaleDateString()}</td>
          <td>
            <button class="edit" onclick="editOrder('${order._id}')">Editar</button>
            <button class="delete" onclick="deleteOrder('${order._id}')">Eliminar</button>
          </td>
        </tr>
      `;
    });
  }

  // Manejar la creación y actualización de usuarios
  userForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const userId = document.getElementById('userId').value;
    const name = document.getElementById('userName').value;
    const email = document.getElementById('userEmail').value;
    const phone = document.getElementById('userPhone').value;
    const address = document.getElementById('userAddress').value;

    const payload = { name, email, phone, address };

    if (userId) {
      await fetch(`http://localhost:3000/api/users/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
    } else {
      await fetch('http://localhost:3000/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
    }

    fetchUsers();
    userForm.reset();
    document.getElementById('submitUser').textContent = 'Agregar Usuario';
  });

  // Manejar la creación y actualización de órdenes
  orderForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const orderId = document.getElementById('orderId').value;
    const user = document.getElementById('orderUser').value;
    const productName = document.getElementById('orderProduct').value;
    const quantity = document.getElementById('orderQuantity').value;
    const total = document.getElementById('orderTotal').value;
    const deliveryDate = document.getElementById('orderDate').value;

    const payload = {
      user,
      products: [{ productName, quantity }],
      total,
      deliveryDate,
    };

    if (orderId) {
      await fetch(`http://localhost:3000/api/orders/${orderId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
    } else {
      await fetch('http://localhost:3000/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
    }

    fetchOrders();
    orderForm.reset();
    document.getElementById('submitOrder').textContent = 'Agregar Orden';
  });

  // Cargar usuarios y órdenes al iniciar
  fetchUsers();
  fetchOrders();
});
