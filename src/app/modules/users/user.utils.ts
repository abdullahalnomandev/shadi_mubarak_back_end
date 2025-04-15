import { User } from './user.model';

export const findLastUserId = async (): Promise<string | undefined> => {
  const lastUser = await User.findOne({}, { bioDataNo: 1, _id: 0 })
    .sort({ createdAt: -1 }) 
    .lean();

  return lastUser?.bioDataNo;
};

export const generateUserId = async (): Promise<string> => {
  const lastId = await findLastUserId(); 

  let numericPart = 0;

  if (lastId) {
    numericPart = parseInt(lastId.replace('SM-', '')) || 0;
  }

  const newIdNumber = numericPart + 1;
  const newId = `SM-${newIdNumber.toString().padStart(3, '0')}`; 

  return newId;
};
