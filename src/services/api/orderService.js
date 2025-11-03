import ordersData from "@/services/mockData/orders.json";

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const orderService = {
  async getAll() {
    await delay(300);
    return [...ordersData].sort((a, b) => b.orderTime - a.orderTime);
  },

  async getById(id) {
    await delay(200);
    const order = ordersData.find(o => o.Id === parseInt(id));
    if (!order) {
      throw new Error("Order not found");
    }
    return { ...order };
  },

  async getActiveOrders() {
    await delay(250);
    const activeStatuses = ["confirmed", "preparing", "picked_up", "out_for_delivery"];
    const active = ordersData.filter(order => activeStatuses.includes(order.status));
    return active.map(order => ({ ...order })).sort((a, b) => b.orderTime - a.orderTime);
  },

  async getOrderHistory() {
    await delay(300);
    const history = ordersData.filter(order => order.status === "delivered");
    return history.map(order => ({ ...order })).sort((a, b) => b.orderTime - a.orderTime);
  },

  async create(order) {
    await delay(500);
    const maxId = Math.max(...ordersData.map(o => o.Id));
    const newOrder = {
      ...order,
      Id: maxId + 1,
      orderTime: Date.now(),
      estimatedDelivery: Date.now() + (30 * 60 * 1000), // 30 minutes from now
      status: "confirmed"
    };
    ordersData.push(newOrder);
    return { ...newOrder };
  },

  async update(id, data) {
    await delay(350);
    const index = ordersData.findIndex(o => o.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Order not found");
    }
    ordersData[index] = { ...ordersData[index], ...data };
    return { ...ordersData[index] };
  },

  async updateStatus(id, status) {
    await delay(300);
    const index = ordersData.findIndex(o => o.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Order not found");
    }
    ordersData[index] = { ...ordersData[index], status };
    return { ...ordersData[index] };
  },

  async delete(id) {
    await delay(300);
    const index = ordersData.findIndex(o => o.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Order not found");
    }
    const deleted = ordersData.splice(index, 1)[0];
    return { ...deleted };
  }
};