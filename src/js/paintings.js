const BASE_URL = '/gallery-threejs';
const frontWall = [
  {
    src: '/artworks/0.jpg',
    width: 10,
    height: 5,
    position: { x: -15, y: 0, z: -24.99 },
    rotation: 0,
    userData: {
      info: {
        title: 'First Painting',
        artist: 'Van Gough',
        description: 'Some Description',
        year: 'Some Year',
        link: 'https://github.com/mostafaei2002',
      },
    },
  },
  {
    src: '/artworks/1.jpg',
    width: 10,
    height: 5,
    position: { x: 0, y: 0, z: -24.99 },
    rotation: 0,
    userData: {
      info: {
        title: 'Second Painting',
        artist: 'Van Gough',
        description: 'Some Other Description',
        year: 'Some year',
        link: 'https://github.com/mostafaei2002',
      },
    },
  },
  {
    src: '/artworks/3.jpg',
    width: 10,
    height: 5,
    position: { x: 15, y: 0, z: -24.99 },
    rotation: 0,
    userData: {
      info: {
        title: 'Lorem ipsum',
        artist: 'Lorem Ipsum',
        description: 'Some Other Description',
        year: 'Some year',
        link: 'https://github.com/mostafaei2002',
      },
    },
  },
];

const backWall = [
  {
    src: '/artworks/16.jpg',
    width: 10,
    height: 5,
    position: { x: -15, y: 0, z: 24.99 },
    rotation: Math.PI,
    userData: {
      info: {
        title: 'First Painting',
        artist: 'Van Gough',
        description: 'Some Description',
        year: 'Some Year',
        link: 'https://github.com/mostafaei2002',
      },
    },
  },
  {
    src: '/artworks/17.jpg',
    width: 10,
    height: 5,
    position: { x: 0, y: 0, z: 24.99 },
    rotation: Math.PI,
    userData: {
      info: {
        title: 'Second Painting',
        artist: 'Van Gough',
        description: 'Some Other Description',
        year: 'Some year',
        link: 'https://github.com/mostafaei2002',
      },
    },
  },
  {
    src: '/artworks/19.jpg',
    width: 10,
    height: 5,
    position: { x: 15, y: 0, z: 24.99 },
    rotation: Math.PI,
    userData: {
      info: {
        title: 'Lorem ipsum',
        artist: 'Lorem Ipsum',
        description: 'Some Other Description',
        year: 'Some year',
        link: 'https://github.com/mostafaei2002',
      },
    },
  },
];

const rightWall = [
  {
    src: '/artworks/5.jpg',
    width: 10,
    height: 5,
    position: { x: -24.99, y: 0, z: -15 },
    rotation: Math.PI / 2,
    userData: {
      info: {
        title: 'Lorem ipsum',
        artist: 'Lorem Ipsum',
        description: 'Some Other Description',
        year: 'Some year',
        link: 'https://github.com/mostafaei2002',
      },
    },
  },
  {
    src: '/artworks/7.jpg',
    width: 10,
    height: 5,
    position: { x: -24.99, y: 0, z: 0 },
    rotation: Math.PI / 2,
    userData: {
      info: {
        title: 'Lorem ipsum',
        artist: 'Lorem Ipsum',
        description: 'Some Other Description',
        year: 'Some year',
        link: 'https://github.com/mostafaei2002',
      },
    },
  },
  {
    src: '/artworks/10.jpg',
    width: 10,
    height: 5,
    position: { x: -24.99, y: 0, z: 15 },
    rotation: Math.PI / 2,
    userData: {
      info: {
        title: 'Lorem ipsum',
        artist: 'Lorem Ipsum',
        description: 'Some Other Description',
        year: 'Some year',
        link: 'https://github.com/mostafaei2002',
      },
    },
  },
];

const leftWall = [
  {
    src: '/artworks/5.jpg',
    width: 10,
    height: 5,
    position: { x: 24.99, y: 0, z: -15 },
    rotation: (3 * Math.PI) / 2,
    userData: {
      info: {
        title: 'Lorem ipsum',
        artist: 'Lorem Ipsum',
        description: 'Some Other Description',
        year: 'Some year',
        link: 'https://github.com/mostafaei2002',
      },
    },
  },
  {
    src: '/artworks/7.jpg',
    width: 10,
    height: 5,
    position: { x: 24.99, y: 0, z: 0 },
    rotation: (3 * Math.PI) / 2,
    userData: {
      info: {
        title: 'Lorem ipsum',
        artist: 'Lorem Ipsum',
        description: 'Some Other Description',
        year: 'Some year',
        link: 'https://github.com/mostafaei2002',
      },
    },
  },
  {
    src: '/artworks/10.jpg',
    width: 10,
    height: 5,
    position: { x: 24.99, y: 0, z: 15 },
    rotation: (3 * Math.PI) / 2,
    userData: {
      info: {
        title: 'Lorem ipsum',
        artist: 'Lorem Ipsum',
        description: 'Some Other Description',
        year: 'Some year',
        link: 'https://github.com/mostafaei2002',
      },
    },
  },
];

export const paintings = [
  ...frontWall,
  ...backWall,
  ...rightWall,
  ...leftWall,
].map((painting) => ({
  ...painting,
  src: BASE_URL + painting.src,
}));
