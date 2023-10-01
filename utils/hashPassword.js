import bcrypt from 'bcryptjs'

export const hashPassword = async (password) => {
  const salt = bcrypt.genSaltSync(10)
  const hash = await bcrypt.hash(password, salt)
  return hash
}
