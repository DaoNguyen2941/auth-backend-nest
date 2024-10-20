import * as bcrypt from 'bcrypt';

export async function hashData(data: string): Promise<string> {
    const saltOrRounds = 10;
    const salt = await bcrypt.genSalt(saltOrRounds);
    const hashData = await bcrypt.hash(data, salt);
    return hashData
}