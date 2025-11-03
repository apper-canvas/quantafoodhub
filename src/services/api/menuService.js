import menuItemsData from "@/services/mockData/menuItems.json";

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const menuService = {
  async getAll() {
    await delay(300);
    return [...menuItemsData];
  },

  async getById(id) {
    await delay(200);
    const menuItem = menuItemsData.find(item => item.Id === parseInt(id));
    if (!menuItem) {
      throw new Error("Menu item not found");
    }
    return { ...menuItem };
  },

  async getByRestaurantId(restaurantId) {
    await delay(250);
    const items = menuItemsData.filter(item =>
      item.restaurantId === restaurantId.toString()
    );
    return items.map(item => ({ ...item }));
  },

  async searchMenuItems(query) {
    await delay(200);
    const results = menuItemsData.filter(item =>
      item.name.toLowerCase().includes(query.toLowerCase()) ||
      item.description.toLowerCase().includes(query.toLowerCase()) ||
      item.category.toLowerCase().includes(query.toLowerCase())
    );
    return results.map(item => ({ ...item }));
  },

  async create(menuItem) {
    await delay(400);
    const maxId = Math.max(...menuItemsData.map(item => item.Id));
    const newMenuItem = {
      ...menuItem,
      Id: maxId + 1
    };
    menuItemsData.push(newMenuItem);
    return { ...newMenuItem };
  },

  async update(id, data) {
    await delay(350);
    const index = menuItemsData.findIndex(item => item.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Menu item not found");
    }
    menuItemsData[index] = { ...menuItemsData[index], ...data };
    return { ...menuItemsData[index] };
  },

  async delete(id) {
    await delay(300);
    const index = menuItemsData.findIndex(item => item.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Menu item not found");
    }
    const deleted = menuItemsData.splice(index, 1)[0];
    return { ...deleted };
  }
};