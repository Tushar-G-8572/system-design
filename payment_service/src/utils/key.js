import crypto from 'crypto'

export const createIdempotentKey = async({fromAccountId,toAccountId,amount})=>{
 const key = crypto.createHash('sha256').update(`${fromAccountId}-${toAccountId}-${amount}`).digest('hex');
 return key;
}