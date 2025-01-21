import bcrypt from 'bcrypt'

export const hasPassword = async (password: string): Promise<string> => {
  return await bcrypt.hash(password, 10);
}

export const comparePassword = async (hashPassword: string, password: string): Promise<boolean> => {
  const isPasswordSame: boolean = await bcrypt.compare(hashPassword, password);
  return isPasswordSame;
};