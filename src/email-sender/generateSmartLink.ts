import { v4 as uuidv4 } from 'uuid';

const token = uuidv4();
const smartLink = `https://yourdomain.com/verify?token=${token}`;
console.log(smartLink);