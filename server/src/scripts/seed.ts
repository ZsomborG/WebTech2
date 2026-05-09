import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User';
import Book from '../models/Book';
import Borrow from '../models/Borrow';

dotenv.config();

async function seed() {
  const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/library_system';
  
  console.log(`Connecting to: ${mongoUri}`);
  await mongoose.connect(mongoUri);
  console.log('Connected to MongoDB');

  // Clear existing data
  console.log('Cleaning existing data...');
  await Promise.all([
    User.deleteMany({}),
    Book.deleteMany({}),
    Borrow.deleteMany({})
  ]);

  // Create users
  console.log('Creating users...');
  const admin = await User.create({
    username: 'admin',
    password: 'password',
    role: 'admin'
  });

  const users = await User.create([
    { username: 'alice', password: 'password', role: 'user' },
    { username: 'bob', password: 'password', role: 'user' },
    { username: 'charlie', password: 'password', role: 'user' },
    { username: 'david', password: 'password', role: 'user' },
  ]);

  // Seed books
  console.log('Creating books...');
  const booksData = [
    { title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', isbn: '978-0743273565', publishedYear: 1925, genre: 'Classic', quantity: 5 },
    { title: '1984', author: 'George Orwell', isbn: '978-0451524935', publishedYear: 1949, genre: 'Science Fiction', quantity: 8 },
    { title: 'To Kill a Mockingbird', author: 'Harper Lee', isbn: '978-0446310789', publishedYear: 1960, genre: 'Fiction', quantity: 4 },
    { title: 'The Hobbit', author: 'J.R.R. Tolkien', isbn: '978-0547928227', publishedYear: 1937, genre: 'Fantasy', quantity: 12 },
    { title: 'Fahrenheit 451', author: 'Ray Bradbury', isbn: '978-1451673319', publishedYear: 1953, genre: 'Science Fiction', quantity: 6 },
    { title: 'Pride and Prejudice', author: 'Jane Austen', isbn: '978-0141439518', publishedYear: 1813, genre: 'Classic', quantity: 3 },
    { title: 'The Catcher in the Rye', author: 'J.D. Salinger', isbn: '978-0316769174', publishedYear: 1951, genre: 'Fiction', quantity: 7 },
    { title: 'Brave New World', author: 'Aldous Huxley', isbn: '978-0060850524', publishedYear: 1932, genre: 'Science Fiction', quantity: 5 },
    { title: 'The Lord of the Rings', author: 'J.R.R. Tolkien', isbn: '978-0544003415', publishedYear: 1954, genre: 'Fantasy', quantity: 10 },
    { title: 'Animal Farm', author: 'George Orwell', isbn: '978-0451526342', publishedYear: 1945, genre: 'Fiction', quantity: 15 },
    { title: 'The Alchemist', author: 'Paulo Coelho', isbn: '978-0062315007', publishedYear: 1988, genre: 'Fantasy', quantity: 20 },
    { title: 'The Da Vinci Code', author: 'Dan Brown', isbn: '978-0307474278', publishedYear: 2003, genre: 'Mystery', quantity: 12 },
    { title: 'The Little Prince', author: 'Antoine de Saint-Exupéry', isbn: '978-0156012195', publishedYear: 1943, genre: 'Fantasy', quantity: 25 },
    { title: 'Moby-Dick', author: 'Herman Melville', isbn: '978-0142437247', publishedYear: 1851, genre: 'Classic', quantity: 2 },
    { title: 'War and Peace', author: 'Leo Tolstoy', isbn: '978-0140447934', publishedYear: 1869, genre: 'Classic', quantity: 3 },
    { title: 'The Odyssey', author: 'Homer', isbn: '978-0140268867', publishedYear: -800, genre: 'Classic', quantity: 5 },
    { title: 'Crime and Punishment', author: 'Fyodor Dostoevsky', isbn: '978-0140449136', publishedYear: 1866, genre: 'Classic', quantity: 4 },
    { title: 'The Brothers Karamazov', author: 'Fyodor Dostoevsky', isbn: '978-0374528379', publishedYear: 1880, genre: 'Classic', quantity: 3 },
    { title: 'Ulysses', author: 'James Joyce', isbn: '978-0679722762', publishedYear: 1922, genre: 'Fiction', quantity: 1 },
    { title: 'Don Quixote', author: 'Miguel de Cervantes', isbn: '978-0060934347', publishedYear: 1605, genre: 'Classic', quantity: 2 },
    { title: 'The Great Hunt', author: 'Robert Jordan', isbn: '978-0812517729', publishedYear: 1990, genre: 'Fantasy', quantity: 8 },
    { title: 'The Eye of the World', author: 'Robert Jordan', isbn: '978-0812511819', publishedYear: 1990, genre: 'Fantasy', quantity: 10 },
    { title: 'Dune', author: 'Frank Herbert', isbn: '978-0441172719', publishedYear: 1965, genre: 'Science Fiction', quantity: 12 },
    { title: 'Foundation', author: 'Isaac Asimov', isbn: '978-0553293357', publishedYear: 1951, genre: 'Science Fiction', quantity: 9 },
    { title: 'Neuromancer', author: 'William Gibson', isbn: '978-0441569595', publishedYear: 1984, genre: 'Science Fiction', quantity: 6 },
    { title: 'The Shining', author: 'Stephen King', isbn: '978-0307743657', publishedYear: 1977, genre: 'Horror', quantity: 7 },
    { title: 'It', author: 'Stephen King', isbn: '978-1501142970', publishedYear: 1986, genre: 'Horror', quantity: 5 },
    { title: 'A Game of Thrones', author: 'George R.R. Martin', isbn: '978-0553593716', publishedYear: 1996, genre: 'Fantasy', quantity: 15 },
    { title: 'A Clash of Kings', author: 'George R.R. Martin', isbn: '978-0553579901', publishedYear: 1998, genre: 'Fantasy', quantity: 12 },
    { title: 'The Name of the Wind', author: 'Patrick Rothfuss', isbn: '978-0756404741', publishedYear: 2007, genre: 'Fantasy', quantity: 18 },
    { title: 'The Wise Mans Fear', author: 'Patrick Rothfuss', isbn: '978-0756407124', publishedYear: 2011, genre: 'Fantasy', quantity: 14 },
    { title: 'Gone Girl', author: 'Gillian Flynn', isbn: '978-0307588371', publishedYear: 2012, genre: 'Mystery', quantity: 10 },
    { title: 'The Girl with the Dragon Tattoo', author: 'Stieg Larsson', isbn: '978-0307454546', publishedYear: 2005, genre: 'Mystery', quantity: 9 },
    { title: 'The Help', author: 'Kathryn Stockett', isbn: '978-0425232200', publishedYear: 2009, genre: 'Fiction', quantity: 11 },
    { title: 'The Kite Runner', author: 'Khaled Hosseini', isbn: '978-1594631931', publishedYear: 2003, genre: 'Fiction', quantity: 13 },
    { title: 'Life of Pi', author: 'Yann Martel', isbn: '978-0156027328', publishedYear: 2001, genre: 'Fiction', quantity: 8 },
    { title: 'Sapiens', author: 'Yuval Noah Harari', isbn: '978-0062316097', publishedYear: 2011, genre: 'Biography', quantity: 20 },
    { title: 'The Martian', author: 'Andy Weir', isbn: '978-0553418026', publishedYear: 2011, genre: 'Science Fiction', quantity: 15 },
    { title: 'Ready Player One', author: 'Ernest Cline', isbn: '978-0307887443', publishedYear: 2011, genre: 'Science Fiction', quantity: 12 },
    { title: 'The Road', author: 'Cormac McCarthy', isbn: '978-0307387899', publishedYear: 2006, genre: 'Fiction', quantity: 6 },
    { title: 'Steve Jobs', author: 'Walter Isaacson', isbn: '978-1451648539', publishedYear: 2011, genre: 'Biography', quantity: 10 },
    { title: 'Educated', author: 'Tara Westover', isbn: '978-0399590504', publishedYear: 2018, genre: 'Biography', quantity: 15 },
    { title: 'Becoming', author: 'Michelle Obama', isbn: '978-1524763138', publishedYear: 2018, genre: 'Biography', quantity: 18 },
    { title: 'Bad Blood', author: 'John Carreyrou', isbn: '978-1524731656', publishedYear: 2018, genre: 'Mystery', quantity: 9 },
    { title: 'The Silent Patient', author: 'Alex Michaelides', isbn: '978-1250301697', publishedYear: 2019, genre: 'Mystery', quantity: 14 },
    { title: 'Where the Crawdads Sing', author: 'Delia Owens', isbn: '978-0735219090', publishedYear: 2018, genre: 'Fiction', quantity: 12 },
    { title: 'Project Hail Mary', author: 'Andy Weir', isbn: '978-0593135204', publishedYear: 2021, genre: 'Science Fiction', quantity: 16 },
    { title: 'The Seven Husbands of Evelyn Hugo', author: 'Taylor Jenkins Reid', isbn: '978-1501161933', publishedYear: 2017, genre: 'Fiction', quantity: 11 },
    { title: 'Circe', author: 'Madeline Miller', isbn: '978-0316556347', publishedYear: 2018, genre: 'Fantasy', quantity: 10 },
    { title: 'Song of Achilles', author: 'Madeline Miller', isbn: '978-0062060624', publishedYear: 2011, genre: 'Fantasy', quantity: 9 },
    { title: 'Normal People', author: 'Sally Rooney', isbn: '978-1984822178', publishedYear: 2018, genre: 'Fiction', quantity: 8 },
  ];

  const books = await Book.create(
    booksData.map(book => ({ ...book, addedBy: admin._id }))
  );

  // Create borrows
  console.log('Creating borrows...');
  const now = new Date();
  
  const borrowsData = [
    // Alice's borrows
    { book: books[0]._id, user: users[0]._id, dueDate: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000), status: 'active' },
    { book: books[1]._id, user: users[0]._id, dueDate: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000), status: 'active' }, // Overdue
    { book: books[4]._id, user: users[0]._id, dueDate: new Date(now.getTime() + 10 * 24 * 60 * 60 * 1000), status: 'active' },
    
    // Bob's borrows
    { book: books[2]._id, user: users[1]._id, dueDate: new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000), status: 'active' },
    { book: books[3]._id, user: users[1]._id, dueDate: new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000), status: 'active' },
    
    // Charlie's borrows
    { book: books[10]._id, user: users[2]._id, dueDate: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000), status: 'active' }, // Overdue
    { book: books[12]._id, user: users[2]._id, dueDate: new Date(now.getTime() + 21 * 24 * 60 * 60 * 1000), status: 'active' },
    
    // David's borrows
    { book: books[15]._id, user: users[3]._id, dueDate: new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000), status: 'active' },
    { book: books[20]._id, user: users[3]._id, dueDate: new Date(now.getTime() + 12 * 24 * 60 * 60 * 1000), status: 'active' },

    // Returned items for history
    { book: books[5]._id, user: users[0]._id, dueDate: new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000), returnDate: new Date(now.getTime() - 12 * 24 * 60 * 60 * 1000), status: 'returned' },
    { book: books[6]._id, user: users[1]._id, dueDate: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000), returnDate: new Date(now.getTime() - 4 * 24 * 60 * 60 * 1000), status: 'returned' },
  ];

  await Borrow.create(borrowsData);

  console.log('--- SEEDING SUMMARY ---');
  console.log(`Users: ${users.length + 1}`);
  console.log(`Books: ${books.length}`);
  console.log(`Active Borrows: ${borrowsData.filter(b => b.status === 'active').length}`);
  console.log('Seeding complete!');
  process.exit(0);
}

seed().catch(err => {
  console.error('Error during seeding:', err);
  process.exit(1);
});
