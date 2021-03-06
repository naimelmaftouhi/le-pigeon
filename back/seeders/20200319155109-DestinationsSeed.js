"use strict";
const faker = require("faker");
const coverImages = [
  "HmdUOE8RD2.jpeg",
  "oOCLWIHtpQ.jpeg",
  "ozl5wXpxA5.jpeg",
  "pF6NUrGBx3.jpeg",
];

module.exports = {
  up: (queryInterface, Sequelize) => {
    let data = [];
    let count = 30;
    let type = [
      "Plage",
      "Montagne",
      "City-trip",
      "Road-trip",
      "Backpack",
      "Hotel",
      "Clubmed",
      "Slow-travel",
      "Tour du monde",
      "Croisières",
      "Trek",
      "Camping",
    ];
    while (count--) {
      data.push({
        // countryID: faker.random.number({ min: 1, max: 15, precision: 1 }),
        // continentID: faker.random.number({ min: 1, max: 7, precision: 1 }),
        name: faker.lorem.sentence(3),
        lat: faker.address.latitude(),
        lng: faker.address.longitude(),
        type: faker.random.arrayElement(type),
        coverImage: faker.random.arrayElement(coverImages),
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }
    return queryInterface.bulkInsert("Destinations", data, {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("Destinations", null, {});
  },
};
