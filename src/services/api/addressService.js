import addressesData from "@/services/mockData/addresses.json";

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const addressService = {
  async getAll() {
    await delay(200);
    return [...addressesData];
  },

  async getById(id) {
    await delay(150);
    const address = addressesData.find(addr => addr.Id === parseInt(id));
    if (!address) {
      throw new Error("Address not found");
    }
    return { ...address };
  },

  async create(address) {
    await delay(300);
    const maxId = Math.max(...addressesData.map(addr => addr.Id));
    const newAddress = {
      ...address,
      Id: maxId + 1
    };
    addressesData.push(newAddress);
    return { ...newAddress };
  },

  async update(id, data) {
    await delay(250);
    const index = addressesData.findIndex(addr => addr.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Address not found");
    }
    addressesData[index] = { ...addressesData[index], ...data };
    return { ...addressesData[index] };
  },

  async delete(id) {
    await delay(200);
    const index = addressesData.findIndex(addr => addr.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Address not found");
    }
    const deleted = addressesData.splice(index, 1)[0];
    return { ...deleted };
  }
};