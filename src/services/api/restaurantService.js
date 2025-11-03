import restaurantsData from "@/services/mockData/restaurants.json";

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const restaurantService = {
  async getAll() {
    await delay(300);
    return [...restaurantsData];
  },

  async getById(id) {
    await delay(200);
    const restaurant = restaurantsData.find(r => r.Id === parseInt(id));
    if (!restaurant) {
      throw new Error("Restaurant not found");
    }
    return { ...restaurant };
  },

  async searchRestaurants(query) {
    await delay(250);
    const results = restaurantsData.filter(restaurant =>
      restaurant.name.toLowerCase().includes(query.toLowerCase()) ||
      restaurant.cuisineTypes.some(cuisine =>
        cuisine.toLowerCase().includes(query.toLowerCase())
      )
    );
    return results.map(restaurant => ({ ...restaurant }));
  },

  async getRestaurantsByCuisine(cuisine) {
    await delay(300);
    if (cuisine === "all") {
      return [...restaurantsData];
    }
    const results = restaurantsData.filter(restaurant =>
      restaurant.cuisineTypes.some(c =>
        c.toLowerCase() === cuisine.toLowerCase()
      )
    );
    return results.map(restaurant => ({ ...restaurant }));
  },

  async create(restaurant) {
    await delay(400);
    const maxId = Math.max(...restaurantsData.map(r => r.Id));
    const newRestaurant = {
      ...restaurant,
      Id: maxId + 1
    };
    restaurantsData.push(newRestaurant);
    return { ...newRestaurant };
  },

  async update(id, data) {
    await delay(350);
    const index = restaurantsData.findIndex(r => r.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Restaurant not found");
    }
    restaurantsData[index] = { ...restaurantsData[index], ...data };
    return { ...restaurantsData[index] };
  },

  async delete(id) {
    await delay(300);
    const index = restaurantsData.findIndex(r => r.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Restaurant not found");
    }
    const deleted = restaurantsData.splice(index, 1)[0];
    return { ...deleted };
  }
};