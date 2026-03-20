require('dotenv').config();
const mongoose = require('mongoose');
const Movie = require('./models/Movie');
const Show = require('./models/Show');
const connectDB = require('./config/db');

connectDB();

const movies = [
  {
    title: 'Dune: Part Two',
    description: 'Paul Atreides unites with Chani and the Fremen while on a warpath of revenge against the conspirators who destroyed his family.',
    posterUrl: 'https://image.tmdb.org/t/p/w500/1pdfLvkbY9ohJlCjQH2JGjjc91p.jpg',
    genre: 'Sci-Fi, Action',
    duration: 166,
    releaseDate: new Date('2024-03-01')
  },
  {
    title: 'Kung Fu Panda 4',
    description: 'After Po is tapped to become the Spiritual Leader of the Valley of Peace, he needs to find and train a new Dragon Warrior.',
    posterUrl: 'https://image.tmdb.org/t/p/w500/kDp1vUBnMpe8ak4rjgl3cLELqjU.jpg',
    genre: 'Animation, Action',
    duration: 94,
    releaseDate: new Date('2024-03-08')
  },
  {
    title: 'Godzilla x Kong: The New Empire',
    description: 'Two ancient titans, Godzilla and Kong, clash in an epic battle as humans unravel their intertwined origins and connection to Skull Island\'s mysteries.',
    posterUrl: 'https://image.tmdb.org/t/p/w500/tMefBSflR6PGQLvLuPEHZotffM0.jpg',
    genre: 'Action, Sci-Fi',
    duration: 115,
    releaseDate: new Date('2024-03-29')
  }
];

const importData = async () => {
  try {
    await Movie.deleteMany();
    await Show.deleteMany();

    const createdMovies = await Movie.insertMany(movies);

    const shows = [];
    const today = new Date();
    // Add 3 days of shows for each movie
    createdMovies.forEach(movie => {
      for (let i = 0; i < 3; i++) {
        const showDate = new Date(today);
        showDate.setDate(today.getDate() + i);

        shows.push({
          movie: movie._id,
          time: '10:00 AM',
          date: showDate,
          screen: 'Screen 1',
          price: 100
        });
        shows.push({
          movie: movie._id,
          time: '02:00 PM',
          date: showDate,
          screen: 'Screen 2',
          price: 100
        });
        shows.push({
          movie: movie._id,
          time: '07:00 PM',
          date: showDate,
          screen: 'Screen 1',
          price: 100
        });
      }
    });

    await Show.insertMany(shows);
    console.log('Data Imported!');
    process.exit();
  } catch (error) {
    console.error(`${error}`);
    process.exit(1);
  }
};

importData();
