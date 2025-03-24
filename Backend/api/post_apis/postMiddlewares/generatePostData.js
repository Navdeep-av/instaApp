export const generatePostData = (req, res, next) => {
  const numEntries = 1000;
  const data = [];

  for (let i = 0; i < numEntries; i++) {
    data.push({
      id: i + 1,
      name: `Item ${i + 1}`,
      postLink: `PostLink ${i + 1}`,
      imageLink: `ImageLink ${i + 1}`,
      likesCount: Math.random() * 100,
      commentsCount: Math.random() * 100,
    });
  }
  return data;
};

// function generateData(numEntries) {
//   const data = [];
//   for (let i = 0; i < numEntries; i++) {
//     data.push({
//       id: i + 1,
//       name: `Item ${i + 1}`,
//       value: Math.random() * 100,
//       timestamp: new Date(),
//     });
//   }
//   return data;
// }

// const data = generateData(100000);
// console.table(data);
