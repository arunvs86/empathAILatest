import cron from 'node-cron';
import { Thought } from './schema/thoughtsSchema.js'; 
import { Carer } from './schema/userSchema.js'; 

// The specific user ID who will post daily
const automaticPosterId = '66d62bdae8774aa19586b681'; 

const motivationalQuotes = [
    "It's okay to seek help. Therapy is not a sign of weakness, but a step towards healing.",
    "Healing begins the moment you choose to talk about what hurts. You don't have to do it alone.",
    "You are allowed to feel what you're feeling. Let therapy guide you towards better understanding.",
    "Your mental health is a priority. Talking to someone is the first step toward peace.",
    "Grief may feel overwhelming, but you don’t have to carry it alone. Let therapy support you through it.",
    "Caring for your mind is just as important as caring for your body. Therapy is here to help you thrive.",
    "The journey to healing starts with a conversation. Let today be that day.",
    "You are not alone. Reaching out for therapy is a courageous step towards your well-being.",
    "Grief is not a sign of weakness. It’s love persevering. Therapy can help you through the journey.",
    "It’s brave to ask for help when you need it. Therapy can be your support on the hardest days."
  ];


// Function to select a random motivational quote
const getRandomQuote = () => {
  return motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)];
};

// Function to create a new thought
export const createDailyThought = async () => {
  try {
    const thought = getRandomQuote(); // Get a random motivational quote

    // Create the new thought post
    const newThought = await Thought.create({
      thought: thought,
      carer: automaticPosterId, // Post on behalf of the specific user
    });

    // Find the user and add the thought to their list of thoughts
    const carer = await Carer.findById(automaticPosterId);
    if (carer) {
      carer.thoughts.push(newThought._id);
      await carer.save();
    }

    console.log('Daily thought posted:', newThought);
  } catch (error) {
    console.error('Error posting daily thought:', error);
  }
};

// Schedule the cron job to run once a day at 9 AM
cron.schedule('0 9 * * *', () => {
  console.log('Running daily post job...');
  createDailyThought(); 
}, {
  timezone: "Europe/London"
});
