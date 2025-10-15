const express = require('express');
const path = require('path');

const app = express();
const PORT = 3001;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Comprehensive Emoji Database
const emojis = [
    // Faces & Emotions
    { emoji: '😀', name: 'Grinning Face', category: 'faces', difficulty: 'easy' },
    { emoji: '😃', name: 'Grinning Face with Big Eyes', category: 'faces', difficulty: 'medium' },
    { emoji: '😄', name: 'Grinning Face with Smiling Eyes', category: 'faces', difficulty: 'medium' },
    { emoji: '😁', name: 'Beaming Face with Smiling Eyes', category: 'faces', difficulty: 'easy' },
    { emoji: '😆', name: 'Grinning Squinting Face', category: 'faces', difficulty: 'medium' },
    { emoji: '😅', name: 'Grinning Face with Sweat', category: 'faces', difficulty: 'easy' },
    { emoji: '🤣', name: 'Rolling on Floor Laughing', category: 'faces', difficulty: 'easy' },
    { emoji: '😂', name: 'Face with Tears of Joy', category: 'faces', difficulty: 'easy' },
    { emoji: '🙂', name: 'Slightly Smiling Face', category: 'faces', difficulty: 'easy' },
    { emoji: '😉', name: 'Winking Face', category: 'faces', difficulty: 'easy' },
    { emoji: '😊', name: 'Smiling Face with Smiling Eyes', category: 'faces', difficulty: 'easy' },
    { emoji: '😇', name: 'Smiling Face with Halo', category: 'faces', difficulty: 'medium' },
    { emoji: '😍', name: 'Smiling Face with Heart Eyes', category: 'faces', difficulty: 'easy' },
    { emoji: '🤩', name: 'Star Struck', category: 'faces', difficulty: 'medium' },
    { emoji: '😘', name: 'Face Blowing Kiss', category: 'faces', difficulty: 'easy' },
    { emoji: '😗', name: 'Kissing Face', category: 'faces', difficulty: 'medium' },
    { emoji: '😚', name: 'Kissing Face with Closed Eyes', category: 'faces', difficulty: 'medium' },
    { emoji: '😋', name: 'Face Savoring Food', category: 'faces', difficulty: 'medium' },
    { emoji: '😛', name: 'Face with Tongue', category: 'faces', difficulty: 'easy' },
    { emoji: '😝', name: 'Squinting Face with Tongue', category: 'faces', difficulty: 'medium' },
    { emoji: '😜', name: 'Winking Face with Tongue', category: 'faces', difficulty: 'medium' },
    { emoji: '🤪', name: 'Zany Face', category: 'faces', difficulty: 'medium' },
    { emoji: '😎', name: 'Smiling Face with Sunglasses', category: 'faces', difficulty: 'easy' },
    { emoji: '🤓', name: 'Nerd Face', category: 'faces', difficulty: 'easy' },
    { emoji: '🧐', name: 'Face with Monocle', category: 'faces', difficulty: 'hard' },
    { emoji: '🤯', name: 'Exploding Head', category: 'faces', difficulty: 'medium' },
    { emoji: '😳', name: 'Flushed Face', category: 'faces', difficulty: 'medium' },
    { emoji: '😢', name: 'Crying Face', category: 'faces', difficulty: 'easy' },
    { emoji: '😭', name: 'Loudly Crying Face', category: 'faces', difficulty: 'easy' },
    { emoji: '😱', name: 'Face Screaming in Fear', category: 'faces', difficulty: 'medium' },

    // Animals
    { emoji: '🐶', name: 'Dog Face', category: 'animals', difficulty: 'easy' },
    { emoji: '🐱', name: 'Cat Face', category: 'animals', difficulty: 'easy' },
    { emoji: '🐭', name: 'Mouse Face', category: 'animals', difficulty: 'easy' },
    { emoji: '🐹', name: 'Hamster', category: 'animals', difficulty: 'easy' },
    { emoji: '🐰', name: 'Rabbit Face', category: 'animals', difficulty: 'easy' },
    { emoji: '🦊', name: 'Fox', category: 'animals', difficulty: 'medium' },
    { emoji: '🐻', name: 'Bear', category: 'animals', difficulty: 'easy' },
    { emoji: '🐼', name: 'Panda', category: 'animals', difficulty: 'easy' },
    { emoji: '🐨', name: 'Koala', category: 'animals', difficulty: 'easy' },
    { emoji: '🐯', name: 'Tiger Face', category: 'animals', difficulty: 'easy' },
    { emoji: '🦁', name: 'Lion', category: 'animals', difficulty: 'easy' },
    { emoji: '🐮', name: 'Cow Face', category: 'animals', difficulty: 'easy' },
    { emoji: '🐷', name: 'Pig Face', category: 'animals', difficulty: 'easy' },
    { emoji: '🐸', name: 'Frog', category: 'animals', difficulty: 'easy' },
    { emoji: '🐵', name: 'Monkey Face', category: 'animals', difficulty: 'easy' },
    { emoji: '🙈', name: 'See No Evil Monkey', category: 'animals', difficulty: 'medium' },
    { emoji: '🙉', name: 'Hear No Evil Monkey', category: 'animals', difficulty: 'medium' },
    { emoji: '🙊', name: 'Speak No Evil Monkey', category: 'animals', difficulty: 'medium' },
    { emoji: '🐒', name: 'Monkey', category: 'animals', difficulty: 'easy' },
    { emoji: '🦍', name: 'Gorilla', category: 'animals', difficulty: 'medium' },
    { emoji: '🐔', name: 'Chicken', category: 'animals', difficulty: 'easy' },
    { emoji: '🐧', name: 'Penguin', category: 'animals', difficulty: 'easy' },
    { emoji: '🐦', name: 'Bird', category: 'animals', difficulty: 'easy' },
    { emoji: '🐤', name: 'Baby Chick', category: 'animals', difficulty: 'easy' },
    { emoji: '🦆', name: 'Duck', category: 'animals', difficulty: 'easy' },
    { emoji: '🦅', name: 'Eagle', category: 'animals', difficulty: 'medium' },
    { emoji: '🦉', name: 'Owl', category: 'animals', difficulty: 'medium' },
    { emoji: '🦇', name: 'Bat', category: 'animals', difficulty: 'medium' },
    { emoji: '🐺', name: 'Wolf', category: 'animals', difficulty: 'medium' },
    { emoji: '🐗', name: 'Boar', category: 'animals', difficulty: 'hard' },
    { emoji: '🐴', name: 'Horse Face', category: 'animals', difficulty: 'easy' },
    { emoji: '🦄', name: 'Unicorn', category: 'animals', difficulty: 'easy' },
    { emoji: '🐝', name: 'Honeybee', category: 'animals', difficulty: 'easy' },
    { emoji: '🦋', name: 'Butterfly', category: 'animals', difficulty: 'easy' },
    { emoji: '🐛', name: 'Bug', category: 'animals', difficulty: 'medium' },
    { emoji: '🐜', name: 'Ant', category: 'animals', difficulty: 'medium' },
    { emoji: '🦗', name: 'Cricket', category: 'animals', difficulty: 'hard' },
    { emoji: '🕷️', name: 'Spider', category: 'animals', difficulty: 'medium' },
    { emoji: '🦂', name: 'Scorpion', category: 'animals', difficulty: 'hard' },
    { emoji: '🐢', name: 'Turtle', category: 'animals', difficulty: 'easy' },
    { emoji: '🐍', name: 'Snake', category: 'animals', difficulty: 'easy' },
    { emoji: '🦎', name: 'Lizard', category: 'animals', difficulty: 'medium' },
    { emoji: '🐙', name: 'Octopus', category: 'animals', difficulty: 'easy' },
    { emoji: '🦑', name: 'Squid', category: 'animals', difficulty: 'medium' },
    { emoji: '🦐', name: 'Shrimp', category: 'animals', difficulty: 'medium' },
    { emoji: '🦀', name: 'Crab', category: 'animals', difficulty: 'easy' },
    { emoji: '🐡', name: 'Blowfish', category: 'animals', difficulty: 'hard' },
    { emoji: '🐠', name: 'Tropical Fish', category: 'animals', difficulty: 'medium' },
    { emoji: '🐟', name: 'Fish', category: 'animals', difficulty: 'easy' },
    { emoji: '🐬', name: 'Dolphin', category: 'animals', difficulty: 'easy' },
    { emoji: '🐳', name: 'Spouting Whale', category: 'animals', difficulty: 'medium' },
    { emoji: '🐋', name: 'Whale', category: 'animals', difficulty: 'easy' },
    { emoji: '🦈', name: 'Shark', category: 'animals', difficulty: 'easy' },

    // Food & Drink
    { emoji: '🍎', name: 'Red Apple', category: 'food', difficulty: 'easy' },
    { emoji: '🍊', name: 'Orange', category: 'food', difficulty: 'easy' },
    { emoji: '🍋', name: 'Lemon', category: 'food', difficulty: 'easy' },
    { emoji: '🍌', name: 'Banana', category: 'food', difficulty: 'easy' },
    { emoji: '🍉', name: 'Watermelon', category: 'food', difficulty: 'easy' },
    { emoji: '🍇', name: 'Grapes', category: 'food', difficulty: 'easy' },
    { emoji: '🍓', name: 'Strawberry', category: 'food', difficulty: 'easy' },
    { emoji: '🫐', name: 'Blueberries', category: 'food', difficulty: 'medium' },
    { emoji: '🍈', name: 'Melon', category: 'food', difficulty: 'easy' },
    { emoji: '🍒', name: 'Cherries', category: 'food', difficulty: 'easy' },
    { emoji: '🍑', name: 'Peach', category: 'food', difficulty: 'easy' },
    { emoji: '🥭', name: 'Mango', category: 'food', difficulty: 'medium' },
    { emoji: '🍍', name: 'Pineapple', category: 'food', difficulty: 'easy' },
    { emoji: '🥥', name: 'Coconut', category: 'food', difficulty: 'medium' },
    { emoji: '🥝', name: 'Kiwi Fruit', category: 'food', difficulty: 'medium' },
    { emoji: '🍅', name: 'Tomato', category: 'food', difficulty: 'easy' },
    { emoji: '🍆', name: 'Eggplant', category: 'food', difficulty: 'medium' },
    { emoji: '🥑', name: 'Avocado', category: 'food', difficulty: 'medium' },
    { emoji: '🥦', name: 'Broccoli', category: 'food', difficulty: 'easy' },
    { emoji: '🥬', name: 'Leafy Greens', category: 'food', difficulty: 'hard' },
    { emoji: '🥒', name: 'Cucumber', category: 'food', difficulty: 'medium' },
    { emoji: '🌶️', name: 'Hot Pepper', category: 'food', difficulty: 'medium' },
    { emoji: '🫑', name: 'Bell Pepper', category: 'food', difficulty: 'medium' },
    { emoji: '🌽', name: 'Corn', category: 'food', difficulty: 'easy' },
    { emoji: '🥕', name: 'Carrot', category: 'food', difficulty: 'easy' },
    { emoji: '🧄', name: 'Garlic', category: 'food', difficulty: 'medium' },
    { emoji: '🧅', name: 'Onion', category: 'food', difficulty: 'medium' },
    { emoji: '🥔', name: 'Potato', category: 'food', difficulty: 'easy' },
    { emoji: '🍠', name: 'Roasted Sweet Potato', category: 'food', difficulty: 'hard' },
    { emoji: '🥐', name: 'Croissant', category: 'food', difficulty: 'medium' },
    { emoji: '🥖', name: 'Baguette Bread', category: 'food', difficulty: 'hard' },
    { emoji: '🍞', name: 'Bread', category: 'food', difficulty: 'easy' },
    { emoji: '🥨', name: 'Pretzel', category: 'food', difficulty: 'medium' },
    { emoji: '🥯', name: 'Bagel', category: 'food', difficulty: 'medium' },
    { emoji: '🧀', name: 'Cheese Wedge', category: 'food', difficulty: 'easy' },
    { emoji: '🥚', name: 'Egg', category: 'food', difficulty: 'easy' },
    { emoji: '🍳', name: 'Cooking', category: 'food', difficulty: 'easy' },
    { emoji: '🥓', name: 'Bacon', category: 'food', difficulty: 'easy' },
    { emoji: '🥩', name: 'Cut of Meat', category: 'food', difficulty: 'medium' },
    { emoji: '🍗', name: 'Poultry Leg', category: 'food', difficulty: 'medium' },
    { emoji: '🍖', name: 'Meat on Bone', category: 'food', difficulty: 'medium' },
    { emoji: '🌭', name: 'Hot Dog', category: 'food', difficulty: 'easy' },
    { emoji: '🍔', name: 'Hamburger', category: 'food', difficulty: 'easy' },
    { emoji: '🍟', name: 'French Fries', category: 'food', difficulty: 'easy' },
    { emoji: '🍕', name: 'Pizza', category: 'food', difficulty: 'easy' },
    { emoji: '🥪', name: 'Sandwich', category: 'food', difficulty: 'easy' },
    { emoji: '🌮', name: 'Taco', category: 'food', difficulty: 'easy' },
    { emoji: '🌯', name: 'Burrito', category: 'food', difficulty: 'medium' },
    { emoji: '🥙', name: 'Stuffed Flatbread', category: 'food', difficulty: 'hard' },
    { emoji: '🧆', name: 'Falafel', category: 'food', difficulty: 'hard' },
    { emoji: '🍝', name: 'Spaghetti', category: 'food', difficulty: 'easy' },
    { emoji: '🍜', name: 'Steaming Bowl', category: 'food', difficulty: 'medium' },
    { emoji: '🍲', name: 'Pot of Food', category: 'food', difficulty: 'medium' },
    { emoji: '🍛', name: 'Curry Rice', category: 'food', difficulty: 'medium' },
    { emoji: '🍣', name: 'Sushi', category: 'food', difficulty: 'easy' },
    { emoji: '🍱', name: 'Bento Box', category: 'food', difficulty: 'hard' },
    { emoji: '🥟', name: 'Dumpling', category: 'food', difficulty: 'medium' },
    { emoji: '🦪', name: 'Oyster', category: 'food', difficulty: 'hard' },
    { emoji: '🍤', name: 'Fried Shrimp', category: 'food', difficulty: 'medium' },
    { emoji: '🍙', name: 'Rice Ball', category: 'food', difficulty: 'hard' },
    { emoji: '🍘', name: 'Rice Cracker', category: 'food', difficulty: 'hard' },
    { emoji: '🍥', name: 'Fish Cake with Swirl', category: 'food', difficulty: 'hard' },
    { emoji: '🥠', name: 'Fortune Cookie', category: 'food', difficulty: 'medium' },
    { emoji: '🥮', name: 'Moon Cake', category: 'food', difficulty: 'hard' },
    { emoji: '🍢', name: 'Oden', category: 'food', difficulty: 'hard' },
    { emoji: '🍡', name: 'Dango', category: 'food', difficulty: 'hard' },
    { emoji: '🍧', name: 'Shaved Ice', category: 'food', difficulty: 'medium' },
    { emoji: '🍨', name: 'Ice Cream', category: 'food', difficulty: 'easy' },
    { emoji: '🍦', name: 'Soft Ice Cream', category: 'food', difficulty: 'easy' },
    { emoji: '🥧', name: 'Pie', category: 'food', difficulty: 'easy' },
    { emoji: '🧁', name: 'Cupcake', category: 'food', difficulty: 'easy' },
    { emoji: '🎂', name: 'Birthday Cake', category: 'food', difficulty: 'easy' },
    { emoji: '🍰', name: 'Shortcake', category: 'food', difficulty: 'medium' },
    { emoji: '🧇', name: 'Waffle', category: 'food', difficulty: 'medium' },
    { emoji: '🥞', name: 'Pancakes', category: 'food', difficulty: 'easy' },
    { emoji: '🍪', name: 'Cookie', category: 'food', difficulty: 'easy' },
    { emoji: '🍩', name: 'Doughnut', category: 'food', difficulty: 'easy' },
    { emoji: '🍯', name: 'Honey Pot', category: 'food', difficulty: 'medium' },
    { emoji: '🍬', name: 'Candy', category: 'food', difficulty: 'easy' },
    { emoji: '🍭', name: 'Lollipop', category: 'food', difficulty: 'easy' },
    { emoji: '🍮', name: 'Custard', category: 'food', difficulty: 'hard' },
    { emoji: '🍫', name: 'Chocolate Bar', category: 'food', difficulty: 'easy' },

    // Objects & Activities
    { emoji: '⚽', name: 'Soccer Ball', category: 'sports', difficulty: 'easy' },
    { emoji: '🏀', name: 'Basketball', category: 'sports', difficulty: 'easy' },
    { emoji: '🏈', name: 'American Football', category: 'sports', difficulty: 'medium' },
    { emoji: '⚾', name: 'Baseball', category: 'sports', difficulty: 'easy' },
    { emoji: '🥎', name: 'Softball', category: 'sports', difficulty: 'medium' },
    { emoji: '🎾', name: 'Tennis', category: 'sports', difficulty: 'easy' },
    { emoji: '🏐', name: 'Volleyball', category: 'sports', difficulty: 'medium' },
    { emoji: '🏉', name: 'Rugby Football', category: 'sports', difficulty: 'medium' },
    { emoji: '🥏', name: 'Flying Disc', category: 'sports', difficulty: 'hard' },
    { emoji: '🎱', name: 'Pool 8 Ball', category: 'sports', difficulty: 'medium' },
    { emoji: '🪀', name: 'Yo Yo', category: 'objects', difficulty: 'medium' },
    { emoji: '🏓', name: 'Ping Pong', category: 'sports', difficulty: 'medium' },
    { emoji: '🏸', name: 'Badminton', category: 'sports', difficulty: 'medium' },
    { emoji: '🥅', name: 'Goal Net', category: 'sports', difficulty: 'hard' },
    { emoji: '⛳', name: 'Flag in Hole', category: 'sports', difficulty: 'medium' },
    { emoji: '🪁', name: 'Kite', category: 'objects', difficulty: 'medium' },
    { emoji: '🏹', name: 'Bow and Arrow', category: 'sports', difficulty: 'medium' },
    { emoji: '🎣', name: 'Fishing Pole', category: 'sports', difficulty: 'medium' },
    { emoji: '🤿', name: 'Diving Mask', category: 'sports', difficulty: 'hard' },
    { emoji: '🩱', name: 'One Piece Swimsuit', category: 'objects', difficulty: 'hard' },
    { emoji: '🎿', name: 'Skis', category: 'sports', difficulty: 'medium' },
    { emoji: '🛷', name: 'Sled', category: 'sports', difficulty: 'medium' },
    { emoji: '🥌', name: 'Curling Stone', category: 'sports', difficulty: 'hard' },
    { emoji: '🎯', name: 'Bullseye', category: 'sports', difficulty: 'medium' },
    { emoji: '🪃', name: 'Boomerang', category: 'objects', difficulty: 'hard' },
    { emoji: '🎮', name: 'Video Game', category: 'objects', difficulty: 'easy' },
    { emoji: '🕹️', name: 'Joystick', category: 'objects', difficulty: 'medium' },
    { emoji: '🎲', name: 'Game Die', category: 'objects', difficulty: 'medium' },
    { emoji: '♠️', name: 'Spade Suit', category: 'objects', difficulty: 'medium' },
    { emoji: '♥️', name: 'Heart Suit', category: 'objects', difficulty: 'easy' },
    { emoji: '♦️', name: 'Diamond Suit', category: 'objects', difficulty: 'medium' },
    { emoji: '♣️', name: 'Club Suit', category: 'objects', difficulty: 'medium' },
    { emoji: '♟️', name: 'Chess Pawn', category: 'objects', difficulty: 'hard' },
    { emoji: '🃏', name: 'Joker', category: 'objects', difficulty: 'medium' },
    { emoji: '🀄', name: 'Mahjong Red Dragon', category: 'objects', difficulty: 'hard' },
    { emoji: '🎴', name: 'Flower Playing Cards', category: 'objects', difficulty: 'hard' },
    { emoji: '🎭', name: 'Performing Arts', category: 'objects', difficulty: 'medium' },
    { emoji: '🖼️', name: 'Framed Picture', category: 'objects', difficulty: 'medium' },
    { emoji: '🎨', name: 'Artist Palette', category: 'objects', difficulty: 'medium' },
    { emoji: '🧵', name: 'Thread', category: 'objects', difficulty: 'hard' },
    { emoji: '🪡', name: 'Sewing Needle', category: 'objects', difficulty: 'hard' },
    { emoji: '🧶', name: 'Yarn', category: 'objects', difficulty: 'medium' },
    { emoji: '🪢', name: 'Knot', category: 'objects', difficulty: 'hard' },

    // Nature & Weather
    { emoji: '🌞', name: 'Sun with Face', category: 'nature', difficulty: 'easy' },
    { emoji: '🌝', name: 'Full Moon Face', category: 'nature', difficulty: 'medium' },
    { emoji: '🌛', name: 'First Quarter Moon Face', category: 'nature', difficulty: 'hard' },
    { emoji: '🌜', name: 'Last Quarter Moon Face', category: 'nature', difficulty: 'hard' },
    { emoji: '🌚', name: 'New Moon Face', category: 'nature', difficulty: 'hard' },
    { emoji: '🌕', name: 'Full Moon', category: 'nature', difficulty: 'easy' },
    { emoji: '🌖', name: 'Waning Gibbous Moon', category: 'nature', difficulty: 'hard' },
    { emoji: '🌗', name: 'Last Quarter Moon', category: 'nature', difficulty: 'hard' },
    { emoji: '🌘', name: 'Waning Crescent Moon', category: 'nature', difficulty: 'hard' },
    { emoji: '🌑', name: 'New Moon', category: 'nature', difficulty: 'hard' },
    { emoji: '🌒', name: 'Waxing Crescent Moon', category: 'nature', difficulty: 'hard' },
    { emoji: '🌓', name: 'First Quarter Moon', category: 'nature', difficulty: 'hard' },
    { emoji: '🌔', name: 'Waxing Gibbous Moon', category: 'nature', difficulty: 'hard' },
    { emoji: '🌙', name: 'Crescent Moon', category: 'nature', difficulty: 'easy' },
    { emoji: '🌎', name: 'Earth Globe Americas', category: 'nature', difficulty: 'medium' },
    { emoji: '🌍', name: 'Earth Globe Europe Africa', category: 'nature', difficulty: 'medium' },
    { emoji: '🌏', name: 'Earth Globe Asia Australia', category: 'nature', difficulty: 'medium' },
    { emoji: '🪐', name: 'Ringed Planet', category: 'nature', difficulty: 'hard' },
    { emoji: '💫', name: 'Dizzy', category: 'nature', difficulty: 'medium' },
    { emoji: '⭐', name: 'Star', category: 'nature', difficulty: 'easy' },
    { emoji: '🌟', name: 'Glowing Star', category: 'nature', difficulty: 'easy' },
    { emoji: '✨', name: 'Sparkles', category: 'nature', difficulty: 'easy' },
    { emoji: '⚡', name: 'Lightning Bolt', category: 'nature', difficulty: 'easy' },
    { emoji: '☄️', name: 'Comet', category: 'nature', difficulty: 'medium' },
    { emoji: '💥', name: 'Collision', category: 'nature', difficulty: 'medium' },
    { emoji: '🔥', name: 'Fire', category: 'nature', difficulty: 'easy' },
    { emoji: '🌪️', name: 'Tornado', category: 'nature', difficulty: 'medium' },
    { emoji: '🌈', name: 'Rainbow', category: 'nature', difficulty: 'easy' },
    { emoji: '☀️', name: 'Sun', category: 'nature', difficulty: 'easy' },
    { emoji: '🌤️', name: 'Sun Behind Small Cloud', category: 'nature', difficulty: 'medium' },
    { emoji: '⛅', name: 'Sun Behind Cloud', category: 'nature', difficulty: 'medium' },
    { emoji: '🌥️', name: 'Sun Behind Large Cloud', category: 'nature', difficulty: 'medium' },
    { emoji: '☁️', name: 'Cloud', category: 'nature', difficulty: 'easy' },
    { emoji: '🌦️', name: 'Sun Behind Rain Cloud', category: 'nature', difficulty: 'hard' },
    { emoji: '🌧️', name: 'Cloud with Rain', category: 'nature', difficulty: 'medium' },
    { emoji: '⛈️', name: 'Cloud with Lightning and Rain', category: 'nature', difficulty: 'hard' },
    { emoji: '🌩️', name: 'Cloud with Lightning', category: 'nature', difficulty: 'medium' },
    { emoji: '🌨️', name: 'Cloud with Snow', category: 'nature', difficulty: 'medium' },
    { emoji: '❄️', name: 'Snowflake', category: 'nature', difficulty: 'easy' },
    { emoji: '☃️', name: 'Snowman', category: 'nature', difficulty: 'easy' },
    { emoji: '⛄', name: 'Snowman Without Snow', category: 'nature', difficulty: 'easy' },
    { emoji: '🌬️', name: 'Wind Face', category: 'nature', difficulty: 'hard' },
    { emoji: '💨', name: 'Dashing Away', category: 'nature', difficulty: 'medium' },
    { emoji: '💧', name: 'Droplet', category: 'nature', difficulty: 'easy' },
    { emoji: '💦', name: 'Sweat Droplets', category: 'nature', difficulty: 'medium' },
    { emoji: '☂️', name: 'Umbrella', category: 'objects', difficulty: 'easy' },
    { emoji: '🌊', name: 'Water Wave', category: 'nature', difficulty: 'easy' },
    { emoji: '🌫️', name: 'Fog', category: 'nature', difficulty: 'medium' }
];

// Game state management
const gameStates = new Map();
const leaderboard = [];

// Generate game question with distractors
function generateQuestion(playerId, difficulty = 'mixed', category = 'all') {
    let availableEmojis = [...emojis];
    
    // Filter by difficulty
    if (difficulty !== 'mixed') {
        availableEmojis = availableEmojis.filter(emoji => emoji.difficulty === difficulty);
    }
    
    // Filter by category
    if (category !== 'all') {
        availableEmojis = availableEmojis.filter(emoji => emoji.category === category);
    }
    
    if (availableEmojis.length === 0) {
        availableEmojis = [...emojis]; // Fallback to all emojis
    }
    
    // Select random correct emoji
    const correctEmoji = availableEmojis[Math.floor(Math.random() * availableEmojis.length)];
    
    // Generate distractors (incorrect options)
    const distractors = [];
    const allNames = emojis.map(e => e.name);
    
    while (distractors.length < 3) {
        const randomName = allNames[Math.floor(Math.random() * allNames.length)];
        if (randomName !== correctEmoji.name && !distractors.includes(randomName)) {
            distractors.push(randomName);
        }
    }
    
    // Create options array and shuffle
    const options = [correctEmoji.name, ...distractors];
    for (let i = options.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [options[i], options[j]] = [options[j], options[i]];
    }
    
    const question = {
        id: Date.now() + Math.random(),
        emoji: correctEmoji.emoji,
        correctAnswer: correctEmoji.name,
        options: options,
        category: correctEmoji.category,
        difficulty: correctEmoji.difficulty,
        hint: generateHint(correctEmoji),
        timestamp: Date.now()
    };
    
    // Store question in player's game state
    if (!gameStates.has(playerId)) {
        gameStates.set(playerId, {
            currentQuestion: null,
            score: 0,
            questionsAnswered: 0,
            correctAnswers: 0,
            startTime: Date.now(),
            difficulty: difficulty,
            category: category
        });
    }
    
    const gameState = gameStates.get(playerId);
    gameState.currentQuestion = question;
    
    return question;
}

// Generate hint for emoji
function generateHint(emojiObj) {
    const hints = {
        'faces': 'This is a facial expression or emotion',
        'animals': 'This is a living creature from the animal kingdom',
        'food': 'This is something you can eat or drink',
        'sports': 'This is related to sports or physical activities',
        'objects': 'This is a man-made object or item',
        'nature': 'This is related to nature, weather, or the cosmos'
    };
    
    return hints[emojiObj.category] || 'Think about what this emoji represents!';
}

// Calculate score based on difficulty and time
function calculateScore(difficulty, timeSpent, isCorrect) {
    if (!isCorrect) return 0;
    
    const baseScores = {
        'easy': 10,
        'medium': 20,
        'hard': 30
    };
    
    let score = baseScores[difficulty] || 10;
    
    // Time bonus (faster answers get more points)
    if (timeSpent < 5) score += 10;
    else if (timeSpent < 10) score += 5;
    else if (timeSpent < 15) score += 2;
    
    return score;
}

// Routes

// Serve main page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// API Routes

// Start new game or get question
app.post('/api/game/start', (req, res) => {
    const { playerId, playerName, difficulty = 'mixed', category = 'all' } = req.body;
    
    if (!playerId || !playerName) {
        return res.status(400).json({ 
            success: false, 
            message: 'Player ID and name are required' 
        });
    }
    
    // Initialize or reset game state
    gameStates.set(playerId, {
        playerName: playerName,
        currentQuestion: null,
        score: 0,
        questionsAnswered: 0,
        correctAnswers: 0,
        startTime: Date.now(),
        difficulty: difficulty,
        category: category,
        timeSpent: 0
    });
    
    const question = generateQuestion(playerId, difficulty, category);
    
    res.json({
        success: true,
        message: 'Game started successfully!',
        question: {
            id: question.id,
            emoji: question.emoji,
            options: question.options,
            category: question.category,
            difficulty: question.difficulty,
            questionNumber: 1
        }
    });
});

// Get new question
app.get('/api/game/question/:playerId', (req, res) => {
    const { playerId } = req.params;
    const { difficulty, category } = req.query;
    
    if (!gameStates.has(playerId)) {
        return res.status(400).json({ 
            success: false, 
            message: 'Game not found. Please start a new game.' 
        });
    }
    
    const gameState = gameStates.get(playerId);
    const question = generateQuestion(playerId, difficulty || gameState.difficulty, category || gameState.category);
    
    res.json({
        success: true,
        question: {
            id: question.id,
            emoji: question.emoji,
            options: question.options,
            category: question.category,
            difficulty: question.difficulty,
            questionNumber: gameState.questionsAnswered + 1
        }
    });
});

// Submit answer
app.post('/api/game/answer', (req, res) => {
    const { playerId, questionId, answer, timeSpent = 0 } = req.body;
    
    if (!playerId || !questionId || !answer) {
        return res.status(400).json({ 
            success: false, 
            message: 'Player ID, question ID, and answer are required' 
        });
    }
    
    if (!gameStates.has(playerId)) {
        return res.status(400).json({ 
            success: false, 
            message: 'Game not found. Please start a new game.' 
        });
    }
    
    const gameState = gameStates.get(playerId);
    const currentQuestion = gameState.currentQuestion;
    
    if (!currentQuestion || currentQuestion.id !== questionId) {
        return res.status(400).json({ 
            success: false, 
            message: 'Invalid question ID' 
        });
    }
    
    const isCorrect = answer.toLowerCase().trim() === currentQuestion.correctAnswer.toLowerCase().trim();
    const points = calculateScore(currentQuestion.difficulty, timeSpent, isCorrect);
    
    // Update game state
    gameState.questionsAnswered++;
    gameState.timeSpent += timeSpent;
    if (isCorrect) {
        gameState.correctAnswers++;
        gameState.score += points;
    }
    
    res.json({
        success: true,
        correct: isCorrect,
        correctAnswer: currentQuestion.correctAnswer,
        points: points,
        totalScore: gameState.score,
        questionsAnswered: gameState.questionsAnswered,
        correctAnswers: gameState.correctAnswers,
        explanation: `${currentQuestion.emoji} represents "${currentQuestion.correctAnswer}" - ${currentQuestion.hint}`,
        category: currentQuestion.category,
        difficulty: currentQuestion.difficulty
    });
});

// Get hint
app.get('/api/game/hint/:playerId', (req, res) => {
    const { playerId } = req.params;
    
    if (!gameStates.has(playerId)) {
        return res.status(400).json({ 
            success: false, 
            message: 'Game not found' 
        });
    }
    
    const gameState = gameStates.get(playerId);
    const currentQuestion = gameState.currentQuestion;
    
    if (!currentQuestion) {
        return res.status(400).json({ 
            success: false, 
            message: 'No current question' 
        });
    }
    
    res.json({
        success: true,
        hint: currentQuestion.hint
    });
});

// Get player stats
app.get('/api/game/stats/:playerId', (req, res) => {
    const { playerId } = req.params;
    
    if (!gameStates.has(playerId)) {
        return res.status(400).json({ 
            success: false, 
            message: 'Game not found' 
        });
    }
    
    const gameState = gameStates.get(playerId);
    const accuracy = gameState.questionsAnswered > 0 ? 
        Math.round((gameState.correctAnswers / gameState.questionsAnswered) * 100) : 0;
    
    res.json({
        success: true,
        stats: {
            score: gameState.score,
            questionsAnswered: gameState.questionsAnswered,
            correctAnswers: gameState.correctAnswers,
            accuracy: accuracy,
            timeSpent: gameState.timeSpent,
            averageTimePerQuestion: gameState.questionsAnswered > 0 ? 
                Math.round(gameState.timeSpent / gameState.questionsAnswered) : 0
        }
    });
});

// Submit final score to leaderboard
app.post('/api/game/finish', (req, res) => {
    const { playerId } = req.body;
    
    if (!gameStates.has(playerId)) {
        return res.status(400).json({ 
            success: false, 
            message: 'Game not found' 
        });
    }
    
    const gameState = gameStates.get(playerId);
    const totalTime = Date.now() - gameState.startTime;
    const accuracy = gameState.questionsAnswered > 0 ? 
        Math.round((gameState.correctAnswers / gameState.questionsAnswered) * 100) : 0;
    
    const leaderboardEntry = {
        playerId: playerId,
        playerName: gameState.playerName,
        score: gameState.score,
        questionsAnswered: gameState.questionsAnswered,
        correctAnswers: gameState.correctAnswers,
        accuracy: accuracy,
        totalTime: Math.round(totalTime / 1000), // Convert to seconds
        difficulty: gameState.difficulty,
        category: gameState.category,
        timestamp: Date.now()
    };
    
    leaderboard.push(leaderboardEntry);
    
    // Sort leaderboard by score (descending)
    leaderboard.sort((a, b) => b.score - a.score);
    
    // Keep only top 50 entries
    if (leaderboard.length > 50) {
        leaderboard.splice(50);
    }
    
    // Clean up game state
    gameStates.delete(playerId);
    
    res.json({
        success: true,
        message: 'Game finished successfully!',
        finalStats: leaderboardEntry,
        rank: leaderboard.findIndex(entry => 
            entry.playerId === playerId && 
            entry.timestamp === leaderboardEntry.timestamp
        ) + 1
    });
});

// Get leaderboard
app.get('/api/leaderboard', (req, res) => {
    const { limit = 10, difficulty, category } = req.query;
    
    let filteredLeaderboard = [...leaderboard];
    
    // Filter by difficulty
    if (difficulty && difficulty !== 'all') {
        filteredLeaderboard = filteredLeaderboard.filter(entry => entry.difficulty === difficulty);
    }
    
    // Filter by category
    if (category && category !== 'all') {
        filteredLeaderboard = filteredLeaderboard.filter(entry => entry.category === category);
    }
    
    // Limit results
    filteredLeaderboard = filteredLeaderboard.slice(0, parseInt(limit));
    
    res.json({
        success: true,
        leaderboard: filteredLeaderboard,
        total: filteredLeaderboard.length
    });
});

// Get game statistics
app.get('/api/stats', (req, res) => {
    const totalGames = leaderboard.length;
    const totalQuestions = leaderboard.reduce((sum, entry) => sum + entry.questionsAnswered, 0);
    const totalCorrectAnswers = leaderboard.reduce((sum, entry) => sum + entry.correctAnswers, 0);
    const averageScore = totalGames > 0 ? 
        Math.round(leaderboard.reduce((sum, entry) => sum + entry.score, 0) / totalGames) : 0;
    const averageAccuracy = totalGames > 0 ? 
        Math.round(leaderboard.reduce((sum, entry) => sum + entry.accuracy, 0) / totalGames) : 0;
    const bestScore = leaderboard.length > 0 ? leaderboard[0].score : 0;
    
    // Category statistics
    const categoryStats = {};
    emojis.forEach(emoji => {
        if (!categoryStats[emoji.category]) {
            categoryStats[emoji.category] = 0;
        }
        categoryStats[emoji.category]++;
    });
    
    // Difficulty statistics
    const difficultyStats = {};
    emojis.forEach(emoji => {
        if (!difficultyStats[emoji.difficulty]) {
            difficultyStats[emoji.difficulty] = 0;
        }
        difficultyStats[emoji.difficulty]++;
    });
    
    res.json({
        success: true,
        stats: {
            totalGames: totalGames,
            totalQuestions: totalQuestions,
            totalCorrectAnswers: totalCorrectAnswers,
            averageScore: averageScore,
            averageAccuracy: averageAccuracy,
            bestScore: bestScore,
            totalEmojis: emojis.length,
            categoryStats: categoryStats,
            difficultyStats: difficultyStats,
            activePlayers: gameStates.size
        }
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err.stack);
    res.status(500).json({ 
        success: false, 
        message: 'Something went wrong!' 
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ 
        success: false, 
        message: 'Route not found' 
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`\n🎯 Emoji Guessing Game Server Started Successfully!`);
    console.log(`📍 Server running on: http://localhost:${PORT}`);
    console.log(`⏰ Server started at: ${new Date().toISOString()}\n`);
    
    console.log(`📊 Emoji Database:`);
    const categoryStats = {};
    const difficultyStats = {};
    
    emojis.forEach(emoji => {
        categoryStats[emoji.category] = (categoryStats[emoji.category] || 0) + 1;
        difficultyStats[emoji.difficulty] = (difficultyStats[emoji.difficulty] || 0) + 1;
    });
    
    Object.entries(categoryStats).forEach(([category, count]) => {
        console.log(`  ${category}: ${count} emojis`);
    });
    
    console.log(`\n🎮 Difficulty Levels:`);
    Object.entries(difficultyStats).forEach(([difficulty, count]) => {
        console.log(`  ${difficulty}: ${count} emojis`);
    });
    
    console.log(`\n🎮 Game Features:`);
    console.log(`  ✓ ${emojis.length} emojis across ${Object.keys(categoryStats).length} categories`);
    console.log(`  ✓ Multiple difficulty levels`);
    console.log(`  ✓ Smart scoring system with time bonuses`);
    console.log(`  ✓ Hint system for each emoji`);
    console.log(`  ✓ Real-time leaderboard`);
    console.log(`  ✓ Comprehensive statistics`);
    console.log(`  ✓ Customizable game modes`);
    
    console.log(`\n✨ Ready to play the emoji guessing game!`);
});