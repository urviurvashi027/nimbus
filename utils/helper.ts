// Function to find an object by name and return its id
export function findIdBName(
  items: any,
  property: string,
  idKey: string,
  targetName: string
): number | undefined {
  // Use Array.prototype.find to locate the object
  const foundItem = items.find((item: any) => item[property] === targetName);

  // Return the id if the object is found, otherwise return undefined
  return foundItem ? foundItem[idKey] : undefined;
}

export const addObjectAtEnd = (data: any) => {
  // Get the last object in the array
  const lastObject = data[data.length - 1];

  // Extract the last id and increment it by 1
  const newId = lastObject ? lastObject.id + 1 : 1; // Handle empty array case

  // Create the new object to add
  const newObject = {
    id: newId,
    name: "Add New",
  };

  // Add the new object to the end of the array
  const modifiedArray = [...data, newObject];

  return modifiedArray;
};
