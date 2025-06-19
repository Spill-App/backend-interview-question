import { ensureMoviesTable } from './index';
import { createMovie } from '../app/services/movieService';

async function seed() {
  await ensureMoviesTable();

  const movies = [
    {
      title: 'Inception',
      description: 'A mind-bending thriller.',
      releaseDate: '2010-07-16',
      popularity: 9.8,
    },
    {
      title: 'The Matrix',
      description: 'A computer hacker learns about the true nature of reality.',
      releaseDate: '1999-03-31',
      popularity: 9.5,
    },
    {
      title: 'Interstellar',
      description: 'A team of explorers travel through a wormhole in space.',
      releaseDate: '2014-11-07',
      popularity: 9.6,
    },
    {
      title: 'Batman Begins',
      description: 'After training with his mentor, Batman begins his fight to free crime-ridden Gotham City from corruption.',
      releaseDate: '2005-06-15',
      popularity: 8.3,
    },
    {
      title: 'The Dark Knight',
      description: 'Batman faces the Joker, a criminal mastermind who plunges Gotham into anarchy.',
      releaseDate: '2008-07-18',
      popularity: 9.0,
    },
    {
      title: 'The Dark Knight Rises',
      description: 'Eight years after the Joker\'s reign, Batman faces new threats to Gotham City.',
      releaseDate: '2012-07-20',
      popularity: 9.8,
    },
    {
      title: 'Casino Royale',
      description: 'James Bond earns his 00 status and faces off against Le Chiffre in a high-stakes poker game.',
      releaseDate: '2006-11-17',
      popularity: 8.0,
    },
    {
      title: 'Skyfall',
      description: 'Bond\'s loyalty to M is tested as her past comes back to haunt her.',
      releaseDate: '2012-11-09',
      popularity: 8.7,
    },
    {
      title: 'No Time to Die',
      description: 'James Bond comes out of retirement to face a new villain armed with dangerous technology.',
      releaseDate: '2021-10-08',
      popularity: 7.5,
    },
    {
      title: 'Back to the Future',
      description: 'Marty McFly travels back in time and must ensure his parents fall in love or risk ceasing to exist.',
      releaseDate: '1985-07-03',
      popularity: 9.2,
    },
  ];

  for (const movie of movies) {
    await createMovie(movie);
  }

  console.log('Database seeded!');
}

seed().catch((err) => {
  console.error('Seeding failed:', err);
  process.exit(1);
}); 