import seedrandom from "seedrandom";
import { faker } from "@faker-js/faker";

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

export function generateData(seed, page, region, errorCount) {
  const rng = seedrandom(seed);
  faker.seed(rng.int32());

  const data = [];
  const regionSpecificData = {
    USA: {
      alphabet: "abcdefghijklmnopqrstuvwxyz",
      phoneFormat: "###-###-####",
    },
    Poland: {
      alphabet: "ąćęłńóśźżabcdefghijklmnopqrstuvwxyz",
      phoneFormat: "+48 ### ### ###",
    },
    Georgia: {
      alphabet: "abcdefghijklmnopqrstuvwxyz",
      phoneFormat: "+995 ### ### ####",
    },
  };

  const { alphabet, phoneFormat } =
    regionSpecificData[region] || regionSpecificData.USA;

  // Calculate the starting index based on the page
  const startIndex = (page - 1) * 20; // Adjust to start from 0 for the first page

  for (let i = 0; i < 20; i++) {
    const name = `${faker.person.firstName()} ${faker.person.middleName()} ${faker.person.lastName()}`;
    const address = `${faker.location.city()}, ${faker.location.streetAddress()}`;
    const phone = faker.phone.number(phoneFormat);
    const id = faker.string.uuid();

    data.push({
      index: startIndex + i + 1, // Adjust index calculation
      id,
      name: introduceErrors(name, errorCount, alphabet),
      address: introduceErrors(address, errorCount, alphabet),
      phone: introduceErrors(phone, errorCount, alphabet),
    });
  }

  return data;
}
