import { faker } from "@faker-js/faker";
import seedrandom from "seedrandom";

// Error handling functions
function deleteCharacter(str) {
  const index = Math.floor(Math.random() * str.length);
  return str.slice(0, index) + str.slice(index + 1);
}

function addCharacter(str, alphabet) {
  const index = Math.floor(Math.random() * str.length);
  const randomChar = alphabet[Math.floor(Math.random() * alphabet.length)];
  return str.slice(0, index) + randomChar + str.slice(index);
}

function swapCharacters(str) {
  if (str.length < 2) return str;
  const index = Math.floor(Math.random() * (str.length - 1));
  return (
    str.slice(0, index) + str[index + 1] + str[index] + str.slice(index + 2)
  );
}

function introduceErrors(data, errorCount, alphabet) {
  const operations = [deleteCharacter, addCharacter, swapCharacters];
  for (let i = 0; i < errorCount; i++) {
    const errorFunc = operations[Math.floor(Math.random() * operations.length)];
    data = errorFunc(data, alphabet);
  }
  return data;
}

// Generate fake data with errors
export function generateData(seed, page, region, errorCount) {
  const rng = seedrandom(seed + page); // Combine seed with page number

  faker.seed(rng.int32());

  const alphabet =
    region === "USA"
      ? "abcdefghijklmnopqrstuvwxyz"
      : "abcdefghijklmnopqrstuvwxyz";
  const data = [];

  for (let i = 0; i < 20; i++) {
    const name = `${faker.person.firstName()} ${faker.person.middleName()} ${faker.person.lastName()}`;
    const address = `${faker.location.city()}, ${faker.location.streetAddress()}`;
    const phone = faker.phone.number(); // Updated method
    const id = faker.string.uuid(); // Updated method

    data.push({
      index: page * 20 + i + 1,
      id,
      name: introduceErrors(name, errorCount, alphabet),
      address: introduceErrors(address, errorCount, alphabet),
      phone: introduceErrors(phone, errorCount, alphabet),
    });
  }

  return data;
}
